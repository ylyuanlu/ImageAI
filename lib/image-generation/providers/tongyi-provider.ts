/**
 * 阿里云通义千问 Provider
 * 实现图像生成 Provider 接口
 */

import {
    ImageGenerationProvider,
    ImageGenerationParams,
    ImageGenerationResult,
    ProviderInfo,
    ProviderCapabilities,
    ProviderConfig
} from '../types';

/**
 * 通义千问 Provider 配置
 */
interface TongyiConfig extends ProviderConfig {
    apiKey: string;
    model?: string;  // 默认使用的模型
}

/**
 * 通义千问图像生成 Provider
 */
export class TongyiProvider implements ImageGenerationProvider {
    readonly name = 'tongyi';
    private config: TongyiConfig;
    private currentModel: string = 'qwen-image-edit-max';

    // 支持的模型列表（按优先级排序）
    private readonly supportedModels = [
        'qwen-image-edit-max',
        'qwen-image-edit-plus',
        'qwen-image-edit',
        'wanx-virtual-model-v1',
        'wanx-v1'
    ];

    constructor(config: TongyiConfig) {
        this.config = {
            timeout: 180000,
            maxRetries: 2,
            ...config
        };
        if (config.model) {
            this.currentModel = config.model;
        }
    }

    /**
     * 获取 Provider 信息
     */
    getInfo(): ProviderInfo {
        return {
            name: this.name,
            displayName: '阿里云通义千问',
            description: '阿里云通义千问图像生成与编辑服务，支持多图融合、虚拟试衣等功能',
            capabilities: this.getCapabilities(),
            models: this.supportedModels
        };
    }

    /**
     * 获取 Provider 能力
     */
    private getCapabilities(): ProviderCapabilities {
        return {
            supportsMultipleImages: true,
            supportsImageEditing: true,
            supportsTextToImage: true,
            supportsImageToImage: true,
            maxInputImages: 3,
            maxOutputImages: 6,
            supportedFormats: ['JPEG', 'JPG', 'PNG', 'WEBP', 'BMP', 'TIFF', 'GIF'],
            maxImageSize: 10 * 1024 * 1024  // 10MB
        };
    }

    /**
     * 验证配置
     */
    validateConfig(): boolean {
        return !!(this.config.apiKey && this.config.apiKey.startsWith('sk-'));
    }

    /**
     * 生成图像
     * 实现多模型降级策略
     * 支持图生图（有输入图片）和文生图（无输入图片）
     */
    async generate(params: ImageGenerationParams): Promise<ImageGenerationResult> {
        const startTime = Date.now();

        // 检测是否为纯文生图（没有输入图片或图片为空）
        const isTextToImage = !params.modelImage || params.modelImage === '';

        if (isTextToImage) {
            console.log('[TongyiProvider] 检测到文生图请求，使用 qwen-image-max 模型');
            try {
                const result = await this.callQwenTextToImage(params);
                return {
                    ...result,
                    latencyMs: Date.now() - startTime
                };
            } catch (error: any) {
                console.warn('Qwen-Image 文生图失败，尝试万相:', error.message);
                // 降级到万相文生图
                const result = await this.callWanxText2Image(params);
                return {
                    ...result,
                    latencyMs: Date.now() - startTime
                };
            }
        }

        // 图生图流程
        try {
            // 优先尝试使用 qwen-image-edit-max（支持多图融合）
            const result = await this.callQwenImageEditMax(params);
            return {
                ...result,
                latencyMs: Date.now() - startTime
            };
        } catch (error: any) {
            console.warn('Qwen-Image-Edit-Max 失败，尝试降级:', error.message);
            
            try {
                // 降级到 Plus 版本
                const result = await this.callQwenImageEditPlus(params);
                return {
                    ...result,
                    latencyMs: Date.now() - startTime
                };
            } catch (error2: any) {
                console.warn('Qwen-Image-Edit-Plus 失败，尝试基础版:', error2.message);
                
                try {
                    // 降级到基础版
                    const result = await this.callQwenImageEditBase(params);
                    return {
                        ...result,
                        latencyMs: Date.now() - startTime
                    };
                } catch (error3: any) {
                    console.warn('Qwen-Image-Edit 失败，使用万相文生图:', error3.message);
                    
                    // 最后回退到万相文生图
                    const result = await this.callWanxText2Image(params);
                    return {
                        ...result,
                        latencyMs: Date.now() - startTime
                    };
                }
            }
        }
    }

    /**
     * 调用 Qwen-Image-Edit-Max
     * 支持多图融合（模特 + 多张服装）和批量生成
     * 支持服装类型标记，生成更精准的提示词
     */
    private async callQwenImageEditMax(params: ImageGenerationParams): Promise<ImageGenerationResult> {
        const instruction = this.buildInstruction(params);
        
        // 构建消息内容，支持多张服装图片
        const content: any[] = [{ image: this.ensureDataUrl(params.modelImage) }];
        
        // 优先使用带类型的服装图片
        const outfitImagesWithType = params.outfitImagesWithType?.slice(0, 3);
        const outfitImages = outfitImagesWithType?.map(item => item.image) || params.outfitImages?.slice(0, 3) || [params.outfitImage];
        
        outfitImages.forEach(img => {
            content.push({ image: this.ensureDataUrl(img) });
        });
        
        // 类型映射：将英文类型转换为中文
        const typeToChinese: Record<string, string> = {
            'top': '上装',
            'bottom': '下装',
            'outerwear': '外套',
            'fullbody': '连体装',
            'accessory': '配饰'
        };
        
        // 构建提示词 - 支持组合穿搭（多图）
        let promptText: string;
        const scheme = params.outfitSchemeInfo;
        
        // 构建服装描述
        let clothingDescription = '';
        if (scheme?.items && scheme.items.length > 0) {
            // 使用组合穿搭的单品信息
            const itemNames = scheme.items.map(item => item.name).join('、');
            clothingDescription = `"${scheme.name}"（${itemNames}）`;
        } else if (scheme) {
            // 使用穿搭名称
            clothingDescription = `"${scheme.name}"`;
        }
        
        if (outfitImages.length === 1) {
            // 单张服装（单件穿搭）
            if (scheme) {
                promptText = `将图1中的模特的服装替换为图2中的${clothingDescription}，${scheme.category}${scheme.style}风格，${instruction}，保持模特的面部特征、发型和表情不变`;
            } else {
                const typeLabel = typeToChinese[outfitImagesWithType?.[0]?.type || ''] || outfitImagesWithType?.[0]?.type || '服装';
                promptText = `将图1中的模特的服装替换为图2的${typeLabel}，${instruction}，保持模特的面部特征、发型和表情不变`;
            }
        } else if (outfitImages.length === 2) {
            // 两张服装（两件套穿搭）
            if (scheme) {
                promptText = `将图1中的模特的服装替换为图2和图3中的${clothingDescription}搭配，${scheme.category}${scheme.style}风格，${instruction}，保持模特的面部特征、发型和表情不变`;
            } else {
                const type1 = typeToChinese[outfitImagesWithType?.[0]?.type || ''] || outfitImagesWithType?.[0]?.type || '上装';
                const type2 = typeToChinese[outfitImagesWithType?.[1]?.type || ''] || outfitImagesWithType?.[1]?.type || '下装';
                promptText = `将图1中的模特的服装替换为图2的${type1}和图3的${type2}，${instruction}，保持模特的面部特征、发型和表情不变`;
            }
        } else {
            // 三张服装（三件套穿搭）
            if (scheme) {
                promptText = `将图1中的模特的服装替换为图2、图3和图4中的${clothingDescription}搭配，${scheme.category}${scheme.style}风格，${instruction}，保持模特的面部特征、发型和表情不变`;
            } else {
                const type1 = typeToChinese[outfitImagesWithType?.[0]?.type || ''] || outfitImagesWithType?.[0]?.type || '上装';
                const type2 = typeToChinese[outfitImagesWithType?.[1]?.type || ''] || outfitImagesWithType?.[1]?.type || '下装';
                const type3 = typeToChinese[outfitImagesWithType?.[2]?.type || ''] || outfitImagesWithType?.[2]?.type || '外套';
                promptText = `将图1中的模特的服装替换为图2的${type1}、图3的${type2}和图4的${type3}，${instruction}，保持模特的面部特征、发型和表情不变`;
            }
        }
        
        content.push({ text: promptText });
        
        // 设置生成数量（1-6张）
        const generateCount = Math.min(Math.max(params.count || 1, 1), 6);
        
        const requestBody = {
            model: 'qwen-image-edit-max',
            input: {
                messages: [
                    {
                        role: 'user',
                        content
                    }
                ]
            },
            parameters: {
                n: generateCount,
                size: `${params.width || 1024}*${params.height || 1024}`,
                prompt_extend: true,
                watermark: false,
                seed: params.seed
            }
        };

        // 打印关键请求参数（用于调试，不显示图片内容）
        console.log('========================================');
        console.log('[TongyiProvider] 调用通义千问 API');
        console.log('========================================');
        console.log('模型:', requestBody.model);
        console.log('生成数量 (n):', generateCount);
        console.log('图片尺寸:', requestBody.parameters.size);
        console.log('提示词扩展:', requestBody.parameters.prompt_extend);
        console.log('水印:', requestBody.parameters.watermark);
        console.log('随机种子:', params.seed || '未设置');
        console.log('输入图片数量:', content.length - 1); // 减去 text 部分
        console.log('提示词:', promptText);
        console.log('----------------------------------------');
        console.log('请求体结构（不含图片数据）:');
        console.log(JSON.stringify({
            model: requestBody.model,
            input: {
                messages: [{
                    role: 'user',
                    content: content.map((item: any) => ({
                        type: item.image ? 'image' : 'text',
                        hasImage: !!item.image,
                        text: item.text ? item.text.substring(0, 100) + '...' : undefined
                    }))
                }]
            },
            parameters: requestBody.parameters
        }, null, 2));
        console.log('========================================');

        const result = await this.callApi('https://dashscope.aliyuncs.com/api/v1/services/aigc/multimodal-generation/generation', requestBody);
        
        console.log('[TongyiProvider] API 返回结果:');
        console.log('状态:', result.output?.choices?.[0]?.finish_reason || 'unknown');
        console.log('生成图片数量:', result.output?.choices?.[0]?.message?.content?.filter((item: any) => item.image)?.length || 0);
        console.log('请求ID:', result.request_id);
        console.log('========================================');
        
        return this.parseResult(result, 'qwen-image-edit-max');
    }

    /**
     * 调用 Qwen-Image-Edit-Plus
     */
    private async callQwenImageEditPlus(params: ImageGenerationParams): Promise<ImageGenerationResult> {
        const instruction = this.buildInstruction(params);
        
        const requestBody = {
            model: 'qwen-image-edit-plus',
            input: {
                messages: [
                    {
                        role: 'user',
                        content: [
                            { image: this.ensureDataUrl(params.modelImage) },
                            { image: this.ensureDataUrl(params.outfitImage) },
                            { text: `图1中的模特穿着图2中的服装，${instruction}，保持模特的面部特征不变` }
                        ]
                    }
                ]
            },
            parameters: {
                n: 1,
                size: `${params.width || 1024}*${params.height || 1024}`,
                prompt_extend: true,
                watermark: false
            }
        };

        const result = await this.callApi('https://dashscope.aliyuncs.com/api/v1/services/aigc/multimodal-generation/generation', requestBody);
        return this.parseResult(result, 'qwen-image-edit-plus');
    }

    /**
     * 调用基础版 Qwen-Image-Edit
     */
    private async callQwenImageEditBase(params: ImageGenerationParams): Promise<ImageGenerationResult> {
        const instruction = this.buildInstruction(params);
        
        const requestBody = {
            model: 'qwen-image-edit',
            input: {
                messages: [
                    {
                        role: 'user',
                        content: [
                            { image: this.ensureDataUrl(params.modelImage) },
                            { text: `${instruction}，保持人物面部特征不变，生成高质量时尚照片` }
                        ]
                    }
                ]
            },
            parameters: {
                n: 1
            }
        };

        const result = await this.callApi('https://dashscope.aliyuncs.com/api/v1/services/aigc/multimodal-generation/generation', requestBody);
        return this.parseResult(result, 'qwen-image-edit');
    }

    /**
     * 调用 Qwen-Image 文生图
     * 用于纯文本生成图像（如姿势生成）
     */
    private async callQwenTextToImage(params: ImageGenerationParams): Promise<ImageGenerationResult> {
        const prompt = params.prompt || this.buildInstruction(params);
        
        const requestBody = {
            model: 'qwen-image-max',
            input: {
                messages: [
                    {
                        role: 'user',
                        content: [
                            {
                                text: prompt
                            }
                        ]
                    }
                ]
            },
            parameters: {
                negative_prompt: params.negativePrompt || '低分辨率，低画质，肢体畸形，手指畸形，画面过饱和，蜡像感，人脸无细节，过度光滑，画面具有AI感，构图混乱，背景杂乱，多人，局部裁剪，半身像，大头照',
                prompt_extend: true,
                watermark: false,
                size: `${params.width || 1024}*${params.height || 1024}`
            }
        };

        console.log('[TongyiProvider] 调用 Qwen-Image 文生图');
        console.log('模型:', requestBody.model);
        console.log('尺寸:', requestBody.parameters.size);
        console.log('提示词长度:', prompt.length);

        const result = await this.callApi('https://dashscope.aliyuncs.com/api/v1/services/aigc/multimodal-generation/generation', requestBody);
        
        console.log('[TongyiProvider] 文生图成功, requestId:', result.request_id);
        
        return this.parseResult(result, 'qwen-image-max');
    }

    /**
     * 调用万相文生图（回退方案）
     */
    private async callWanxText2Image(params: ImageGenerationParams): Promise<ImageGenerationResult> {
        const instruction = this.buildInstruction(params);
        const prompt = `一位时尚的模特，${instruction}，高质量摄影，专业灯光，清晰细节，时尚杂志风格`;

        const requestBody = {
            model: 'wanx-v1',
            input: { prompt },
            parameters: {
                size: `${params.width || 1024}*${params.height || 1024}`,
                n: 1
            }
        };

        // 万相使用异步API
        const response = await this.callApi('https://dashscope.aliyuncs.com/api/v1/services/aigc/text2image/image-synthesis', requestBody, true);
        const taskId = response.output?.task_id;
        
        if (!taskId) {
            throw new Error('未返回任务 ID');
        }

        // 轮询任务状态
        const result = await this.pollTaskStatus(taskId);
        return {
            status: 'success',
            url: result,
            provider: this.name,
            model: 'wanx-v1',
            latencyMs: 0  // 由上层计算
        };
    }

    /**
     * 调用 API
     */
    private async callApi(url: string, body: any, isAsync: boolean = false): Promise<any> {
        const headers: Record<string, string> = {
            'Authorization': `Bearer ${this.config.apiKey}`,
            'Content-Type': 'application/json'
        };

        if (isAsync) {
            headers['X-DashScope-Async'] = 'enable';
        }

        const response = await fetch(url, {
            method: 'POST',
            headers,
            body: JSON.stringify(body)
        });

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.message || result.code || `HTTP ${response.status}`);
        }

        return result;
    }

    /**
     * 解析结果
     * 支持单张和多张图片返回
     */
    private parseResult(result: any, model: string): ImageGenerationResult {
        console.log('[TongyiProvider] 开始解析API响应...');
        
        // 打印响应结构（不含图片URL）
        const responseSummary = {
            hasOutput: !!result.output,
            choicesCount: result.output?.choices?.length || 0,
            finishReason: result.output?.choices?.[0]?.finish_reason,
            contentCount: result.output?.choices?.[0]?.message?.content?.length || 0,
            requestId: result.request_id,
            usage: result.usage
        };
        console.log('[TongyiProvider] 响应摘要:', JSON.stringify(responseSummary, null, 2));
        
        if (result.output?.choices && result.output.choices.length > 0) {
            const choice = result.output.choices[0];
            
            if (choice.message?.content) {
                console.log('[TongyiProvider] message content数量:', choice.message.content.length);
                
                // 获取所有图片
                const imageContents = choice.message.content.filter((item: any) => item.image);
                const images = imageContents.map((item: any) => item.image).filter(Boolean);
                
                console.log('[TongyiProvider] 找到的图片数量:', images.length);
                
                if (images.length > 0) {
                    console.log('[TongyiProvider] 解析成功:', {
                        totalImages: images.length,
                        firstImageUrl: images[0]?.substring(0, 60) + '...'
                    });
                    
                    return {
                        status: 'success',
                        url: images[0], // 第一张图片
                        urls: images,   // 所有图片
                        provider: this.name,
                        model,
                        latencyMs: 0  // 由上层计算
                    };
                }
            }
        }
        throw new Error('无法解析响应结果');
    }

    /**
     * 轮询异步任务状态
     */
    private async pollTaskStatus(taskId: string): Promise<string> {
        const maxAttempts = 120;
        
        for (let attempts = 0; attempts < maxAttempts; attempts++) {
            await this.delay(1000);

            const response = await fetch(
                `https://dashscope.aliyuncs.com/api/v1/tasks/${taskId}`,
                {
                    headers: { 'Authorization': `Bearer ${this.config.apiKey}` }
                }
            );

            const result = await response.json();
            const taskStatus = result.output?.task_status;

            if (taskStatus === 'SUCCEEDED') {
                const results = result.output?.results;
                if (results && results.length > 0) {
                    return results[0].url;
                }
                throw new Error('任务成功但未返回图片');
            } else if (taskStatus === 'FAILED') {
                throw new Error(result.output?.message || '任务失败');
            }
        }

        throw new Error('任务执行超时');
    }

    /**
     * 构建编辑指令
     */
    private buildInstruction(params: ImageGenerationParams): string {
        const parts: string[] = [];
        
        if (params.style) parts.push(`风格：${params.style}`);
        if (params.pose) parts.push(`姿势：${params.pose}`);
        if (params.lighting) parts.push(`灯光：${params.lighting}`);
        if (params.background) parts.push(`背景：${params.background}`);
        if (params.colorTone) parts.push(`色调：${params.colorTone}`);
        if (params.prompt) parts.push(params.prompt);

        return parts.join('，') || '生成高质量的时尚照片';
    }

    /**
     * 确保图片数据是完整的 data URL 格式
     */
    private ensureDataUrl(data: string): string {
        if (data.startsWith('data:')) {
            return data;
        }
        return `data:image/jpeg;base64,${data}`;
    }

    /**
     * 延迟函数
     */
    private delay(ms: number): Promise<void> {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    /**
     * 健康检查
     */
    async healthCheck(): Promise<{ healthy: boolean; message: string }> {
        if (!this.validateConfig()) {
            return { healthy: false, message: '配置无效：缺少 API Key' };
        }

        try {
            // 尝试一个简单的请求来检查服务状态
            const response = await fetch(
                'https://dashscope.aliyuncs.com/api/v1/services/aigc/multimodal-generation/generation',
                {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${this.config.apiKey}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        model: 'qwen-image-edit',
                        input: { messages: [] }
                    })
                }
            );

            if (response.status === 400) {
                // 400 表示请求格式错误，但服务是正常的
                return { healthy: true, message: '服务正常' };
            }

            return { healthy: true, message: '服务正常' };
        } catch (error: any) {
            return { healthy: false, message: `服务异常: ${error.message}` };
        }
    }
}

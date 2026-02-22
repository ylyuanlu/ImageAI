import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import {
    initializeFromEnv,
    getImageGenerationProvider,
    checkImageGenerationHealth,
    type ImageGenerationParams
} from '@/lib/image-generation';

// 初始化 Provider 配置
initializeFromEnv();

/**
 * AI 图像生成 API
 * 使用统一的抽象层，支持多种 AI 提供商
 * 当前支持：阿里云通义千问
 * 可扩展：Google Gemini、OpenAI 等
 */
export async function POST(req: NextRequest) {
    try {
        const data = await req.json();
        console.log('[Generate API] 收到请求:', {
            hasModelImage: !!data.modelImage,
            hasOutfitImage: !!data.outfitImage,
            outfitImagesCount: data.outfitImages?.length || 0,
            count: data.count,
            pose: data.pose,
            style: data.style
        });
        
        const {
            modelImage,
            outfitImage,
            outfitImages, // 多张服装图片（可选）
            outfitImagesWithType, // 带类型的服装图片（推荐）
            outfitSchemeInfo, // 穿搭方案信息
            outfitSource, // 图片来源类型
            count, // 生成数量
            pose = '正面站姿',
            style = '写真',
            lighting = '自然光',
            background = '纯色',
            colorTone = '冷暖平衡',
            prompt,
            seed,
            width = 1024,
            height = 1024
        } = data;

        // 验证必要参数
        // 支持 outfitImage 单张或 outfitImages 数组
        const hasOutfit = outfitImage || (outfitImages && outfitImages.length > 0);
        if (!modelImage || !hasOutfit) {
            return NextResponse.json(
                { status: 'error', message: '缺少必要参数：模特参考图和服装参考图不能为空' },
                { status: 400 }
            );
        }
        
        // 如果没有 outfitImage 但有 outfitImages，使用第一张作为 outfitImage
        const effectiveOutfitImage = outfitImage || (outfitImages && outfitImages[0]);

        // 构建生成参数
        const params: ImageGenerationParams = {
            modelImage,
            outfitImage: effectiveOutfitImage,
            outfitImages: outfitImages?.slice(0, 3), // 最多3张服装图片
            outfitImagesWithType: outfitImagesWithType?.slice(0, 3), // 带类型的服装图片
            outfitSchemeInfo, // 穿搭方案信息
            outfitSource, // 图片来源类型
            count: count || 1, // 生成数量（1-6）
            pose,
            style,
            lighting,
            background,
            colorTone,
            prompt,
            seed,
            width,
            height
        };
        
        console.log('[Generate API] 调用 Provider 参数:', {
            count: params.count,
            outfitImagesCount: params.outfitImages?.length || 1
        });

        // 获取 Provider 并生成图像
        const provider = getImageGenerationProvider();
        const result = await provider.generate(params);

        if (result.status === 'error') {
            return NextResponse.json(
                {
                    status: 'error',
                    message: result.error,
                    errorCode: result.errorCode,
                    latencyMs: result.latencyMs,
                    provider: result.provider
                },
                { status: 500 }
            );
        }

        console.log('[Generate API] 生成成功:', {
            imageCount: result.urls?.length || 1,
            provider: result.provider,
            model: result.model,
            latencyMs: result.latencyMs
        });
        
        return NextResponse.json({
            status: 'success',
            url: result.url,
            urls: result.urls,
            latencyMs: result.latencyMs,
            provider: result.provider,
            model: result.model
        });

    } catch (error: any) {
        console.error('图像生成错误:', error);
        return NextResponse.json(
            {
                status: 'error',
                message: error.message || '服务器错误',
                errorType: error.constructor?.name
            },
            { status: 500 }
        );
    }
}

/**
 * 健康检查接口
 * 返回当前配置的 Provider 信息和健康状态
 */
export async function GET() {
    try {
        const provider = getImageGenerationProvider();
        const info = provider.getInfo();
        const health = await provider.healthCheck();

        return NextResponse.json({
            status: 'ok',
            message: 'AI 图像生成 API',
            provider: {
                name: info.name,
                displayName: info.displayName,
                description: info.description,
                models: info.models,
                capabilities: info.capabilities
            },
            health: {
                status: health.healthy ? 'healthy' : 'unhealthy',
                message: health.message
            }
        });
    } catch (error: any) {
        return NextResponse.json({
            status: 'error',
            message: '服务未配置',
            error: error.message
        }, { status: 503 });
    }
}

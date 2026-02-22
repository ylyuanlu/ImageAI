/**
 * 姿势生成 API
 * 使用统一的图像生成抽象层，支持多种 AI 提供商
 * 通过配置可切换：通义千问、Gemini、OpenAI 等
 */
import { NextRequest, NextResponse } from 'next/server';
import { authenticateRequest } from '@/lib/auth';
import {
    initializeFromEnv,
    getImageGenerationProvider,
    type ImageGenerationParams
} from '@/lib/image-generation';

// 初始化 Provider 配置
initializeFromEnv();

/**
 * 构建姿势生成参数
 * 将姿势描述转换为统一的 ImageGenerationParams 格式
 * 
 * 提示词优化策略：
 * 1. 使用结构化格式（XML标签）提高 AI 理解度
 * 2. 添加负面提示词（negative prompt）避免常见错误
 * 3. 针对不同风格提供具体的渲染要求
 * 4. 强调全身像和姿势的清晰度
 */
function buildPoseGenerationParams(description: string, style: string = '写实'): ImageGenerationParams {
    // 风格特定的渲染要求
    const styleRequirements: Record<string, string> = {
        '写实': '照片级真实感，自然光照，细腻的皮肤纹理，真实的布料褶皱',
        '时尚杂志': '高级时尚摄影风格，戏剧性打光，高对比度，Vogue/Elle杂志质感',
        '艺术写真': '艺术摄影风格，柔和光线，唯美氛围，画意质感',
        '电商展示': '干净简洁的影棚光，中性背景，清晰展示身体线条，适合后期合成'
    };

    const styleSpecific = styleRequirements[style] || styleRequirements['写实'];

    // 构建优化的提示词 - 使用结构化格式
    const prompt = `<task>
生成一张专业的时尚模特全身姿势参考图，用于AI服装试穿系统。
</task>

<pose_description>
${description}
</pose_description>

<requirements>
<composition>
- 全身像，从头顶到脚底完整展示
- 模特位于画面中央，占据画面高度的85-90%
- 正面或3/4侧面角度，清晰展示姿势
- 留白适中，不要裁切身体任何部位
</composition>

<pose_quality>
- 姿势清晰明确，动作自然流畅
- 身体重心稳定，姿态优雅专业
- 四肢位置明确，无遮挡或重叠
- 适合展示各类服装的身体姿态
</pose_quality>

<model_spec>
- 专业模特身材比例（头身比约1:7.5）
- 健康的体态，肌肉线条自然
- 表情中性自然，不抢镜
- 发型简洁，不遮挡身体线条
</model_spec>

<rendering>
- ${styleSpecific}
- 3:4竖构图，高清细节
- 光线均匀，阴影柔和
- 纯色或渐变背景，突出主体
</rendering>
</requirements>

<output_format>
全身姿势参考图，专业摄影品质，适合作为AI服装试穿的姿势模板。
</output_format>`;

    // 负面提示词 - 避免常见问题
    const negativePrompt = `半身像, 裁剪, 缺失肢体, 多余肢体, 畸形手指, 扭曲身体, 
模糊, 低质量, 过度曝光, 曝光不足, 杂乱背景, 复杂图案背景,
夸张表情, 闭眼, 张嘴, 侧面剪影, 背影, 坐姿（除非明确要求）,
低分辨率, 油画风格, 卡通风格, 动漫风格`;

    // 返回符合 ImageGenerationParams 接口的参数
    return {
        modelImage: '',  // 文生图不需要模特图
        outfitImage: '', // 文生图不需要服装图
        prompt: prompt,
        negativePrompt: negativePrompt,
        style: style,
        width: 1104,
        height: 1472,  // 3:4 比例，适合全身姿势
        count: 1
    };
}

/**
 * 验证姿势描述
 */
function validateDescription(description: string): { valid: boolean; error?: string } {
    if (!description || description.trim().length === 0) {
        return { valid: false, error: '姿势描述不能为空' };
    }

    if (description.length > 800) {
        return { valid: false, error: '姿势描述不能超过800个字符' };
    }

    // 检查是否包含不当内容（基础检查）
    const inappropriateWords = ['nude', 'naked', 'explicit', 'porn', 'sex', '裸体', '裸露'];
    const lowerDesc = description.toLowerCase();
    for (const word of inappropriateWords) {
        if (lowerDesc.includes(word)) {
            return { valid: false, error: '描述包含不当内容，请修改后重试' };
        }
    }

    return { valid: true };
}

export async function POST(request: NextRequest) {
    try {
        // 验证用户身份
        const auth = await authenticateRequest(request);
        if (!auth.success) {
            return NextResponse.json(
                { status: 'error', message: auth.error },
                { status: auth.status || 401 }
            );
        }

        // 解析请求体
        const body = await request.json();
        const { description, style = '写实' } = body;

        // 验证描述
        const validation = validateDescription(description);
        if (!validation.valid) {
            return NextResponse.json(
                { status: 'error', message: validation.error },
                { status: 400 }
            );
        }

        const startTime = Date.now();

        // 构建生成参数
        const params = buildPoseGenerationParams(description, style);

        // 使用统一的 Provider 层生成图像
        // 具体使用哪个Provider由配置决定（通义千问、Gemini等）
        const provider = getImageGenerationProvider();
        const result = await provider.generate(params);

        if (result.status === 'error') {
            return NextResponse.json(
                { 
                    status: 'error', 
                    message: result.error || '姿势生成失败',
                    provider: result.provider,
                    model: result.model
                },
                { status: 500 }
            );
        }

        const latencyMs = Date.now() - startTime;

        return NextResponse.json({
            status: 'success',
            url: result.url,
            description: description,
            style: style,
            latencyMs,
            provider: result.provider,
            model: result.model
        });

    } catch (error: any) {
        console.error('[PoseGenerate] API 错误:', error);

        // 处理特定的错误
        if (error.message?.includes('没有可用的图像生成 Provider')) {
            return NextResponse.json(
                { status: 'error', message: '服务器未配置 AI 图像生成服务' },
                { status: 500 }
            );
        }

        if (error.message?.includes('InvalidApiKey')) {
            return NextResponse.json(
                { status: 'error', message: 'API Key 无效，请检查配置' },
                { status: 401 }
            );
        }

        if (error.message?.includes('QuotaExceeded')) {
            return NextResponse.json(
                { status: 'error', message: 'API 配额已用完，请稍后重试' },
                { status: 429 }
            );
        }

        if (error.message?.includes('ContentPolicyViolation')) {
            return NextResponse.json(
                { status: 'error', message: '生成内容违反安全策略，请修改描述后重试' },
                { status: 400 }
            );
        }

        return NextResponse.json(
            { status: 'error', message: '姿势生成失败：' + (error.message || '未知错误') },
            { status: 500 }
        );
    }
}

/**
 * 获取姿势生成 API 状态
 */
export async function GET() {
    try {
        const provider = getImageGenerationProvider();
        const health = await provider.healthCheck();
        const info = provider.getInfo();

        return NextResponse.json({
            status: health.healthy ? 'ok' : 'error',
            message: health.message,
            provider: info.name,
            model: info.models[0],
            features: ['text-to-image', 'pose-generation'],
            capabilities: info.capabilities
        });
    } catch (error: any) {
        return NextResponse.json({
            status: 'error',
            message: '服务不可用：' + error.message,
            features: ['text-to-image', 'pose-generation'],
            config: {
                apiKeyConfigured: false
            }
        }, { status: 503 });
    }
}

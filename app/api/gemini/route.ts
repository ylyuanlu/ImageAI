import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { generateImage, checkImageGenerationHealth } from '@/lib/image-generation';

/**
 * 图像生成 API 路由
 * 使用统一的图像生成抽象层，支持多提供商切换
 */
export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const {
      modelImage,
      outfitImage,
      pose = '正面站姿',
      style = '写真',
      lighting = '自然光',
      background = '纯色',
      colorTone = '冷暖平衡'
    } = data;

    // 验证必要参数
    if (!modelImage || !outfitImage) {
      return NextResponse.json(
        { status: 'error', message: '缺少必要参数：模特参考图和服装参考图不能为空' },
        { status: 400 }
      );
    }

    // 调用图像生成服务
    const result = await generateImage({
      modelImage,
      outfitImage,
      pose,
      style,
      lighting,
      background,
      colorTone
    });

    if (result.status === 'error') {
      return NextResponse.json(
        { 
          status: 'error', 
          message: result.error,
          latencyMs: result.latencyMs
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      status: 'success',
      url: result.url,
      latencyMs: result.latencyMs,
      model: result.model || '通义千问'
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
 * 健康检查端点
 * 返回图像生成服务的配置状态
 */
export async function GET() {
  const health = await checkImageGenerationHealth();
  
  return NextResponse.json({
    status: health.healthy ? 'ok' : 'error',
    message: health.message,
    provider: '通义千问',
    healthy: health.healthy
  });
}

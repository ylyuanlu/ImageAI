/**
 * 图像生成服务统一导出
 * 提供简洁的API接口，屏蔽底层实现细节
 */

// 类型定义 - 使用 export type 以支持 isolatedModules
export type {
    ImageGenerationParams,
    ImageGenerationResult,
    ProviderConfig,
    ProviderCapabilities,
    ProviderInfo,
    ImageGenerationProvider,
    ImageGenerationConfig
} from './types';

// 重新导出枚举（枚举是值，不是类型，所以不需要 type）
export { ProviderType } from './types';

// Provider 实现
export { TongyiProvider } from './providers/tongyi-provider';

// 工厂和工具函数
export {
    ProviderFactory,
    initializeFromEnv,
    getImageGenerationProvider,
    getProvider
} from './factory';

/**
 * 生成图像的便捷函数
 * 使用默认 Provider 生成图像
 */
import type { ImageGenerationParams, ImageGenerationResult } from './types';
import { getImageGenerationProvider } from './factory';

export async function generateImage(params: ImageGenerationParams): Promise<ImageGenerationResult> {
    const provider = getImageGenerationProvider();
    return provider.generate(params);
}

/**
 * 检查服务健康状态
 */
export async function checkImageGenerationHealth(): Promise<{ healthy: boolean; message: string }> {
    try {
        const provider = getImageGenerationProvider();
        return await provider.healthCheck();
    } catch (error: any) {
        return {
            healthy: false,
            message: `服务检查失败: ${error.message}`
        };
    }
}

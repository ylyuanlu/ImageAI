/**
 * 图像生成 Provider 工厂
 * 用于创建和管理不同的 Provider 实例
 */

import {
    ImageGenerationProvider,
    ProviderType,
    ImageGenerationConfig,
    ProviderConfig
} from './types';

import { TongyiProvider } from './providers/tongyi-provider';

/**
 * Provider 工厂类
 */
export class ProviderFactory {
    private static instances: Map<ProviderType, ImageGenerationProvider> = new Map();
    private static config: ImageGenerationConfig = {
        defaultProvider: ProviderType.TONGYI,
        providers: {},
        fallbackProviders: [ProviderType.TONGYI]
    };

    /**
     * 初始化配置
     */
    static initialize(config: ImageGenerationConfig): void {
        this.config = config;
        
        // 预创建所有配置的 Provider
        Object.entries(config.providers).forEach(([type, providerConfig]) => {
            const providerType = type as ProviderType;
            const provider = this.createProvider(providerType, providerConfig);
            if (provider) {
                this.instances.set(providerType, provider);
            }
        });
    }

    /**
     * 获取 Provider 实例
     */
    static getProvider(type?: ProviderType): ImageGenerationProvider | null {
        const providerType = type || this.config.defaultProvider;
        
        // 如果已存在实例，直接返回
        if (this.instances.has(providerType)) {
            return this.instances.get(providerType)!;
        }

        // 否则创建新实例
        const config = this.config.providers[providerType];
        if (!config) {
            console.error(`Provider ${providerType} 未配置`);
            return null;
        }

        const provider = this.createProvider(providerType, config);
        if (provider) {
            this.instances.set(providerType, provider);
        }
        
        return provider;
    }

    /**
     * 获取默认 Provider
     */
    static getDefaultProvider(): ImageGenerationProvider | null {
        return this.getProvider(this.config.defaultProvider);
    }

    /**
     * 获取可用的 Provider 列表（按优先级排序）
     */
    static getAvailableProviders(): ImageGenerationProvider[] {
        const providers: ImageGenerationProvider[] = [];
        
        // 首先尝试默认 Provider
        const defaultProvider = this.getDefaultProvider();
        if (defaultProvider && defaultProvider.validateConfig()) {
            providers.push(defaultProvider);
        }

        // 然后尝试降级列表
        for (const type of this.config.fallbackProviders) {
            if (type === this.config.defaultProvider) continue;
            
            const provider = this.getProvider(type);
            if (provider && provider.validateConfig()) {
                providers.push(provider);
            }
        }

        return providers;
    }

    /**
     * 创建 Provider 实例
     */
    private static createProvider(
        type: ProviderType,
        config: ProviderConfig
    ): ImageGenerationProvider | null {
        switch (type) {
            case ProviderType.TONGYI:
                return new TongyiProvider(config as any);
            
            // 未来可以添加其他 Provider
            // case ProviderType.GEMINI:
            //     return new GeminiProvider(config as any);
            // case ProviderType.OPENAI:
            //     return new OpenAIProvider(config as any);
            
            default:
                console.error(`未知的 Provider 类型: ${type}`);
                return null;
        }
    }

    /**
     * 检查 Provider 是否可用
     */
    static isProviderAvailable(type: ProviderType): boolean {
        const provider = this.getProvider(type);
        return provider ? provider.validateConfig() : false;
    }

    /**
     * 获取所有已配置的 Provider 类型
     */
    static getConfiguredTypes(): ProviderType[] {
        return Object.keys(this.config.providers) as ProviderType[];
    }

    /**
     * 重置所有实例（用于重新配置）
     */
    static reset(): void {
        this.instances.clear();
        this.config = {
            defaultProvider: ProviderType.TONGYI,
            providers: {},
            fallbackProviders: [ProviderType.TONGYI]
        };
    }
}

/**
 * 从环境变量初始化配置
 */
export function initializeFromEnv(): void {
    const config: ImageGenerationConfig = {
        defaultProvider: ProviderType.TONGYI,
        providers: {},
        fallbackProviders: [ProviderType.TONGYI]
    };

    // 通义千问配置
    if (process.env.TONGYI_API_KEY) {
        config.providers[ProviderType.TONGYI] = {
            apiKey: process.env.TONGYI_API_KEY,
            timeout: parseInt(process.env.TONGYI_TIMEOUT || '180000'),
            maxRetries: parseInt(process.env.TONGYI_MAX_RETRIES || '2'),
            model: process.env.TONGYI_MODEL
        };
    }

    // Gemini 配置（预留）
    if (process.env.GEMINI_API_KEY) {
        config.providers[ProviderType.GEMINI] = {
            apiKey: process.env.GEMINI_API_KEY,
            timeout: parseInt(process.env.GEMINI_TIMEOUT || '60000'),
            maxRetries: parseInt(process.env.GEMINI_MAX_RETRIES || '3')
        };
        config.fallbackProviders.push(ProviderType.GEMINI);
    }

    // OpenAI 配置（预留）
    if (process.env.OPENAI_API_KEY) {
        config.providers[ProviderType.OPENAI] = {
            apiKey: process.env.OPENAI_API_KEY,
            timeout: parseInt(process.env.OPENAI_TIMEOUT || '60000'),
            maxRetries: parseInt(process.env.OPENAI_MAX_RETRIES || '3')
        };
        config.fallbackProviders.push(ProviderType.OPENAI);
    }

    ProviderFactory.initialize(config);
}

/**
 * 获取默认 Provider 的便捷方法
 */
export function getImageGenerationProvider(): ImageGenerationProvider {
    const provider = ProviderFactory.getDefaultProvider();
    if (!provider) {
        throw new Error('没有可用的图像生成 Provider，请检查配置');
    }
    return provider;
}

/**
 * 获取指定 Provider 的便捷方法
 */
export function getProvider(type: ProviderType): ImageGenerationProvider {
    const provider = ProviderFactory.getProvider(type);
    if (!provider) {
        throw new Error(`Provider ${type} 未配置或不可用`);
    }
    return provider;
}

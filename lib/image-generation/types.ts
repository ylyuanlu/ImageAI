/**
 * 图像生成服务类型定义
 * 定义统一的接口和数据结构，用于屏蔽不同AI提供商的实现差异
 */

/**
 * 服装类型
 */
export type OutfitType = 'top' | 'bottom' | 'outerwear' | 'fullbody' | 'accessory';

/**
 * 服装类型标签映射
 */
export const OutfitTypeLabels: Record<OutfitType, string> = {
    top: '上装',
    bottom: '下装',
    outerwear: '外套',
    fullbody: '连体装',
    accessory: '配饰'
};

/**
 * 带类型的服装图片
 */
export interface OutfitImageWithType {
    image: string;           // 图片数据 (base64 或 URL)
    type: OutfitType;        // 服装类型
}

/**
 * 穿搭单品项
 * 用于组合穿搭中的单个服装项
 */
export interface OutfitItem {
    type: OutfitType;        // 服装类型（上装/下装/外套等）
    name: string;            // 单品名称（如"白色基础T恤"）
    image: string;           // 单品图片（base64或URL）
}

/**
 * 穿搭方案信息
 * 用于传递穿搭的完整描述信息到生成流程
 * 支持单件穿搭和组合穿搭
 */
export interface OutfitSchemeInfo {
    id: string;              // 穿搭ID
    name: string;            // 穿搭名称（如"清爽白T配牛仔"）
    category: string;        // 分类（夏季/冬季/上装/下装等）
    style: string;           // 风格（休闲/优雅等）
    tags: string[];          // 标签（清爽、日常等）
    description?: string;    // 详细描述（可选）
    type?: 'single' | 'combo';  // 穿搭类型：单件或组合
    items?: OutfitItem[];    // 组合穿搭的单品列表（可选，用于未来扩展）
}

/**
 * 图像生成参数
 */
export interface ImageGenerationParams {
    // 必需参数
    modelImage: string;      // 模特参考图 (base64 或 URL)
    outfitImage: string;     // 服装参考图 (base64 或 URL)
    outfitImages?: string[]; // 多张服装参考图 (base64 或 URL，最多3张)
    outfitImagesWithType?: OutfitImageWithType[]; // 带类型的服装图片（推荐）
    
    // 可选参数
    prompt?: string;         // 自定义提示词
    pose?: string;           // 姿势
    style?: string;          // 风格
    lighting?: string;       // 灯光
    background?: string;     // 背景
    colorTone?: string;      // 色调
    
    // 高级参数
    negativePrompt?: string; // 反向提示词
    seed?: number;           // 随机种子
    width?: number;          // 输出宽度
    height?: number;         // 输出高度
    count?: number;          // 生成图片数量 (1-6，默认1)
    
    // 穿搭方案信息
    outfitSchemeInfo?: OutfitSchemeInfo; // 穿搭方案详细信息
    
    // 图片来源类型
    outfitSource?: 'library' | 'custom'; // 'library' = 系统穿搭库（模特图），'custom' = 用户上传（服装图）
}

/**
 * 图像生成结果
 */
export interface ImageGenerationResult {
    status: 'success' | 'error';
    url?: string;            // 生成的图片 URL
    urls?: string[];         // 生成的多张图片 URL
    error?: string;          // 错误信息
    errorCode?: string;      // 错误代码
    latencyMs: number;       // 耗时（毫秒）
    provider: string;        // 提供商名称
    model: string;           // 使用的模型
}

/**
 * Provider 配置
 */
export interface ProviderConfig {
    apiKey: string;
    baseUrl?: string;
    timeout?: number;
    maxRetries?: number;
    [key: string]: any;      // 其他提供商特定配置
}

/**
 * Provider 能力
 */
export interface ProviderCapabilities {
    supportsMultipleImages: boolean;    // 是否支持多图输入
    supportsImageEditing: boolean;      // 是否支持图像编辑
    supportsTextToImage: boolean;       // 是否支持文生图
    supportsImageToImage: boolean;      // 是否支持图生图
    maxInputImages: number;             // 最大输入图片数
    maxOutputImages: number;            // 最大输出图片数
    supportedFormats: string[];         // 支持的图片格式
    maxImageSize: number;               // 最大图片尺寸（字节）
}

/**
 * Provider 信息
 */
export interface ProviderInfo {
    name: string;                       // 提供商名称
    displayName: string;                // 显示名称
    description: string;                // 描述
    capabilities: ProviderCapabilities; // 能力
    models: string[];                   // 支持的模型列表
}

/**
 * 图像生成 Provider 接口
 * 所有具体的AI提供商都需要实现这个接口
 */
export interface ImageGenerationProvider {
    /**
     * Provider 名称
     */
    readonly name: string;
    
    /**
     * 获取 Provider 信息
     */
    getInfo(): ProviderInfo;
    
    /**
     * 检查配置是否有效
     */
    validateConfig(): boolean;
    
    /**
     * 生成图像
     */
    generate(params: ImageGenerationParams): Promise<ImageGenerationResult>;
    
    /**
     * 检查服务健康状态
     */
    healthCheck(): Promise<{ healthy: boolean; message: string }>;
}

/**
 * 提供商类型枚举
 */
export enum ProviderType {
    TONGYI = 'tongyi',           // 阿里云通义千问
    GEMINI = 'gemini',           // Google Gemini
    OPENAI = 'openai',           // OpenAI
    STABILITY = 'stability',     // Stability AI
    CUSTOM = 'custom',           // 自定义
}

/**
 * 全局配置
 */
export interface ImageGenerationConfig {
    defaultProvider: ProviderType;
    providers: {
        [key in ProviderType]?: ProviderConfig;
    };
    fallbackProviders: ProviderType[];  // 降级提供商列表
}

/**
 * 文件存储服务
 * 支持 AWS S3 和阿里云 OSS
 */

// 存储服务类型
export type StorageProvider = 's3' | 'oss' | 'local';

// 上传配置
export interface UploadConfig {
    maxSize?: number; // 最大文件大小（字节）
    allowedTypes?: string[]; // 允许的文件类型
    expiresIn?: number; // 预签名URL过期时间（秒）
}

// 上传结果
export interface UploadResult {
    url: string; // 文件访问URL
    key: string; // 存储键值
    size: number; // 文件大小
    mimeType: string; // 文件类型
}

// 默认配置
const DEFAULT_CONFIG: UploadConfig = {
    maxSize: 10 * 1024 * 1024, // 10MB
    allowedTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
    expiresIn: 3600 // 1小时
};

/**
 * 验证文件
 */
export function validateFile(
    file: File | Buffer,
    mimeType: string,
    config: UploadConfig = {}
): { valid: boolean; error?: string } {
    const finalConfig = { ...DEFAULT_CONFIG, ...config };

    // 检查文件大小
    const fileSize = file instanceof File ? file.size : file.length;
    if (fileSize > (finalConfig.maxSize || 10 * 1024 * 1024)) {
        return {
            valid: false,
            error: `文件大小超过限制，最大允许 ${(finalConfig.maxSize! / 1024 / 1024).toFixed(1)}MB`
        };
    }

    // 检查文件类型
    if (finalConfig.allowedTypes && !finalConfig.allowedTypes.includes(mimeType)) {
        return {
            valid: false,
            error: `不支持的文件类型，允许的类型: ${finalConfig.allowedTypes.join(', ')}`
        };
    }

    return { valid: true };
}

/**
 * 生成唯一的文件键值
 */
export function generateFileKey(
    originalName: string,
    folder: string = 'uploads'
): string {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 10);
    const extension = originalName.split('.').pop() || 'jpg';
    return `${folder}/${timestamp}-${random}.${extension}`;
}

/**
 * 将 File 对象转换为 Buffer
 */
export async function fileToBuffer(file: File): Promise<Buffer> {
    const arrayBuffer = await file.arrayBuffer();
    return Buffer.from(arrayBuffer);
}

/**
 * 将 base64 数据转换为 Buffer
 */
export function base64ToBuffer(base64Data: string): Buffer {
    // 移除 base64 前缀（如 data:image/jpeg;base64,）
    const base64 = base64Data.replace(/^data:[^;]+;base64,/, '');
    return Buffer.from(base64, 'base64');
}

/**
 * 获取文件 MIME 类型
 */
export function getMimeType(filename: string): string {
    const ext = filename.split('.').pop()?.toLowerCase();
    const mimeTypes: Record<string, string> = {
        'jpg': 'image/jpeg',
        'jpeg': 'image/jpeg',
        'png': 'image/png',
        'gif': 'image/gif',
        'webp': 'image/webp',
        'svg': 'image/svg+xml'
    };
    return mimeTypes[ext || ''] || 'application/octet-stream';
}

/**
 * 压缩图片（使用 Canvas API）
 * 注意：这是一个客户端函数，仅在浏览器环境使用
 */
export async function compressImage(
    file: File,
    maxWidth: number = 1920,
    maxHeight: number = 1920,
    quality: number = 0.85
): Promise<Blob> {
    return new Promise((resolve, reject) => {
        const img = new Image();
        const url = URL.createObjectURL(file);

        img.onload = () => {
            URL.revokeObjectURL(url);

            // 计算缩放后的尺寸
            let { width, height } = img;
            if (width > maxWidth || height > maxHeight) {
                const ratio = Math.min(maxWidth / width, maxHeight / height);
                width *= ratio;
                height *= ratio;
            }

            // 创建 Canvas
            const canvas = document.createElement('canvas');
            canvas.width = width;
            canvas.height = height;
            const ctx = canvas.getContext('2d');

            if (!ctx) {
                reject(new Error('无法创建 canvas 上下文'));
                return;
            }

            // 绘制图片
            ctx.drawImage(img, 0, 0, width, height);

            // 转换为 Blob
            canvas.toBlob(
                (blob) => {
                    if (blob) {
                        resolve(blob);
                    } else {
                        reject(new Error('图片压缩失败'));
                    }
                },
                file.type,
                quality
            );
        };

        img.onerror = () => {
            URL.revokeObjectURL(url);
            reject(new Error('图片加载失败'));
        };

        img.src = url;
    });
}

/**
 * 服务端存储接口
 * 具体的 S3/OSS 实现将在各自的 provider 文件中
 */
export interface StorageService {
    upload(file: Buffer, key: string, mimeType: string): Promise<UploadResult>;
    getSignedUrl(key: string, expiresIn?: number): Promise<string>;
    delete(key: string): Promise<void>;
    exists(key: string): Promise<boolean>;
}

/**
 * 获取存储服务实例
 * 根据环境变量自动选择存储提供商
 */
export function getStorageService(): StorageService | null {
    // 检查是否有 AWS S3 配置
    if (process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_ACCESS_KEY) {
        // 动态导入 S3 服务
        const { S3StorageService } = require('./storage/s3');
        return new S3StorageService();
    }

    // 检查是否有阿里云 OSS 配置
    if (process.env.ALIYUN_ACCESS_KEY_ID && process.env.ALIYUN_ACCESS_KEY_SECRET) {
        // 动态导入 OSS 服务
        const { OSSStorageService } = require('./storage/oss');
        return new OSSStorageService();
    }

    // 没有配置存储服务，返回 null
    console.warn('未配置任何存储服务（AWS S3 或阿里云 OSS）');
    return null;
}

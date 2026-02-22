/**
 * 阿里云 OSS 存储服务实现
 */
import OSS from 'ali-oss';
import type { StorageService, UploadResult } from '../storage';

export class OSSStorageService implements StorageService {
    private client: OSS;
    private bucket: string;
    private region: string;

    constructor() {
        this.bucket = process.env.ALIYUN_OSS_BUCKET_NAME || '';
        this.region = process.env.ALIYUN_OSS_REGION || 'oss-cn-hangzhou';

        if (!this.bucket) {
            throw new Error('缺少 ALIYUN_OSS_BUCKET_NAME 环境变量');
        }

        this.client = new OSS({
            region: this.region,
            accessKeyId: process.env.ALIYUN_ACCESS_KEY_ID || '',
            accessKeySecret: process.env.ALIYUN_ACCESS_KEY_SECRET || '',
            bucket: this.bucket,
            // 开启 HTTPS
            secure: true,
            // 设置超时时间
            timeout: 60000 // 60秒
        });
    }

    /**
     * 上传文件到 OSS
     */
    async upload(file: Buffer, key: string, mimeType: string): Promise<UploadResult> {
        const result = await this.client.put(key, file, {
            headers: {
                'Content-Type': mimeType,
                'Cache-Control': 'public, max-age=31536000' // 1年缓存
            }
        });

        return {
            url: result.url,
            key,
            size: file.length,
            mimeType
        };
    }

    /**
     * 获取预签名 URL（用于临时访问私有文件）
     */
    async getSignedUrl(key: string, expiresIn: number = 3600): Promise<string> {
        // 阿里云 OSS 签名 URL 过期时间单位是秒
        const url = this.client.signatureUrl(key, {
            expires: expiresIn
        });
        return url;
    }

    /**
     * 删除文件
     */
    async delete(key: string): Promise<void> {
        await this.client.delete(key);
    }

    /**
     * 检查文件是否存在
     */
    async exists(key: string): Promise<boolean> {
        try {
            await this.client.head(key);
            return true;
        } catch (error: any) {
            if (error.code === 'NoSuchKey') {
                return false;
            }
            throw error;
        }
    }

    /**
     * 批量删除文件
     */
    async deleteMulti(keys: string[]): Promise<void> {
        await this.client.deleteMulti(keys);
    }

    /**
     * 获取文件列表
     */
    async list(prefix?: string, maxKeys: number = 100): Promise<string[]> {
        const result = await this.client.list({
            prefix,
            'max-keys': maxKeys
        }, {});
        return result.objects?.map(obj => obj.name) || [];
    }
}

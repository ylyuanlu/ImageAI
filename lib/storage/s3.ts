/**
 * AWS S3 存储服务实现
 */
import { S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand, HeadObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import type { StorageService, UploadResult } from '../storage';

export class S3StorageService implements StorageService {
    private client: S3Client;
    private bucket: string;

    constructor() {
        const region = process.env.AWS_REGION || 'ap-northeast-1';
        this.bucket = process.env.AWS_S3_BUCKET_NAME || '';

        if (!this.bucket) {
            throw new Error('缺少 AWS_S3_BUCKET_NAME 环境变量');
        }

        this.client = new S3Client({
            region,
            credentials: {
                accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
                secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || ''
            }
        });
    }

    /**
     * 上传文件到 S3
     */
    async upload(file: Buffer, key: string, mimeType: string): Promise<UploadResult> {
        const command = new PutObjectCommand({
            Bucket: this.bucket,
            Key: key,
            Body: file,
            ContentType: mimeType,
            // 设置缓存控制头
            CacheControl: 'public, max-age=31536000' // 1年缓存
        });

        await this.client.send(command);

        // 构建文件 URL
        const region = process.env.AWS_REGION || 'ap-northeast-1';
        const url = `https://${this.bucket}.s3.${region}.amazonaws.com/${key}`;

        return {
            url,
            key,
            size: file.length,
            mimeType
        };
    }

    /**
     * 获取预签名 URL（用于临时访问私有文件）
     */
    async getSignedUrl(key: string, expiresIn: number = 3600): Promise<string> {
        const command = new GetObjectCommand({
            Bucket: this.bucket,
            Key: key
        });

        return await getSignedUrl(this.client, command, { expiresIn });
    }

    /**
     * 删除文件
     */
    async delete(key: string): Promise<void> {
        const command = new DeleteObjectCommand({
            Bucket: this.bucket,
            Key: key
        });

        await this.client.send(command);
    }

    /**
     * 检查文件是否存在
     */
    async exists(key: string): Promise<boolean> {
        try {
            const command = new HeadObjectCommand({
                Bucket: this.bucket,
                Key: key
            });

            await this.client.send(command);
            return true;
        } catch (error: any) {
            if (error.name === 'NotFound') {
                return false;
            }
            throw error;
        }
    }
}

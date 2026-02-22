/**
 * 文件上传 API
 * 支持上传图片到配置的存储服务（S3/OSS）
 */
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { authenticateRequest } from '@/lib/auth';
import {
    getStorageService,
    generateFileKey,
    validateFile,
    base64ToBuffer,
    getMimeType
} from '@/lib/storage';

// 上传配置
const UPLOAD_CONFIG = {
    maxSize: 10 * 1024 * 1024, // 10MB
    allowedTypes: ['image/jpeg', 'image/png', 'image/webp'],
    expiresIn: 3600
};

export async function POST(req: NextRequest) {
    try {
        // 验证用户身份
        const authResult = await authenticateRequest(req);
        if (!authResult.success) {
            return NextResponse.json(
                { status: 'error', message: authResult.error },
                { status: authResult.status || 401 }
            );
        }

        // 获取存储服务
        const storage = getStorageService();
        if (!storage) {
            return NextResponse.json(
                { status: 'error', message: '存储服务未配置' },
                { status: 503 }
            );
        }

        // 解析请求数据
        const data = await req.json();
        const { file, filename, folder = 'uploads' } = data;

        if (!file) {
            return NextResponse.json(
                { status: 'error', message: '缺少文件数据' },
                { status: 400 }
            );
        }

        // 处理文件数据（支持 base64 或 data URL）
        let fileBuffer: Buffer;
        let mimeType: string;

        if (file.startsWith('data:')) {
            // Data URL 格式
            fileBuffer = base64ToBuffer(file);
            mimeType = file.match(/data:([^;]+)/)?.[1] || 'image/jpeg';
        } else {
            // 纯 base64
            fileBuffer = Buffer.from(file, 'base64');
            mimeType = getMimeType(filename || 'image.jpg');
        }

        // 验证文件
        const validation = validateFile(fileBuffer, mimeType, UPLOAD_CONFIG);
        if (!validation.valid) {
            return NextResponse.json(
                { status: 'error', message: validation.error },
                { status: 400 }
            );
        }

        // 生成文件键值
        const key = generateFileKey(filename || 'upload.jpg', folder);

        // 上传文件
        const result = await storage.upload(fileBuffer, key, mimeType);

        return NextResponse.json({
            status: 'success',
            url: result.url,
            key: result.key,
            size: result.size,
            mimeType: result.mimeType
        });

    } catch (error: any) {
        console.error('上传失败:', error);
        return NextResponse.json(
            { status: 'error', message: '上传失败: ' + (error.message || '未知错误') },
            { status: 500 }
        );
    }
}

/**
 * 获取预签名上传 URL（用于前端直传）
 */
export async function GET(req: NextRequest) {
    try {
        // 验证用户身份
        const authResult = await authenticateRequest(req);
        if (!authResult.success) {
            return NextResponse.json(
                { status: 'error', message: authResult.error },
                { status: authResult.status || 401 }
            );
        }

        // 获取存储服务
        const storage = getStorageService();
        if (!storage) {
            return NextResponse.json(
                { status: 'error', message: '存储服务未配置' },
                { status: 503 }
            );
        }

        // 从查询参数获取文件名
        const { searchParams } = new URL(req.url);
        const filename = searchParams.get('filename') || 'upload.jpg';
        const folder = searchParams.get('folder') || 'uploads';

        // 生成文件键值
        const key = generateFileKey(filename, folder);

        // 获取预签名 URL
        const signedUrl = await storage.getSignedUrl(key, UPLOAD_CONFIG.expiresIn);

        return NextResponse.json({
            status: 'success',
            uploadUrl: signedUrl,
            key,
            expiresIn: UPLOAD_CONFIG.expiresIn
        });

    } catch (error: any) {
        console.error('获取预签名 URL 失败:', error);
        return NextResponse.json(
            { status: 'error', message: '获取预签名 URL 失败: ' + (error.message || '未知错误') },
            { status: 500 }
        );
    }
}

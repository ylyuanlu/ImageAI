/**
 * 图片上传 Hook
 * 提供压缩、分片上传、进度跟踪等功能
 */

import { useState, useCallback } from 'react';
import { compressImage, uploadInChunks, fetchWithRetry } from '@/lib/utils/network';

interface UploadOptions {
  maxSizeMB?: number;
  compress?: boolean;
  useChunkUpload?: boolean;
  chunkSize?: number;
}

interface UploadState {
  isUploading: boolean;
  progress: number;
  error: string | null;
}

interface UploadResult {
  url: string;
  key?: string;
}

export function useImageUpload(options: UploadOptions = {}) {
  const {
    maxSizeMB = 5,
    compress = true,
    useChunkUpload = false,
    chunkSize = 1024 * 1024
  } = options;

  const [state, setState] = useState<UploadState>({
    isUploading: false,
    progress: 0,
    error: null
  });

  const upload = useCallback(async (
    file: File,
    endpoint: string = '/api/upload'
  ): Promise<UploadResult> => {
    setState({ isUploading: true, progress: 0, error: null });

    try {
      let fileToUpload: File | Blob = file;

      // 1. 压缩图片（如果需要）
      if (compress && file.size > maxSizeMB * 1024 * 1024) {
        console.log(`压缩图片: ${(file.size / 1024 / 1024).toFixed(2)}MB -> 目标 <${maxSizeMB}MB`);
        fileToUpload = await compressImage(file, {
          maxWidth: 1920,
          maxHeight: 1920,
          quality: 0.8,
          maxSizeMB
        });
        console.log(`压缩后大小: ${(fileToUpload.size / 1024 / 1024).toFixed(2)}MB`);
      }

      // 2. 分片上传或普通上传
      if (useChunkUpload && fileToUpload.size > chunkSize) {
        // 分片上传
        const result = await uploadInChunks(
          fileToUpload instanceof File ? fileToUpload : new File([fileToUpload], file.name),
          endpoint,
          {
            chunkSize,
            onProgress: (progress) => {
              setState(prev => ({ ...prev, progress }));
            }
          }
        );
        
        setState({ isUploading: false, progress: 100, error: null });
        return result;
      } else {
        // 普通上传（带重试）
        const formData = new FormData();
        formData.append('file', fileToUpload);

        const response = await fetchWithRetry(endpoint, {
          method: 'POST',
          body: formData,
          timeout: 120000, // 2分钟超时
          retry: {
            maxRetries: 3,
            retryDelay: 1000,
            onRetry: (attempt, error) => {
              console.warn(`上传失败，第 ${attempt} 次重试`, error);
            }
          }
        });

        if (!response.ok) {
          throw new Error(`上传失败: ${response.statusText}`);
        }

        const data = await response.json();
        setState({ isUploading: false, progress: 100, error: null });
        
        return {
          url: data.url,
          key: data.key
        };
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '上传失败';
      setState({ isUploading: false, progress: 0, error: errorMessage });
      throw error;
    }
  }, [compress, maxSizeMB, useChunkUpload, chunkSize]);

  const reset = useCallback(() => {
    setState({ isUploading: false, progress: 0, error: null });
  }, []);

  return {
    ...state,
    upload,
    reset
  };
}

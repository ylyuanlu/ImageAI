/**
 * 网络请求工具库
 * 提供重试机制、超时控制、分片上传等功能
 */

interface RetryOptions {
  maxRetries?: number;
  retryDelay?: number;
  backoffMultiplier?: number;
  onRetry?: (attempt: number, error: Error) => void;
}

interface RequestOptions extends RequestInit {
  timeout?: number;
  retry?: RetryOptions;
}

/**
 * 带重试机制的 fetch
 */
export async function fetchWithRetry(
  url: string,
  options: RequestOptions = {}
): Promise<Response> {
  const {
    timeout = 60000,
    retry = {},
    ...fetchOptions
  } = options;

  const {
    maxRetries = 3,
    retryDelay = 1000,
    backoffMultiplier = 2,
    onRetry
  } = retry;

  let lastError: Error;
  
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      // 创建 AbortController 用于超时控制
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), timeout);

      const response = await fetch(url, {
        ...fetchOptions,
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      // 如果是服务器错误 (5xx) 或网络错误，触发重试
      if (response.status >= 500 && attempt < maxRetries) {
        const error = new Error(`Server error: ${response.status}`);
        throw error;
      }

      return response;
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));

      // 如果是最后一次尝试，抛出错误
      if (attempt >= maxRetries) {
        throw lastError;
      }

      // 计算延迟时间（指数退避）
      const delay = retryDelay * Math.pow(backoffMultiplier, attempt);
      
      // 调用重试回调
      if (onRetry) {
        onRetry(attempt + 1, lastError);
      }

      // 等待后重试
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }

  throw lastError!;
}

/**
 * 图片压缩工具
 * 用于在上传前压缩大图片
 */
export async function compressImage(
  file: File,
  options: {
    maxWidth?: number;
    maxHeight?: number;
    quality?: number;
    maxSizeMB?: number;
  } = {}
): Promise<Blob> {
  const {
    maxWidth = 1920,
    maxHeight = 1920,
    quality = 0.8,
    maxSizeMB = 5
  } = options;

  // 如果文件已经小于限制，直接返回
  if (file.size <= maxSizeMB * 1024 * 1024) {
    return file;
  }

  return new Promise((resolve, reject) => {
    const img = new Image();
    img.src = URL.createObjectURL(file);
    
    img.onload = () => {
      URL.revokeObjectURL(img.src);
      
      // 计算新的尺寸
      let { width, height } = img;
      
      if (width > maxWidth || height > maxHeight) {
        const ratio = Math.min(maxWidth / width, maxHeight / height);
        width *= ratio;
        height *= ratio;
      }

      // 创建 canvas
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

      // 转换为 blob
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
      URL.revokeObjectURL(img.src);
      reject(new Error('图片加载失败'));
    };
  });
}

/**
 * 分片上传
 * 用于上传大文件
 */
export interface ChunkUploadOptions {
  chunkSize?: number; // 每个分片大小（字节）
  onProgress?: (progress: number) => void;
  onChunkComplete?: (chunkIndex: number, totalChunks: number) => void;
}

export async function uploadInChunks(
  file: File,
  uploadUrl: string,
  options: ChunkUploadOptions = {}
): Promise<{ url: string; key: string }> {
  const {
    chunkSize = 1024 * 1024, // 默认 1MB
    onProgress,
    onChunkComplete
  } = options;

  const totalChunks = Math.ceil(file.size / chunkSize);
  const uploadId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  
  // 上传所有分片
  for (let i = 0; i < totalChunks; i++) {
    const start = i * chunkSize;
    const end = Math.min(start + chunkSize, file.size);
    const chunk = file.slice(start, end);

    const formData = new FormData();
    formData.append('chunk', chunk);
    formData.append('index', i.toString());
    formData.append('total', totalChunks.toString());
    formData.append('uploadId', uploadId);
    formData.append('filename', file.name);

    // 使用重试机制上传每个分片
    const response = await fetchWithRetry(uploadUrl, {
      method: 'POST',
      body: formData,
      retry: {
        maxRetries: 3,
        retryDelay: 1000,
        onRetry: (attempt, error) => {
          console.warn(`分片 ${i + 1}/${totalChunks} 上传失败，第 ${attempt} 次重试`, error);
        }
      }
    });

    if (!response.ok) {
      throw new Error(`分片 ${i + 1} 上传失败: ${response.statusText}`);
    }

    // 通知进度
    const progress = ((i + 1) / totalChunks) * 100;
    onProgress?.(progress);
    onChunkComplete?.(i, totalChunks);
  }

  // 通知服务器合并分片
  const mergeResponse = await fetchWithRetry(`${uploadUrl}/merge`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ uploadId, filename: file.name, totalChunks }),
    retry: {
      maxRetries: 3,
      retryDelay: 1000
    }
  });

  if (!mergeResponse.ok) {
    throw new Error('合并分片失败');
  }

  return await mergeResponse.json();
}

/**
 * 检测设备是否为移动端
 */
export function isMobileDevice(): boolean {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  );
}

/**
 * 防抖函数
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

/**
 * 节流函数
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;
  
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

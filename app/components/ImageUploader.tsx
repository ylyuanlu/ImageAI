"use client";

import React, { useState, useRef, useCallback } from 'react';
import { useTheme } from './ThemeProvider';

// 上传文件类型
export interface UploadFile {
  id: string;
  file: File;
  preview: string;
  status: 'pending' | 'uploading' | 'success' | 'error';
  progress: number;
  error?: string;
  url?: string;
}

// 组件属性
interface ImageUploaderProps {
  /** 最多允许上传的文件数量 */
  maxFiles?: number;
  /** 最大文件大小（MB） */
  maxSize?: number;
  /** 允许的文件类型 */
  accept?: string;
  /** 上传文件夹 */
  folder?: string;
  /** 是否支持多图上传 */
  multiple?: boolean;
  /** 文件选择回调 */
  onFilesSelected?: (files: UploadFile[]) => void;
  /** 文件上传成功回调 */
  onUploadSuccess?: (files: UploadFile[]) => void;
  /** 文件上传失败回调 */
  onUploadError?: (file: UploadFile, error: string) => void;
  /** 文件删除回调 */
  onFileRemove?: (file: UploadFile) => void;
  /** 自定义标题 */
  title?: string;
  /** 自定义描述 */
  description?: string;
  /** 自定义图标 */
  icon?: string;
}

/**
 * 生成唯一ID
 */
function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
}

/**
 * 验证文件
 */
function validateFile(
  file: File,
  maxSize: number,
  acceptTypes: string[]
): { valid: boolean; error?: string } {
  // 检查文件大小
  if (file.size > maxSize * 1024 * 1024) {
    return {
      valid: false,
      error: `文件大小超过 ${maxSize}MB 限制`
    };
  }

  // 检查文件类型
  if (acceptTypes.length > 0) {
    const isValidType = acceptTypes.some(type => {
      if (type.includes('/*')) {
        return file.type.startsWith(type.replace('/*', ''));
      }
      return file.type === type;
    });

    if (!isValidType) {
      return {
        valid: false,
        error: `不支持的文件格式，请上传 ${acceptTypes.map(t => t.replace('image/', '.')).join(' / ')} 格式`
      };
    }
  }

  return { valid: true };
}

/**
 * 读取文件为 Data URL
 */
function readFileAsDataURL(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export default function ImageUploader({
  maxFiles = 3,
  maxSize = 10,
  accept = "image/jpeg,image/png,image/webp",
  folder = "uploads",
  multiple = true,
  onFilesSelected,
  onUploadSuccess,
  onUploadError,
  onFileRemove,
  title = "上传图片",
  description = `支持拖拽上传或点击选择，最大 ${maxSize}MB`,
  icon = "📸"
}: ImageUploaderProps) {
  const { theme } = useTheme();
  const [files, setFiles] = useState<UploadFile[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 解析接受的文件类型
  const acceptTypes = accept.split(',').map(t => t.trim());

  // 样式定义
  const styles = {
    container: {
      width: '100%'
    },
    dropZone: {
      border: `2px dashed ${isDragging
        ? (theme === 'dark' ? '#60a5fa' : '#8b5cf6')
        : (theme === 'dark' ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.1)')
      }`,
      borderRadius: 12,
      padding: '2rem',
      textAlign: 'center' as const,
      backgroundColor: isDragging
        ? (theme === 'dark' ? 'rgba(96, 165, 250, 0.1)' : 'rgba(139, 92, 246, 0.05)')
        : (theme === 'dark' ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.02)'),
      cursor: 'pointer',
      transition: 'all 0.3s ease'
    },
    icon: {
      fontSize: '3rem',
      marginBottom: '1rem'
    },
    title: {
      fontSize: '1.125rem',
      fontWeight: 600,
      color: theme === 'dark' ? '#e5e7eb' : '#1e293b',
      marginBottom: '0.5rem'
    },
    description: {
      fontSize: '0.875rem',
      color: theme === 'dark' ? '#9ca3af' : '#6b7280'
    },
    fileList: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
      gap: '1rem',
      marginTop: '1.5rem'
    },
    fileItem: {
      position: 'relative' as const,
      borderRadius: 8,
      overflow: 'hidden',
      border: `1px solid ${theme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
      backgroundColor: theme === 'dark' ? '#1f2a3a' : 'white'
    },
    filePreview: {
      width: '100%',
      height: 150,
      objectFit: 'cover' as const
    },
    fileOverlay: {
      position: 'absolute' as const,
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'column' as const,
      gap: '0.5rem'
    },
    progressBar: {
      width: '80%',
      height: 4,
      backgroundColor: 'rgba(255,255,255,0.3)',
      borderRadius: 2,
      overflow: 'hidden'
    },
    progressFill: {
      height: '100%',
      backgroundColor: '#10b981',
      transition: 'width 0.3s ease'
    },
    progressText: {
      color: 'white',
      fontSize: '0.75rem',
      fontWeight: 500
    },
    errorText: {
      color: '#ef4444',
      fontSize: '0.75rem',
      textAlign: 'center' as const,
      padding: '0.5rem'
    },
    removeButton: {
      position: 'absolute' as const,
      top: 8,
      right: 8,
      width: 24,
      height: 24,
      borderRadius: '50%',
      border: 'none',
      backgroundColor: 'rgba(239, 68, 68, 0.9)',
      color: 'white',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '1rem',
      transition: 'all 0.2s ease'
    },
    successBadge: {
      position: 'absolute' as const,
      top: 8,
      right: 8,
      width: 24,
      height: 24,
      borderRadius: '50%',
      backgroundColor: '#10b981',
      color: 'white',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '0.875rem'
    },
    fileInfo: {
      padding: '0.75rem',
      fontSize: '0.75rem',
      color: theme === 'dark' ? '#9ca3af' : '#6b7280',
      whiteSpace: 'nowrap' as const,
      overflow: 'hidden',
      textOverflow: 'ellipsis'
    },
    addMoreButton: {
      border: `2px dashed ${theme === 'dark' ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.1)'}`,
      borderRadius: 8,
      height: 150,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      cursor: 'pointer',
      backgroundColor: theme === 'dark' ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.02)',
      transition: 'all 0.3s ease',
      fontSize: '2rem',
      color: theme === 'dark' ? '#9ca3af' : '#6b7280'
    }
  };

  // 处理文件选择
  const handleFiles = useCallback(async (selectedFiles: FileList | null) => {
    if (!selectedFiles) return;

    const newFiles: UploadFile[] = [];
    const currentCount = files.length;

    // 检查是否超过最大文件数
    if (currentCount >= maxFiles) {
      alert(`最多只能上传 ${maxFiles} 张图片`);
      return;
    }

    // 处理每个文件
    for (let i = 0; i < selectedFiles.length; i++) {
      // 检查是否超过最大文件数
      if (currentCount + newFiles.length >= maxFiles) {
        alert(`最多只能上传 ${maxFiles} 张图片，已自动选择前 ${maxFiles - currentCount} 张`);
        break;
      }

      const file = selectedFiles[i];

      // 验证文件
      const validation = validateFile(file, maxSize, acceptTypes);
      if (!validation.valid) {
        newFiles.push({
          id: generateId(),
          file,
          preview: '',
          status: 'error',
          progress: 0,
          error: validation.error
        });
        continue;
      }

      // 读取文件预览
      try {
        const preview = await readFileAsDataURL(file);
        newFiles.push({
          id: generateId(),
          file,
          preview,
          status: 'pending',
          progress: 0
        });
      } catch (error) {
        newFiles.push({
          id: generateId(),
          file,
          preview: '',
          status: 'error',
          progress: 0,
          error: '读取文件失败'
        });
      }
    }

    // 更新文件列表
    const updatedFiles = [...files, ...newFiles];
    setFiles(updatedFiles);

    // 触发回调
    onFilesSelected?.(newFiles);

    // 自动开始上传
    newFiles.forEach(uploadFile => {
      if (uploadFile.status === 'pending') {
        uploadFileToServer(uploadFile, updatedFiles);
      }
    });
  }, [files, maxFiles, maxSize, acceptTypes, onFilesSelected]);

  // 上传文件到服务器
  const uploadFileToServer = async (uploadFile: UploadFile, allFiles: UploadFile[]) => {
    // 更新状态为上传中
    updateFileStatus(uploadFile.id, { status: 'uploading', progress: 0 }, allFiles);

    try {
      // 读取文件为 base64
      const base64Data = await readFileAsDataURL(uploadFile.file);

      // 模拟上传进度
      const progressInterval = setInterval(() => {
        updateFileStatus(uploadFile.id, (prev) => ({
          progress: Math.min(prev.progress + 10, 90)
        }), allFiles);
      }, 200);

      // 调用上传 API
      const response = await fetch('/api/upload', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({
          file: base64Data,
          filename: uploadFile.file.name,
          folder
        })
      });

      clearInterval(progressInterval);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || '上传失败');
      }

      const data = await response.json();

      // 更新状态为成功
      updateFileStatus(uploadFile.id, {
        status: 'success',
        progress: 100,
        url: data.url
      }, allFiles);

      // 触发成功回调
      onUploadSuccess?.([{ ...uploadFile, status: 'success', progress: 100, url: data.url }]);

    } catch (error: any) {
      // 更新状态为失败
      updateFileStatus(uploadFile.id, {
        status: 'error',
        progress: 0,
        error: error.message || '上传失败'
      }, allFiles);

      // 触发失败回调
      onUploadError?.(uploadFile, error.message || '上传失败');
    }
  };

  // 更新文件状态
  const updateFileStatus = (
    fileId: string,
    updates: Partial<UploadFile> | ((prev: UploadFile) => Partial<UploadFile>),
    allFiles?: UploadFile[]
  ) => {
    setFiles(prevFiles => {
      const targetFiles = allFiles || prevFiles;
      return targetFiles.map(file => {
        if (file.id !== fileId) return file;
        const updateValues = typeof updates === 'function' ? updates(file) : updates;
        return { ...file, ...updateValues };
      });
    });
  };

  // 删除文件
  const removeFile = (fileId: string) => {
    const fileToRemove = files.find(f => f.id === fileId);
    if (fileToRemove) {
      setFiles(prev => prev.filter(f => f.id !== fileId));
      onFileRemove?.(fileToRemove);
    }
  };

  // 处理拖拽事件
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleFiles(e.dataTransfer.files);
  };

  // 点击上传区域
  const handleClick = () => {
    fileInputRef.current?.click();
  };

  // 处理文件输入变化
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFiles(e.target.files);
    // 重置 input 以便可以重复选择相同文件
    e.target.value = '';
  };

  // 获取成功的文件列表
  const getUploadedFiles = () => files.filter(f => f.status === 'success');

  return (
    <div style={styles.container}>
      {/* 上传区域 */}
      {files.length < maxFiles && (
        <div
          style={styles.dropZone}
          onClick={handleClick}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <div style={styles.icon}>{icon}</div>
          <div style={styles.title}>{title}</div>
          <div style={styles.description}>{description}</div>
          <input
            ref={fileInputRef}
            type="file"
            accept={accept}
            multiple={multiple && files.length < maxFiles - 1}
            style={{ display: 'none' }}
            onChange={handleInputChange}
          />
        </div>
      )}

      {/* 文件列表 */}
      {files.length > 0 && (
        <div style={styles.fileList}>
          {files.map(file => (
            <div key={file.id} style={styles.fileItem}>
              {/* 图片预览 */}
              {file.preview && (
                <img
                  src={file.preview}
                  alt={file.file.name}
                  style={styles.filePreview}
                />
              )}

              {/* 上传中遮罩 */}
              {file.status === 'uploading' && (
                <div style={styles.fileOverlay}>
                  <div style={styles.progressBar}>
                    <div
                      style={{
                        ...styles.progressFill,
                        width: `${file.progress}%`
                      }}
                    />
                  </div>
                  <span style={styles.progressText}>{file.progress}%</span>
                </div>
              )}

              {/* 成功标记 */}
              {file.status === 'success' && (
                <div style={styles.successBadge}>✓</div>
              )}

              {/* 删除按钮 */}
              {file.status !== 'uploading' && (
                <button
                  style={styles.removeButton}
                  onClick={() => removeFile(file.id)}
                  title="删除"
                >
                  ×
                </button>
              )}

              {/* 错误信息 */}
              {file.status === 'error' && file.error && (
                <div style={styles.errorText}>{file.error}</div>
              )}

              {/* 文件名 */}
              {file.status !== 'error' && (
                <div style={styles.fileInfo} title={file.file.name}>
                  {file.file.name}
                </div>
              )}
            </div>
          ))}

          {/* 添加更多按钮 */}
          {multiple && files.length < maxFiles && (
            <div
              style={styles.addMoreButton}
              onClick={handleClick}
              title="添加更多图片"
            >
              +
            </div>
          )}
        </div>
      )}
    </div>
  );
}

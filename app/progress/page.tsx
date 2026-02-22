"use client";

import React, { useState, useEffect, useRef, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { fetchWithRetry } from '@/lib/utils/network';
import { saveToLocalHistory } from '@/lib/localHistory';
import { getImageData, removeImageData } from '@/lib/imageStore';
import { OutfitSchemeInfo } from '@/lib/image-generation/types';

interface GenerationResult {
  url: string;
  index: number;
}

/**
 * 进度页面内容组件
 * 使用 useSearchParams 需要在 Suspense 边界内
 */
function ProgressContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState<'preparing' | 'generating' | 'finalizing'>('preparing');
  const [error, setError] = useState<string | null>(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [completedCount, setCompletedCount] = useState(0);
  const [totalCount, setTotalCount] = useState(1);
  const [results, setResults] = useState<GenerationResult[]>([]);
  
  // 使用 ref 来跟踪组件是否还在挂载状态和实际耗时
  const isMounted = useRef(true);
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const elapsedTimeRef = useRef(0);

  // 从 localStorage 和内存存储获取生成所需的数据
  const [generateData, setGenerateData] = useState<{
    model: string;
    outfit: string;
    outfits: string[]; // 所有服装图片（最多3张）
    pose: string;
    style: string;
    lighting: string;
    background: string;
    count: number;
    outfitSchemeInfo?: OutfitSchemeInfo; // 穿搭方案信息
    outfitSource?: 'library' | 'custom'; // 图片来源类型
  } | null>(null);

  // 从 localStorage 和 IndexedDB 读取数据
  useEffect(() => {
    const loadData = async () => {
      const savedConfig = localStorage.getItem('generateConfig');
      const storeKey = searchParams.get('key');
      const countParam = searchParams.get('count');
      const count = countParam ? parseInt(countParam, 10) : 1;
      
      setTotalCount(count);
      
      if (savedConfig) {
        try {
          const config = JSON.parse(savedConfig);
          
          // 从 IndexedDB 读取大图片数据
          let modelImage = '';
          let outfitImages: string[] = [];
          
          console.log('[Progress] 尝试从 IndexedDB 读取，storeKey:', storeKey);
          
          if (storeKey) {
            try {
              const imageData = await getImageData(storeKey);
              console.log('[Progress] 从 IndexedDB 读取到的数据:', imageData ? {
                hasModel: !!imageData.model,
                modelLength: imageData.model?.length,
                outfitsCount: imageData.outfits?.length,
                firstOutfitLength: imageData.outfits?.[0]?.length
              } : 'null');
              
              if (imageData) {
                modelImage = imageData.model || '';
                outfitImages = imageData.outfits || [];
                console.log('[Progress] 从 IndexedDB 读取图片数据成功');
              } else {
                console.error('[Progress] IndexedDB 中没有找到数据');
              }
            } catch (e) {
              console.error('[Progress] 从 IndexedDB 读取失败:', e);
            }
          } else {
            console.error('[Progress] 没有 storeKey，无法从 IndexedDB 读取');
          }
          
          // 如果 IndexedDB 读取失败，尝试从 config 中读取（向后兼容）
          if (!modelImage && config.model) {
            modelImage = config.model;
          }
          if (outfitImages.length === 0 && config.outfits) {
            outfitImages = config.outfits;
          }
          
          const newGenerateData = {
            model: modelImage,
            outfit: outfitImages[0] || '',
            outfits: outfitImages,
            pose: config.pose || '正面站立',
            style: config.style || 'street',
            lighting: config.lighting || 'natural',
            background: config.background || 'city',
            count: count,
            outfitSchemeInfo: config.outfitSchemeInfo, // 传递穿搭方案信息
            outfitSource: config.outfitSource, // 传递图片来源类型
          };
          
          console.log('[Progress] 设置 generateData:', {
            hasModel: !!newGenerateData.model,
            modelLength: newGenerateData.model?.length,
            hasOutfit: !!newGenerateData.outfit,
            outfitLength: newGenerateData.outfit?.length,
            outfitsCount: newGenerateData.outfits?.length
          });
          
          setGenerateData(newGenerateData);
        } catch (e) {
          console.error('[Progress] 解析配置失败:', e);
          setError('加载配置失败，请返回重新上传');
        }
      } else {
        setError('未找到生成配置，请返回重新上传');
      }
    };
    
    loadData();
  }, [searchParams]);

  // 开始生成
  useEffect(() => {
    console.log('[Progress] useEffect 触发，generateData:', generateData ? {
      hasModel: !!generateData.model,
      modelLength: generateData.model?.length,
      hasOutfit: !!generateData.outfit,
      outfitsLength: generateData.outfits?.length,
      outfitFirstLength: generateData.outfits?.[0]?.length
    } : 'null');
    
    // 检查是否有模特图和服装图（支持单张 outfit 或多张 outfits）
    const hasOutfit = generateData && (generateData.outfit || (generateData.outfits && generateData.outfits.length > 0));
    console.log('[Progress] 检查条件:', {
      hasGenerateData: !!generateData,
      hasModel: generateData ? !!generateData.model : false,
      hasOutfit: hasOutfit,
      willStart: generateData && generateData.model && hasOutfit
    });
    
    if (generateData && generateData.model && hasOutfit) {
      console.log('[Progress] 条件满足，调用 startGeneration');
      startGeneration();
    }
  }, [generateData]);
  
  // 组件卸载时的清理
  useEffect(() => {
    return () => {
      isMounted.current = false;
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
        progressIntervalRef.current = null;
      }
    };
  }, []);

  const startGeneration = async () => {
    console.log('[Progress] startGeneration 被调用');
    if (!generateData) {
      console.log('[Progress] startGeneration: generateData 为空，直接返回');
      return;
    }
    
    const { model, outfit, outfits, pose, style, lighting, background, count, outfitSchemeInfo, outfitSource } = generateData;
    const generateCount = count || 1;
    
    console.log('[Progress] 开始生成:', { pose, style, count: generateCount, hasModel: !!model, hasOutfits: outfits?.length, outfitSource });
    
    // 非线性进度增长模拟
    // 通义千问实际耗时：约20-40秒
    // 进度条策略：
    // - 0-20%: 准备阶段（约5秒）
    // - 20-80%: 生成阶段（约15-30秒，非线性增长）
    // - 80-100%: 完善阶段（约5秒）
    let currentProgress = 0;
    const startTime = Date.now();
    
    // 启动进度条更新（使用更短的间隔确保流畅）
    progressIntervalRef.current = setInterval(() => {
      if (!isMounted.current) {
        if (progressIntervalRef.current) {
          clearInterval(progressIntervalRef.current);
        }
        return;
      }
      
      const elapsed = (Date.now() - startTime) / 1000;
      elapsedTimeRef.current = Math.floor(elapsed);
      setElapsedTime(Math.floor(elapsed));
      
      // 非线性进度计算
      if (currentProgress < 20) {
        // 准备阶段：快速增长到20%
        currentProgress += 2;
        setStatus('preparing');
      } else if (currentProgress < 80) {
        // 生成阶段：缓慢增长，模拟实际API耗时
        // 使用对数增长，越接近80增长越慢
        const remainingTo80 = 80 - currentProgress;
        const increment = Math.max(0.3, remainingTo80 * 0.05);
        currentProgress += increment;
        setStatus('generating');
      } else if (currentProgress < 100) {
        // 完善阶段：缓慢增长到100%
        currentProgress += 0.8;
        setStatus('finalizing');
      }
      
      if (currentProgress >= 100) {
        currentProgress = 100;
        if (progressIntervalRef.current) {
          clearInterval(progressIntervalRef.current);
          progressIntervalRef.current = null;
        }
      }
      
      setProgress(Math.min(99, Math.floor(currentProgress)));
    }, 500); // 改为每500ms更新一次，更流畅

    try {
      // 调用生成 API（这会阻塞，但进度条在另一个线程更新）
      const response = await fetchWithRetry('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          modelImage: model,
          outfitImages: outfits.length > 0 ? outfits : [outfit],
          outfitSchemeInfo, // 传递穿搭方案信息
          outfitSource, // 传递图片来源类型
          pose,
          style,
          lighting,
          background,
          count: generateCount,
        }),
      });

      const data = await response.json();
      console.log('[Progress] 生成完成:', data);

      if (!isMounted.current) return;

      if (data.status === 'success') {
        // 停止进度条
        if (progressIntervalRef.current) {
          clearInterval(progressIntervalRef.current);
          progressIntervalRef.current = null;
        }
        
        setProgress(100);
        setStatus('finalizing');
        
        // 使用 API 返回的真实耗时
        const actualTime = data.latencyMs ? Math.round(data.latencyMs / 1000) : elapsedTimeRef.current;
        elapsedTimeRef.current = actualTime;
        setElapsedTime(actualTime);
        
        // 确保显示100%一段时间后再跳转
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // 处理返回的图片URL
        const allUrls: string[] = [];
        if (data.images && Array.isArray(data.images)) {
          allUrls.push(...data.images);
        } else if (data.url) {
          allUrls.push(data.url);
        }
        
        // 清理 IndexedDB 中的临时数据
        const storeKey = searchParams.get('key');
        if (storeKey) {
          try {
            await removeImageData(storeKey);
            console.log('[Progress] 已清理临时图片数据');
          } catch (e) {
            console.warn('[Progress] 清理临时数据失败:', e);
          }
        }

        // 保存到历史记录
        await saveHistory(allUrls);

        // 将源图片数据保存到 sessionStorage（避免 localStorage 配额限制）
        try {
          sessionStorage.setItem('resultSourceImages', JSON.stringify({
            model: model,
            outfit: outfit,
          }));
        } catch (e) {
          console.warn('[Progress] sessionStorage 存储失败，跳过源图片保存');
        }

        // 跳转到结果页面 - 使用 ref 获取最新的耗时
        const timeForResult = elapsedTimeRef.current.toString();
        console.log('[Progress] 跳转到结果页面，实际耗时:', timeForResult, '秒');
        const resultParams = new URLSearchParams({
          images: JSON.stringify(allUrls),
          pose,
          style,
          time: timeForResult,
          count: allUrls.length.toString(),
        });
        
        if (isMounted.current) {
          router.push(`/result?${resultParams.toString()}`);
        }
      } else {
        throw new Error(data.message || '生成失败');
      }
    } catch (error) {
      console.error('[Progress] 生成失败:', error);
      
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
        progressIntervalRef.current = null;
      }
      
      if (!isMounted.current) return;
      
      const errorMessage = error instanceof Error ? error.message : '生成失败';
      setError(errorMessage);
    }
  };

  const saveHistory = async (urls: string[]) => {
    if (!generateData) return;
    
    // 使用 ref 获取最新的耗时，避免状态更新延迟问题
    const actualTime = elapsedTimeRef.current.toString();
    console.log('保存历史记录，实际耗时:', actualTime, '秒');
    let historySaved = false;
    
    const { model, outfits, pose, style, lighting, background, count } = generateData;
    
    try {
      await fetchWithRetry('/api/history', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          modelImage: model,
          outfitImages: outfits.length > 0 ? outfits : [model],
          pose,
          style,
          lighting,
          background,
          count: count || 1,
          generatedImages: urls,
          time: actualTime,
        }),
        retry: {
          maxRetries: 2,
          retryDelay: 1000
        }
      });
      historySaved = true;
      console.log('历史记录已保存到服务器');
    } catch (historyError) {
      console.warn('保存到服务器失败，将保存到本地:', historyError);
    }
    
    if (!historySaved) {
      try {
        saveToLocalHistory({
          modelImage: model || '',
          outfitImages: outfits.length > 0 ? outfits : [],
          generatedImages: urls,
          pose,
          style,
          lighting,
          background,
          time: actualTime,
        });
        console.log('历史记录已保存到本地');
      } catch (localError) {
        console.error('保存本地历史记录失败:', localError);
      }
    }
  };

  const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getStatusText = () => {
    switch (status) {
      case 'preparing':
        return '正在准备...';
      case 'generating':
        // 通义千问原生批量生成：一次性生成所有图片，不是逐张生成
        return totalCount > 1 
          ? `AI正在批量生成 ${totalCount} 张图片...`
          : 'AI正在创作中...';
      case 'finalizing':
        return '正在完善细节...';
      default:
        return '处理中...';
    }
  };

  const getStatusDescription = () => {
    switch (status) {
      case 'preparing':
        return '分析图片特征，准备生成环境';
      case 'generating':
        // 通义千问原生批量生成：多张图片是一次性生成的，不是逐张生成
        if (totalCount > 1) {
          return `AI正在批量生成 ${totalCount} 张图片，这比单张生成需要更多时间，请耐心等待`;
        }
        return 'AI正在创作中，约需20-40秒，请耐心等待';
      case 'finalizing':
        return '优化色彩和光影效果';
      default:
        return '';
    }
  };

  // 计算预计剩余时间
  // 注意：现在使用通义千问原生批量生成（一次调用生成多张），不是循环生成
  const getEstimatedTimeRemaining = (): string => {
    if (progress >= 100) return '即将完成';
    
    // 通义千问批量生成时间估算：
    // - 单张：约20-40秒
    // - 批量：时间不是线性增长，而是增加一定开销
    // 估算公式：基础时间 + 额外开销（每张额外约5-10秒）
    const baseTime = 30; // 基础时间30秒
    const overheadPerImage = 8; // 每张额外开销8秒
    const totalEstimatedTime = baseTime + (totalCount - 1) * overheadPerImage;
    
    // 根据当前进度计算剩余时间
    const remainingProgress = 100 - progress;
    const estimatedRemainingSeconds = Math.ceil((remainingProgress / 100) * totalEstimatedTime);
    
    // 批量生成时显示更友好的信息（因为是并行生成，不是逐张）
    if (totalCount > 1 && status === 'generating') {
      return `批量生成 ${totalCount} 张中，预计还需 ${Math.max(5, estimatedRemainingSeconds)} 秒`;
    }
    
    // 单张生成的简单估算
    if (progress < 20) return `预计还需: 约 ${Math.max(10, estimatedRemainingSeconds)} 秒`;
    if (progress < 50) return `预计还需: 约 ${Math.max(5, estimatedRemainingSeconds)} 秒`;
    if (progress < 80) return `预计还需: 约 ${Math.max(3, estimatedRemainingSeconds)} 秒`;
    return '即将完成';
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-24 px-6 pb-12">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="font-heading text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            {error ? '生成失败' : '正在创作'}
          </h1>
          {!error && (
            <p className="text-gray-600">
              {totalCount > 1 
                ? `AI正在为您生成 ${totalCount} 张专属穿搭效果图`
                : 'AI正在为您生成专属穿搭效果图'}
            </p>
          )}
        </div>

        {error ? (
          // 错误状态
          <div className="card p-8 text-center">
            <div className="w-20 h-20 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">生成失败</h3>
            <p className="text-gray-500 mb-6">{error}</p>
            <div className="flex gap-4 justify-center">
              <button
                onClick={() => window.location.reload()}
                className="px-6 py-3 bg-primary-600 text-white rounded-xl font-medium hover:bg-primary-700 transition-colors"
              >
                重试
              </button>
              <Link
                href="/upload"
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors"
              >
                返回修改
              </Link>
            </div>
          </div>
        ) : (
          // 进度状态
          <div className="card p-8">
            {/* 动画区域 */}
            <div className="relative mb-8">
              {/* 背景圆圈 */}
              <div className="w-48 h-48 mx-auto relative">
                {/* 外圈旋转动画 */}
                <div className="absolute inset-0 rounded-full border-4 border-gray-100"></div>
                <div 
                  className="absolute inset-0 rounded-full border-4 border-primary-500 border-t-transparent animate-spin"
                  style={{ animationDuration: '2s' }}
                ></div>
                
                {/* 内圈脉冲动画 */}
                <div className="absolute inset-4 rounded-full bg-primary-50 flex items-center justify-center">
                  <div className="absolute inset-0 rounded-full bg-primary-400 opacity-20 animate-ping" style={{ animationDuration: '2s' }}></div>
                  <div className="relative">
                    {status === 'preparing' && (
                      <svg className="w-16 h-16 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    )}
                    {status === 'generating' && (
                      <svg className="w-16 h-16 text-primary-600 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    )}
                    {status === 'finalizing' && (
                      <svg className="w-16 h-16 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                      </svg>
                    )}
                  </div>
                </div>
              </div>

              {/* 进度百分比 */}
              <div className="text-center mt-6">
                <span className="text-5xl font-bold text-primary-600">{progress}</span>
                <span className="text-2xl text-primary-400">%</span>
              </div>
            </div>

            {/* 状态文字 */}
            <div className="text-center mb-8">
              <h3 className="text-xl font-bold text-gray-900 mb-2">{getStatusText()}</h3>
              <p className="text-gray-500">{getStatusDescription()}</p>
            </div>

            {/* 进度条 */}
            <div className="mb-6">
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-primary-500 to-primary-600 transition-all duration-300 ease-out rounded-full"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
            </div>

            {/* 时间和提示 */}
            <div className="flex items-center justify-between text-sm text-gray-500">
              <span>已用时: {formatTime(elapsedTime)}</span>
              <span>{getEstimatedTimeRemaining()}</span>
            </div>

            {/* 批量生成提示 - 通义千问原生批量生成 */}
            {totalCount > 1 && status === 'generating' && (
              <div className="mt-6 p-4 bg-blue-50 rounded-xl border border-blue-100">
                <div className="flex items-center gap-3">
                  <svg className="w-5 h-5 text-blue-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <div className="text-sm text-blue-800">
                    <p className="font-medium">批量生成中</p>
                    <p>正在同时生成 {totalCount} 张图片，使用通义千问原生批量生成能力，每张图片都会略有不同</p>
                  </div>
                </div>
              </div>
            )}

            {/* 提示卡片 */}
            <div className="mt-6 p-4 bg-primary-50 rounded-xl border border-primary-100">
              <div className="flex items-start gap-3">
                <svg className="w-5 h-5 text-primary-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div className="text-sm text-primary-800">
                  <p className="font-medium mb-1">小贴士</p>
                  <p>AI正在学习您的模特特征和服装风格，首次生成可能需要更长时间。生成的图片会自动保存到您的历史记录中。</p>
                </div>
              </div>
            </div>

            {/* 取消按钮 */}
            <div className="mt-6 text-center">
              <Link
                href="/upload"
                className="text-gray-500 hover:text-gray-700 text-sm underline"
              >
                取消生成并返回
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/**
 * 加载状态组件
 */
function LoadingState() {
  return (
    <div className="min-h-screen bg-gray-50 pt-24 px-6 pb-12">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="font-heading text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            加载中...
          </h1>
          <p className="text-gray-600">正在初始化生成页面</p>
        </div>
        <div className="card p-8 text-center">
          <div className="w-20 h-20 rounded-full bg-primary-100 flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-primary-600 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </div>
          <p className="text-gray-500">请稍候...</p>
        </div>
      </div>
    </div>
  );
}

/**
 * 进度页面
 * 使用 Suspense 包装使用 useSearchParams 的组件
 */
export default function ProgressPage() {
  return (
    <Suspense fallback={<LoadingState />}>
      <ProgressContent />
    </Suspense>
  );
}

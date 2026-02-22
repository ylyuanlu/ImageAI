"use client";

import React, { useState, useRef, useCallback, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import StepIndicator from '../components/StepIndicator';
import PoseGallery from '../components/PoseGallery';
import StyleChips from '../components/StyleChips';
import QuotaBadge from '../components/QuotaBadge';
import { compressImage } from '@/lib/utils/network';
import { storeImageData } from '@/lib/imageStore';

import { poses, poseCategories, type Pose } from '@/lib/poses-data';

// 风格选项
const styleOptions = [
  { id: 'street', label: '街拍风格' },
  { id: 'magazine', label: '时尚杂志' },
  { id: 'ecommerce', label: '电商展示' },
  { id: 'artistic', label: '艺术写真' },
];

const lightingOptions = [
  { id: 'natural', label: '自然光' },
  { id: 'studio', label: '影棚光' },
  { id: 'sunset', label: '黄昏光' },
  { id: 'indoor', label: '室内光' },
];

const backgroundOptions = [
  { id: 'city', label: '城市街景' },
  { id: 'solid', label: '纯色背景' },
  { id: 'nature', label: '自然风光' },
  { id: 'indoor', label: '室内场景' },
];

// 步骤配置
const steps = [
  {
    id: 'upload',
    label: '上传图片',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    ),
  },
  {
    id: 'generate',
    label: 'AI生成中',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
  },
  {
    id: 'complete',
    label: '生成完成',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
      </svg>
    ),
  },
];

// 穿搭模式类型
type OutfitMode = 'library' | 'custom';

export default function UploadContent() {
  const router = useRouter();
  const [currentStep] = useState(0);
  const [modelImage, setModelImage] = useState<string | null>(null);
  const [outfitImages, setOutfitImages] = useState<string[]>([]);
  const [selectedPose, setSelectedPose] = useState<string | null>(null);
  const [poseDescription, setPoseDescription] = useState<string>('正面站立'); // 姿势描述文本
  const [style, setStyle] = useState('street');
  const [lighting, setLighting] = useState('natural');
  const [background, setBackground] = useState('city');
  const [generateCount, setGenerateCount] = useState(1);
  const [isDraggingModel, setIsDraggingModel] = useState(false);
  const [isDraggingOutfit, setIsDraggingOutfit] = useState(false);
  const [remainingQuota] = useState(5);
  const [customPoseImage, setCustomPoseImage] = useState<string | null>(null);
  const [selectedOutfitInfo, setSelectedOutfitInfo] = useState<any>(null);
  const [outfitMode, setOutfitMode] = useState<OutfitMode>('custom'); // 穿搭选择模式

  const modelInputRef = useRef<HTMLInputElement>(null);
  const outfitInputRef = useRef<HTMLInputElement>(null);

  // 读取 URL 参数中的姿势信息
  const searchParams = useSearchParams();
  
  useEffect(() => {
    // 从 localStorage 读取从穿搭库页面选择的服装
    const savedOutfit = localStorage.getItem('selectedOutfit');
    if (savedOutfit) {
      try {
        const outfitData = JSON.parse(savedOutfit);
        setSelectedOutfitInfo(outfitData);
        // 将穿搭图片添加到服装图片列表（支持单张或多张）
        if (outfitData.images && Array.isArray(outfitData.images)) {
          // 多张图片（从穿搭库多选）
          setOutfitImages(outfitData.images);
          setOutfitMode('library');
        } else if (outfitData.image) {
          // 单张图片（兼容旧数据）
          setOutfitImages([outfitData.image]);
          setOutfitMode('library');
        }
      } catch (e) {
        console.error('解析穿搭数据失败:', e);
      }
    }

    const poseParam = searchParams.get('pose');
    const poseIdParam = searchParams.get('poseId');
    const poseImageParam = searchParams.get('poseImage');
    const poseUrlParam = searchParams.get('poseUrl'); // AI生成姿势使用的参数
    const poseType = searchParams.get('poseType');
    
    if (poseParam) {
      // 处理姿势图片：优先使用 poseUrl（AI生成/历史记录），其次是 poseImage（自定义姿势库）
      const poseImageUrl = poseUrlParam || poseImageParam;
      
      // 如果是自定义姿势且有图片，生成自定义姿势ID
      if (poseType === 'custom' && poseImageUrl) {
        const customPoseId = `url-${poseParam}`;
        setCustomPoseImage(poseImageUrl);
        
        // 将自定义姿势添加到 localStorage（包括从姿势库、AI生成、生成历史跳转过来的）
        const customPoses = JSON.parse(localStorage.getItem('customPoses') || '[]');
        const existingPose = customPoses.find((p: any) => p.id === customPoseId);
        
        if (!existingPose) {
          const newPose = {
            id: customPoseId,
            name: poseParam.slice(0, 30) + (poseParam.length > 30 ? '...' : ''),
            description: poseParam,
            image: poseImageUrl,
            category: 'custom',
            type: 'custom',
            createdAt: Date.now(),
            useCount: 1,
            isFavorite: false
          };
          
          customPoses.unshift(newPose);
          if (customPoses.length > 20) customPoses.pop();
          localStorage.setItem('customPoses', JSON.stringify(customPoses));
        }
        
        // 设置选中的姿势ID为自定义姿势ID
        setSelectedPose(customPoseId);
      } else if (poseIdParam) {
        // 有 poseId 参数（预设姿势）
        setSelectedPose(poseIdParam);
      }
      
      // 同时设置姿势描述
      setPoseDescription(poseParam);
    }
  }, [searchParams]);

  // 处理图片压缩和读取
  const processImageFile = useCallback(async (file: File): Promise<string> => {
    let processedFile: File | Blob = file;
    if (file.size > 5 * 1024 * 1024) {
      try {
        console.log(`压缩图片: ${(file.size / 1024 / 1024).toFixed(2)}MB`);
        processedFile = await compressImage(file, {
          maxWidth: 1920,
          maxHeight: 1920,
          quality: 0.8,
          maxSizeMB: 5
        });
        console.log(`压缩后: ${(processedFile.size / 1024 / 1024).toFixed(2)}MB`);
      } catch (error) {
        console.warn('图片压缩失败，使用原图:', error);
      }
    }

    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(processedFile instanceof File ? processedFile : new File([processedFile], file.name));
    });
  }, []);

  // 处理模特图片上传
  const handleModelUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const imageData = await processImageFile(file);
        setModelImage(imageData);
      } catch (error) {
        console.error('模特图片处理失败:', error);
        alert('图片处理失败，请重试');
      }
    }
  };

  // 处理服装图片上传（支持多选）
  const handleOutfitUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    try {
      const remainingSlots = 3 - outfitImages.length;
      if (remainingSlots <= 0) {
        alert('最多只能上传3张服装图片');
        return;
      }

      // 限制处理数量，不超过剩余槽位
      const filesToProcess = Math.min(files.length, remainingSlots);
      const newImages: string[] = [];

      for (let i = 0; i < filesToProcess; i++) {
        const file = files[i];
        if (file.type.startsWith('image/')) {
          const imageData = await processImageFile(file);
          newImages.push(imageData);
        }
      }

      if (newImages.length > 0) {
        setOutfitImages((prev) => [...prev, ...newImages].slice(0, 3));
      }

      // 如果有更多文件被忽略，提示用户
      if (files.length > remainingSlots) {
        alert(`已选择 ${files.length} 张图片，但只添加了前 ${remainingSlots} 张（最多3张）`);
      }
    } catch (error) {
      console.error('服装图片处理失败:', error);
      alert('图片处理失败，请重试');
    }
  };

  // 拖拽处理（支持多文件）
  const handleDrop = async (e: React.DragEvent, type: 'model' | 'outfit') => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    if (!files || files.length === 0) return;

    try {
      if (type === 'model') {
        // 模特图片只取第一个
        const file = files[0];
        if (file.type.startsWith('image/')) {
          const imageData = await processImageFile(file);
          setModelImage(imageData);
          setIsDraggingModel(false);
        }
      } else {
        // 服装图片支持多选
        const remainingSlots = 3 - outfitImages.length;
        if (remainingSlots <= 0) {
          alert('最多只能上传3张服装图片');
          setIsDraggingOutfit(false);
          return;
        }

        const filesToProcess = Math.min(files.length, remainingSlots);
        const newImages: string[] = [];

        for (let i = 0; i < filesToProcess; i++) {
          const file = files[i];
          if (file.type.startsWith('image/')) {
            const imageData = await processImageFile(file);
            newImages.push(imageData);
          }
        }

        if (newImages.length > 0) {
          setOutfitImages((prev) => [...prev, ...newImages].slice(0, 3));
        }

        if (files.length > remainingSlots) {
          alert(`已拖拽 ${files.length} 张图片，但只添加了前 ${remainingSlots} 张（最多3张）`);
        }
        setIsDraggingOutfit(false);
      }
    } catch (error) {
      console.error('拖拽图片处理失败:', error);
      alert('图片处理失败，请重试');
    }
  };

  // 开始生成 - 跳转到进度页面
  const handleStartGenerate = async () => {
    if (!modelImage || outfitImages.length === 0) return;

    const timestamp = Date.now();
    
    try {
      // 将大图片数据存储到 IndexedDB，避免 localStorage 配额限制
      const storeKey = await storeImageData({
        model: modelImage,
        outfits: outfitImages,
        timestamp,
      });
      
      // 只存储轻量级配置到 localStorage
      const generateConfig = {
        pose: poseDescription, // 使用姿势描述文本，而不是 ID
        style,
        lighting,
        background,
        count: generateCount,
        timestamp,
        storeKey, // 引用 IndexedDB 存储的 key
        // 新增：传递穿搭方案信息（如果是系统推荐模式）
        outfitSchemeInfo: outfitMode === 'library' && selectedOutfitInfo ? {
          id: selectedOutfitInfo.id,
          name: selectedOutfitInfo.name,
          category: selectedOutfitInfo.category,
          style: selectedOutfitInfo.style,
          tags: selectedOutfitInfo.tags,
          description: selectedOutfitInfo.description,
          type: selectedOutfitInfo.type, // 穿搭类型：single/combo
          items: selectedOutfitInfo.items // 组合穿搭的单品列表
        } : undefined,
        // 新增：传递图片来源类型
        outfitSource: outfitMode === 'library' ? 'library' : 'custom'
      };
      localStorage.setItem('generateConfig', JSON.stringify(generateConfig));
      
      console.log('[Upload] 开始生成，配置:', generateConfig);

      // 只传递轻量级标识参数
      const params = new URLSearchParams({
        ref: timestamp.toString(),
        count: generateCount.toString(),
        key: storeKey,
      });

      // 使用 window.location.href 避免 router.push 被拦截
      window.location.href = `/progress?${params.toString()}`;
    } catch (error) {
      console.error('存储图片数据失败:', error);
      alert('存储空间不足，请减少上传的图片数量或压缩图片');
    }
  };

  const canGenerate = modelImage && outfitImages.length > 0;

  return (
    <div className="min-h-screen bg-gray-50 pt-24 px-6 pb-12">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="font-heading text-4xl md:text-5xl font-bold text-gray-900">
            开始创作
          </h1>
          <QuotaBadge remaining={remainingQuota} />
        </div>

        {/* Step Indicator */}
        <StepIndicator steps={steps} currentStep={currentStep} />

        {/* Upload Section */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {/* Model Upload */}
          <div className="card p-8">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center shadow-md">
                <span className="font-bold text-white text-lg">1</span>
              </div>
              <div>
                <h3 className="font-heading text-xl font-bold text-gray-900">
                  模特照片
                </h3>
                <p className="text-gray-500 text-sm">上传清晰的全身照片</p>
              </div>
            </div>

            {modelImage ? (
              <div className="relative w-full">
                <div className="relative w-full aspect-[3/4] max-h-[400px] sm:max-h-64">
                  <img
                    src={modelImage}
                    alt="模特预览"
                    className="w-full h-full object-cover rounded-2xl"
                  />
                </div>
                <button
                  onClick={() => setModelImage(null)}
                  className="absolute top-3 right-3 w-10 h-10 rounded-full bg-red-500/80 hover:bg-red-500 flex items-center justify-center transition-colors backdrop-blur-sm z-10"
                >
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
                <div className="absolute bottom-3 left-3 px-3 py-1 bg-gray-900/70 rounded-full backdrop-blur-sm z-10">
                  <span className="text-white text-sm">模特照片</span>
                </div>
              </div>
            ) : (
              <div
                onClick={() => modelInputRef.current?.click()}
                onDragOver={(e) => { e.preventDefault(); setIsDraggingModel(true); }}
                onDragLeave={() => setIsDraggingModel(false)}
                onDrop={(e) => handleDrop(e, 'model')}
                className={`drop-zone ${isDraggingModel ? 'drop-zone-active' : ''}`}
              >
                <div className="w-20 h-20 rounded-full bg-primary-50 flex items-center justify-center mx-auto mb-4">
                  <svg className="w-10 h-10 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <p className="text-gray-800 font-medium mb-2">点击或拖拽上传模特照片</p>
                <p className="text-gray-400 text-sm mb-4">支持 JPG, PNG, WEBP (最大10MB)</p>
                <div className="flex justify-center gap-2">
                  <span className="px-3 py-1 rounded-full bg-gray-100 text-xs text-gray-600">正面照</span>
                  <span className="px-3 py-1 rounded-full bg-gray-100 text-xs text-gray-600">全身照</span>
                </div>
              </div>
            )}
            <input
              ref={modelInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleModelUpload}
            />
          </div>

          {/* Outfit Upload */}
          <div className="card p-8">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary-400 to-primary-500 flex items-center justify-center shadow-md">
                <span className="font-bold text-white text-lg">2</span>
              </div>
              <div className="flex-1">
                <h3 className="font-heading text-xl font-bold text-gray-900">
                  服装照片
                </h3>
                <p className="text-gray-500 text-sm">
                  {outfitMode === 'library' && selectedOutfitInfo 
                    ? `已选择系统推荐: ${selectedOutfitInfo.name}` 
                    : '选择服装来源并上传'}
                </p>
              </div>
            </div>

            {/* 模式切换 Tab */}
            <div className="flex gap-2 mb-6 p-1 bg-gray-100 rounded-xl">
              <button
                onClick={() => {
                  setOutfitMode('library');
                  // 切换到系统推荐模式时，如果有已保存的穿搭，恢复它
                  const savedOutfit = localStorage.getItem('selectedOutfit');
                  if (savedOutfit && outfitImages.length === 0) {
                    try {
                      const outfitData = JSON.parse(savedOutfit);
                      setSelectedOutfitInfo(outfitData);
                      if (outfitData.image) {
                        setOutfitImages([outfitData.image]);
                      }
                    } catch (e) {
                      console.error('解析穿搭数据失败:', e);
                    }
                  }
                }}
                className={`flex-1 py-2.5 px-4 rounded-lg text-sm font-medium transition-all ${
                  outfitMode === 'library'
                    ? 'bg-white text-primary-700 shadow-sm'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                <span className="flex items-center justify-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                  系统穿搭库
                </span>
              </button>
              <button
                onClick={() => {
                  setOutfitMode('custom');
                  // 切换到自定义模式时，清除系统推荐数据
                  if (selectedOutfitInfo) {
                    setSelectedOutfitInfo(null);
                    setOutfitImages([]);
                    localStorage.removeItem('selectedOutfit');
                  }
                }}
                className={`flex-1 py-2.5 px-4 rounded-lg text-sm font-medium transition-all ${
                  outfitMode === 'custom'
                    ? 'bg-white text-primary-700 shadow-sm'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                <span className="flex items-center justify-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  自定义上传
                </span>
              </button>
            </div>

            {/* 系统推荐模式内容 */}
            {outfitMode === 'library' && (
              <div className="space-y-4">
                {selectedOutfitInfo ? (
                  <div className="bg-gradient-to-br from-primary-50 to-white border border-primary-200 rounded-xl p-4">
                    <div className="flex items-start gap-4">
                      {/* 显示多张图片 */}
                      <div className="flex-shrink-0">
                        {outfitImages.length > 1 ? (
                          <div className="flex gap-2">
                            {outfitImages.map((img, idx) => (
                              <div key={idx} className="w-16 h-16 rounded-lg overflow-hidden border-2 border-primary-300">
                                <img 
                                  src={img} 
                                  alt={`服装${idx + 1}`}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="w-24 h-24 rounded-lg overflow-hidden">
                            <img 
                              src={outfitImages[0] || selectedOutfitInfo.image} 
                              alt={selectedOutfitInfo.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        )}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900 mb-1">{selectedOutfitInfo.name}</h4>
                        <p className="text-sm text-gray-500 mb-2">
                          {selectedOutfitInfo.category} · {selectedOutfitInfo.style}
                          {outfitImages.length > 1 && ` · ${outfitImages.length}件搭配`}
                        </p>
                        <div className="flex gap-2">
                          <button
                            onClick={() => {
                              setSelectedOutfitInfo(null);
                              setOutfitImages([]);
                              localStorage.removeItem('selectedOutfit');
                            }}
                            className="px-3 py-1.5 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            清除选择
                          </button>
                          <Link 
                            href="/outfit"
                            className="px-3 py-1.5 text-sm text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                          >
                            更换穿搭
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
                    <div className="w-16 h-16 rounded-full bg-primary-100 flex items-center justify-center mx-auto mb-4">
                      <svg className="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                      </svg>
                    </div>
                    <p className="text-gray-600 mb-4">还没有选择系统推荐穿搭</p>
                    <Link 
                      href="/outfit"
                      className="inline-flex items-center gap-2 px-6 py-3 bg-primary-600 text-white rounded-xl font-medium hover:bg-primary-700 transition-colors"
                    >
                      去穿搭库选择
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </Link>
                  </div>
                )}
              </div>
            )}

            {/* 自定义上传模式内容 */}
            {outfitMode === 'custom' && (
              <div className="space-y-4">
                {outfitImages.length > 0 ? (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {outfitImages.map((img, idx) => (
                      <div key={idx} className="space-y-2">
                        <div className="relative rounded-xl overflow-hidden group aspect-square">
                          <img 
                            src={img} 
                            alt={`服装${idx + 1}`} 
                            className="w-full h-full object-cover"
                          />
                          <button
                            onClick={() => {
                              setOutfitImages((prev) => prev.filter((_, i) => i !== idx));
                            }}
                            className="absolute inset-0 bg-gray-900/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                          >
                            <div className="w-8 h-8 rounded-full bg-red-500 flex items-center justify-center">
                              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            </div>
                          </button>
                        </div>
                      </div>
                    ))}
                    {outfitImages.length < 3 && (
                      <div
                        onClick={() => outfitInputRef.current?.click()}
                        className="aspect-square rounded-xl border-2 border-dashed border-gray-300 flex items-center justify-center bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer"
                      >
                        <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                      </div>
                    )}
                  </div>
                ) : (
                  <div
                    onClick={() => outfitInputRef.current?.click()}
                    onDragOver={(e) => { e.preventDefault(); setIsDraggingOutfit(true); }}
                    onDragLeave={() => setIsDraggingOutfit(false)}
                    onDrop={(e) => handleDrop(e, 'outfit')}
                    className={`drop-zone ${isDraggingOutfit ? 'drop-zone-active' : ''}`}
                  >
                    <div className="w-20 h-20 rounded-full bg-primary-50 flex items-center justify-center mx-auto mb-4">
                      <svg className="w-10 h-10 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                      </svg>
                    </div>
                    <p className="text-gray-800 font-medium mb-2">点击或拖拽上传服装照片</p>
                    <p className="text-gray-400 text-sm mb-4">支持 JPG, PNG, WEBP (最多3张)</p>
                    <div className="flex justify-center gap-2">
                      <span className="px-3 py-1 rounded-full bg-gray-100 text-xs text-gray-600 flex items-center gap-1">
                        <span>👕</span>
                        <span>上衣</span>
                      </span>
                      <span className="px-3 py-1 rounded-full bg-gray-100 text-xs text-gray-600 flex items-center gap-1">
                        <span>👖</span>
                        <span>下装</span>
                      </span>
                      <span className="px-3 py-1 rounded-full bg-gray-100 text-xs text-gray-600 flex items-center gap-1">
                        <span>🧥</span>
                        <span>外套</span>
                      </span>
                    </div>
                  </div>
                )}
              </div>
            )}
            <input
              ref={outfitInputRef}
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={handleOutfitUpload}
            />
          </div>
        </div>

        {/* Pose Selection */}
        <div className="card p-8 mb-8">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center shadow-md">
              <span className="font-bold text-white text-lg">3</span>
            </div>
            <div>
              <h3 className="font-heading text-xl font-bold text-gray-900">
                选择姿势
              </h3>
              <p className="text-gray-500 text-sm">从姿势库中选择您喜欢的姿势</p>
            </div>
          </div>

          <PoseGallery
            poses={poses}
            selectedPose={selectedPose}
            onSelect={(poseId, poseData) => {
              setSelectedPose(poseId);
              // 设置姿势描述：优先使用 description 字段，然后是 name
              let description = '正面站立';
              if (poseData?.type === 'custom' && poseData?.image === '') {
                // 这是文本描述的自定义姿势，优先使用 description（完整文本）
                description = poseData.description || poseData.name || '自定义姿势';
              } else if (poseData?.name) {
                // 这是预设姿势或图片自定义姿势
                description = poseData.name;
              }
              setPoseDescription(description);
              console.log('[Upload] 姿势已选择:', { poseId, description, poseData });
            }}
          />
        </div>

        {/* Style Options */}
        <div className="card p-8 mb-8">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center shadow-md">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
              </svg>
            </div>
            <div>
              <h3 className="font-heading text-xl font-bold text-gray-900">
                选择风格
              </h3>
              <p className="text-gray-500 text-sm">自定义您的转换风格</p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <StyleChips
              label="照片风格"
              options={styleOptions}
              selected={style}
              onSelect={setStyle}
            />
            <StyleChips
              label="光线类型"
              options={lightingOptions}
              selected={lighting}
              onSelect={setLighting}
            />
            <StyleChips
              label="背景环境"
              options={backgroundOptions}
              selected={background}
              onSelect={setBackground}
            />
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                生成数量
              </label>
              <div className="flex gap-2">
                {[1, 2, 4].map((count) => (
                  <button
                    key={count}
                    onClick={() => setGenerateCount(count)}
                    className={`flex-1 py-2 rounded-xl text-sm font-medium transition-all ${
                      generateCount === count
                        ? 'bg-primary-600 text-white shadow-md'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {count} 张
                  </button>
                ))}
              </div>
              <p className="text-xs text-gray-500 mt-2">
                批量生成将消耗 {generateCount} 张生成额度
              </p>
            </div>
          </div>
        </div>

        {/* Generate Button */}
        <div className="text-center">
          <button
            onClick={handleStartGenerate}
            disabled={!canGenerate}
            className={`px-12 py-5 rounded-2xl font-bold text-xl inline-flex items-center gap-2 transition-all shadow-md ${
              canGenerate
                ? 'bg-primary-600 text-white hover:bg-primary-700 hover:shadow-lg'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            <>
              开始生成
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </>
          </button>
          <p className="text-gray-500 text-sm mt-4">
            预计生成时间: {generateCount === 1 ? '15-30秒' : generateCount === 2 ? '30-60秒' : '60-120秒'} · 消耗 {generateCount} 张生成额度
          </p>
        </div>
      </div>
    </div>
  );
}

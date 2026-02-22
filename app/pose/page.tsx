"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { poses, categoryMapping, type Pose } from '@/lib/poses-data';

// 自定义姿势类型
interface CustomPose {
  id: string;
  name: string;
  description: string;
  image: string;
  category: string;
  type: 'custom';
  createdAt: number;
  useCount: number;
  isFavorite: boolean;
}

// 分类颜色映射
const categoryColors: Record<string, string> = {
  'standing': 'bg-primary-500',
  'sitting': 'bg-primary-600',
  'walking': 'bg-primary-400',
  'dynamic': 'bg-indigo-400',
  'leaning': 'bg-indigo-300'
};



type PoseCategory = '站姿' | '坐姿' | '行走' | '动态' | '倚靠';

export default function PosePage() {
  const [selectedPose, setSelectedPose] = useState<string>('正面站姿');
  const [selectedCategory, setSelectedCategory] = useState<PoseCategory | '全部'>('全部');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [customPose, setCustomPose] = useState<string>('');
  const [generatedPose, setGeneratedPose] = useState<string | null>(null);
  const [generatedPoseImage, setGeneratedPoseImage] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [storageMode, setStorageMode] = useState<'cloud' | 'local' | null>(null);
  const [storageMessage, setStorageMessage] = useState<string>('');
  
  // 我的自定义姿势管理
  const [customPoses, setCustomPoses] = useState<CustomPose[]>([]);
  const [isLoadingCustom, setIsLoadingCustom] = useState(false);
  const [editingPose, setEditingPose] = useState<CustomPose | null>(null);
  const [editName, setEditName] = useState('');
  const [isCustomPosesExpanded, setIsCustomPosesExpanded] = useState(false);
  
  // 收藏状态
  const [isFavoriting, setIsFavoriting] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [currentPoseId, setCurrentPoseId] = useState<string | null>(null);
  
  // 生成历史
  const [generationHistory, setGenerationHistory] = useState<CustomPose[]>([]);
  const [isHistoryExpanded, setIsHistoryExpanded] = useState(false);

  // 过滤姿势 - 使用共享数据
  const filteredPoses = poses.filter(pose => {
    // 分类过滤
    const categoryMatch = selectedCategory === '全部' || categoryMapping[pose.category] === selectedCategory;
    // 搜索过滤
    const searchMatch = !searchQuery || 
      pose.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pose.description?.toLowerCase().includes(searchQuery.toLowerCase());
    return categoryMatch && searchMatch;
  });

  const categories: (PoseCategory | '全部')[] = ['全部', '站姿', '坐姿', '行走', '动态', '倚靠'];

  // 加载自定义姿势和生成历史
  useEffect(() => {
    loadCustomPoses();
    loadGenerationHistory();
  }, []);
  
  // 加载生成历史
  const loadGenerationHistory = () => {
    try {
      const stored = localStorage.getItem('poseGenerationHistory');
      if (stored) {
        const parsed = JSON.parse(stored);
        // 只保留最近20条记录
        const recentHistory = parsed.slice(0, 20);
        setGenerationHistory(recentHistory);
      }
    } catch (err) {
      console.error('加载生成历史失败:', err);
    }
  };
  
  // 保存到生成历史
  const saveToHistory = (poseName: string, poseImage: string, poseDescription: string) => {
    try {
      const historyItem: CustomPose = {
        id: `history-${Date.now()}`,
        name: poseName.slice(0, 50),
        description: poseDescription,
        image: poseImage,
        category: 'custom',
        type: 'custom',
        createdAt: Date.now(),
        useCount: 0,
        isFavorite: false
      };
      
      const stored = localStorage.getItem('poseGenerationHistory');
      const existingHistory = stored ? JSON.parse(stored) : [];
      
      // 添加到开头，限制20条
      const updatedHistory = [historyItem, ...existingHistory].slice(0, 20);
      
      localStorage.setItem('poseGenerationHistory', JSON.stringify(updatedHistory));
      setGenerationHistory(updatedHistory);
    } catch (err) {
      console.error('保存生成历史失败:', err);
    }
  };

  const loadCustomPoses = () => {
    setIsLoadingCustom(true);
    try {
      // 从 localStorage 读取
      const stored = localStorage.getItem('customPoses');
      if (stored) {
        const parsed = JSON.parse(stored);
        // 去重：基于图片URL去重，保留最新的
        const uniquePoses = parsed.reduce((acc: CustomPose[], current: CustomPose) => {
          const exists = acc.find(p => p.image === current.image);
          if (!exists) {
            acc.push(current);
          }
          return acc;
        }, []);
        
        // 如果去重后有变化，更新 localStorage
        if (uniquePoses.length !== parsed.length) {
          localStorage.setItem('customPoses', JSON.stringify(uniquePoses));
        }
        
        setCustomPoses(uniquePoses);
      }
      
      // 尝试从 API 读取（如果用户已登录）
      fetchCustomPosesFromAPI();
    } catch (err) {
      console.error('加载自定义姿势失败:', err);
    } finally {
      setIsLoadingCustom(false);
    }
  };

  const fetchCustomPosesFromAPI = async () => {
    try {
      const response = await fetch('/api/poses/custom', {
        credentials: 'include'
      });
      if (response.ok) {
        const data = await response.json();
        if (data.status === 'success' && data.data.poses.length > 0) {
          // 合并 API 和 localStorage 的数据（去重）
          const apiPoses = data.data.poses.map((pose: any) => ({
            id: pose.id,
            name: pose.name,
            description: pose.description,
            image: pose.imageUrl,
            category: 'custom',
            type: 'custom' as const,
            createdAt: new Date(pose.createdAt).getTime(),
            useCount: pose.useCount || 0,
            isFavorite: pose.isFavorite || false
          }));
          
          setCustomPoses(prev => {
            const existingIds = new Set(prev.map(p => p.id));
            const newPoses = apiPoses.filter((p: CustomPose) => !existingIds.has(p.id));
            return [...newPoses, ...prev];
          });
        }
      }
    } catch (err) {
      // API 可能不可用，忽略错误
      console.log('API 加载失败，使用本地存储');
    }
  };

  // 删除自定义姿势
  const deleteCustomPose = async (poseId: string) => {
    if (!confirm('确定要删除这个姿势吗？')) return;
    
    try {
      // 立即更新React状态（从当前状态中移除）
      setCustomPoses(prev => {
        const newPoses = prev.filter(p => p.id !== poseId);
        // 同时更新 localStorage
        localStorage.setItem('customPoses', JSON.stringify(newPoses));
        return newPoses;
      });
      
      // 尝试从 API 删除
      try {
        await fetch(`/api/poses/custom?id=${poseId}`, {
          method: 'DELETE',
          credentials: 'include'
        });
      } catch (err) {
        console.log('API 删除失败，已本地删除');
      }
    } catch (err) {
      console.error('删除姿势失败:', err);
    }
  };

  // 重命名自定义姿势
  const renameCustomPose = async (poseId: string, newName: string) => {
    try {
      // 更新 localStorage
      const stored = localStorage.getItem('customPoses');
      if (stored) {
        const poses = JSON.parse(stored);
        const updated = poses.map((p: CustomPose) => 
          p.id === poseId ? { ...p, name: newName } : p
        );
        localStorage.setItem('customPoses', JSON.stringify(updated));
        setCustomPoses(updated);
      }
      
      // 尝试更新 API
      try {
        await fetch(`/api/poses/custom?id=${poseId}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({ name: newName })
        });
      } catch (err) {
        console.log('API 更新失败，已本地更新');
      }
      
      setEditingPose(null);
      setEditName('');
    } catch (err) {
      console.error('重命名姿势失败:', err);
    }
  };

  const onSelectPose = (poseName: string) => {
    setSelectedPose(poseName);
    setGeneratedPose(null);
    setGeneratedPoseImage(null);
    setError(null);
  };

  const onGeneratePose = async () => {
    if (!customPose.trim()) return;

    setIsGenerating(true);
    setError(null);
    setGeneratedPoseImage(null);

    try {
      const response = await fetch('/api/pose/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          description: customPose,
          style: '写实'
        })
      });

      const data = await response.json();

      if (data.status === 'success') {
        setGeneratedPoseImage(data.url);
        setGeneratedPose(customPose);
        // 生成临时ID，保存时会使用这个ID
        const tempId = saveToLocalStorage(customPose, data.url);
        // 将临时ID存储在状态中，以便保存时使用
        if (tempId) {
          (window as any).__tempPoseId = tempId;
        }
        // 重置收藏状态
        setIsFavorite(false);
        setCurrentPoseId(null);
        // 保存到生成历史
        saveToHistory(customPose, data.url, customPose);
      } else {
        setError(data.message || '姿势生成失败，请重试');
      }
    } catch (err) {
      setError('网络错误，请检查连接后重试');
      console.error('姿势生成 API 调用错误:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  // 保存到 localStorage
  const saveToLocalStorage = (description: string, imageUrl: string, poseId?: string) => {
    try {
      const customPoses = JSON.parse(localStorage.getItem('customPoses') || '[]');
      const newPose = {
        id: poseId || `custom-${Date.now()}`,  // 如果提供了ID就使用，否则生成新的
        name: description.slice(0, 30) + (description.length > 30 ? '...' : ''),
        description: description,
        image: imageUrl,
        category: 'custom',
        type: 'custom',
        createdAt: Date.now(),
        useCount: 0,
        isFavorite: false
      };
      customPoses.unshift(newPose);
      if (customPoses.length > 20) customPoses.pop();
      localStorage.setItem('customPoses', JSON.stringify(customPoses));
      return newPose.id;  // 返回ID以便后续使用
    } catch (err) {
      console.error('保存到本地存储失败:', err);
      return null;
    }
  };

  // 保存自定义姿势
  const onSaveCustomPose = async () => {
    if (!generatedPoseImage || !generatedPose) return;
    
    setIsSaving(true);
    setStorageMode(null);
    setStorageMessage('');
    
    try {
      const response = await fetch('/api/poses/custom', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          name: generatedPose.slice(0, 50),
          description: generatedPose,
          imageUrl: generatedPoseImage,
          source: 'TEXT'
        })
      });
      
      if (response.ok) {
        const data = await response.json();
        
        // 获取临时ID（生成时创建的）
        const tempId = (window as any).__tempPoseId;
        
        // 更新 localStorage 中的姿势，使用云端ID替换临时ID
        const customPoses = JSON.parse(localStorage.getItem('customPoses') || '[]');
        const updatedPoses = customPoses.map((pose: CustomPose) => {
          if (pose.id === tempId) {
            // 更新为云端ID和完整信息
            return {
              ...pose,
              id: data.data.id,  // 使用服务器返回的ID
              name: data.data.name,
              description: generatedPose,
            };
          }
          return pose;
        });
        
        // 如果没有找到临时ID（可能用户直接保存），则添加新姿势
        const poseExists = updatedPoses.some((p: CustomPose) => p.id === data.data.id);
        if (!poseExists) {
          updatedPoses.unshift({
            id: data.data.id,
            name: data.data.name,
            description: generatedPose || '',
            image: generatedPoseImage || '',
            category: 'custom',
            type: 'custom',
            createdAt: Date.now(),
            useCount: 0,
            isFavorite: false
          });
        }
        
        if (updatedPoses.length > 20) updatedPoses.pop();
        localStorage.setItem('customPoses', JSON.stringify(updatedPoses));
        
        // 清除临时ID
        delete (window as any).__tempPoseId;
        
        // 刷新显示
        setCustomPoses(updatedPoses);
        
        // 记录当前姿势ID用于收藏
        setCurrentPoseId(data.data.id);
        setIsFavorite(data.data.isFavorite || false);
        
        setStorageMode('cloud');
        setStorageMessage('✅ 已同步到云端（跨设备可用）');
        setSaveSuccess(true);
      } else {
        const errorData = await response.json().catch(() => ({}));
        setStorageMode('local');
        setStorageMessage(`⚠️ 云端同步失败，仅本地保存 ${errorData.message ? '- ' + errorData.message : ''}`);
        setSaveSuccess(true);
      }
    } catch (err) {
      setStorageMode('local');
      setStorageMessage('⚠️ 云端同步失败，仅本地保存（可稍后重试）');
      setSaveSuccess(true);
    } finally {
      setIsSaving(false);
      setTimeout(() => {
        setSaveSuccess(false);
        setStorageMode(null);
      }, 5000);
    }
  };

  // 切换收藏状态
  const onToggleFavorite = async () => {
    // 获取当前姿势ID（优先使用云端ID，其次是临时ID）
    const poseId = currentPoseId || (window as any).__tempPoseId;
    if (!poseId) {
      console.warn('没有可收藏的姿势ID');
      return;
    }
    
    setIsFavoriting(true);
    
    try {
      // 如果有云端ID，先尝试同步到云端
      if (currentPoseId) {
        const response = await fetch(`/api/poses/custom?id=${currentPoseId}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({
            isFavorite: !isFavorite
          })
        });
        
        if (response.ok) {
          const data = await response.json();
          setIsFavorite(data.pose.isFavorite);
          
          // 更新本地存储中的收藏状态
          const customPoses = JSON.parse(localStorage.getItem('customPoses') || '[]');
          const updatedPoses = customPoses.map((pose: CustomPose) => {
            if (pose.id === currentPoseId) {
              return { ...pose, isFavorite: data.pose.isFavorite };
            }
            return pose;
          });
          localStorage.setItem('customPoses', JSON.stringify(updatedPoses));
          setCustomPoses(updatedPoses);
        } else {
          console.error('云端收藏操作失败，仅更新本地状态');
          // 云端失败时，仍然更新本地状态
          toggleLocalFavorite(poseId);
        }
      } else {
        // 只有本地ID，仅更新本地状态
        toggleLocalFavorite(poseId);
      }
    } catch (err) {
      console.error('收藏操作失败:', err);
      // 出错时，仍然尝试更新本地状态
      toggleLocalFavorite(poseId);
    } finally {
      setIsFavoriting(false);
    }
  };
  
  // 本地收藏状态切换
  const toggleLocalFavorite = (poseId: string) => {
    const newFavoriteState = !isFavorite;
    setIsFavorite(newFavoriteState);
    
    // 更新本地存储中的收藏状态
    const customPoses = JSON.parse(localStorage.getItem('customPoses') || '[]');
    const updatedPoses = customPoses.map((pose: CustomPose) => {
      if (pose.id === poseId) {
        return { ...pose, isFavorite: newFavoriteState };
      }
      return pose;
    });
    localStorage.setItem('customPoses', JSON.stringify(updatedPoses));
    setCustomPoses(updatedPoses);
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-24 px-6 pb-12">
      <div className="max-w-6xl mx-auto">
        
        {/* Header - 与 upload 页面一致 */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="font-heading text-4xl md:text-5xl font-bold text-gray-900">
            姿势库
          </h1>
        </div>

        {/* 预设姿势库 Section */}
        <div className="card p-8 mb-8">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center shadow-md">
              <span className="font-bold text-white text-lg">1</span>
            </div>
            <div>
              <h3 className="font-heading text-xl font-bold text-gray-900">
                预设姿势库
              </h3>
              <p className="text-gray-500 text-sm">选择系统预设的经典姿势</p>
            </div>
          </div>
          
          {/* 搜索和筛选 */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            {/* 搜索框 */}
            <div className="relative flex-1">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="搜索姿势..."
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
            
            {/* 分类筛选 */}
            <div className="flex flex-wrap gap-2">
              {categories.map(category => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                    selectedCategory === category
                      ? 'bg-primary-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
          
          {/* 搜索结果提示 */}
          {searchQuery && (
            <div className="mb-4 text-sm text-gray-600">
              搜索 "{searchQuery}" 找到 {filteredPoses.length} 个姿势
              {filteredPoses.length === 0 && (
                <span className="text-gray-500 ml-2">- 试试其他关键词？</span>
              )}
            </div>
          )}

          {/* 姿势网格 */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredPoses.map((pose) => (
              <div
                key={pose.id}
                onClick={() => onSelectPose(pose.name)}
                className={`group relative rounded-xl overflow-hidden border-2 transition-all duration-200 cursor-pointer ${
                  selectedPose === pose.name
                    ? 'border-primary-500 shadow-lg'
                    : 'border-gray-100 hover:border-primary-300 hover:shadow-md'
                }`}
              >
                {/* 姿势图片 - 矩形展示 */}
                <div className="relative aspect-[3/4] overflow-hidden bg-gray-100">
                  <img 
                    src={pose.image} 
                    alt={pose.name}
                    className={`w-full h-full object-cover transition-transform duration-300 ${
                      selectedPose === pose.name ? 'scale-105' : 'group-hover:scale-105'
                    }`}
                    onError={(e) => {
                      // 图片加载失败时显示图标
                      const parent = (e.target as HTMLImageElement).parentElement;
                      if (parent) {
                        parent.classList.add(categoryColors[pose.category] || 'bg-primary-500', 'flex', 'items-center', 'justify-center', 'text-white', 'text-4xl');
                        parent.innerHTML = pose.icon || '🧍‍♀️';
                      }
                    }}
                  />
                  
                  {/* 选中状态指示器 */}
                  {selectedPose === pose.name && (
                    <div className="absolute top-2 left-2 w-6 h-6 bg-primary-500 rounded-full flex items-center justify-center shadow-md">
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  )}
                  
                  {/* 悬停时显示使用按钮 */}
                  <div className={`absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent flex items-end justify-center pb-4 transition-opacity duration-200 ${
                    selectedPose === pose.name ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                  }`}>
                    <Link
                      href={`/upload?pose=${encodeURIComponent(pose.name)}&poseId=${encodeURIComponent(pose.id)}&poseType=preset`}
                      className="px-4 py-2 bg-white text-primary-700 text-sm font-semibold rounded-full shadow-lg hover:bg-primary-50 transition-colors"
                      onClick={(e) => e.stopPropagation()}
                    >
                      使用此姿势
                    </Link>
                  </div>
                </div>
                
                {/* 姿势信息 */}
                <div className="p-3 text-center bg-white">
                  <div className={`font-semibold mb-0.5 ${selectedPose === pose.name ? 'text-primary-700' : 'text-gray-900'}`}>
                    {pose.name}
                  </div>
                  <div className="text-xs text-gray-500">{categoryMapping[pose.category]}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 文本描述生成 Section */}
        <div className="card p-8 mb-8">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary-400 to-primary-500 flex items-center justify-center shadow-md">
              <span className="font-bold text-white text-lg">2</span>
            </div>
            <div>
              <h3 className="font-heading text-xl font-bold text-gray-900">
                文本描述生成
              </h3>
              <p className="text-gray-500 text-sm">输入自然语言描述，AI 生成对应姿势</p>
            </div>
          </div>

          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
              <strong>⚠️ {error}</strong>
            </div>
          )}

          <textarea
            value={customPose}
            onChange={(e) => setCustomPose(e.target.value)}
            placeholder="例如：双手叉腰，微微侧身，抬头看向前方，表情自然放松"
            className="w-full p-4 border border-gray-200 rounded-xl bg-gray-50 text-gray-900 placeholder-gray-400 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none resize-y min-h-[120px] mb-4"
          />

          <button
            onClick={onGeneratePose}
            disabled={!customPose.trim() || isGenerating}
            className={`px-6 py-3 rounded-xl font-semibold text-white transition-all duration-200 ${
              !customPose.trim() || isGenerating
                ? 'bg-gray-300 cursor-not-allowed'
                : 'bg-primary-600 hover:bg-primary-700 shadow-md hover:shadow-lg'
            }`}
          >
            {isGenerating ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                生成中...
              </span>
            ) : '生成姿势'}
          </button>

          {/* 生成结果 */}
          {generatedPoseImage && (
            <div className="mt-8 pt-8 border-t border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                  <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                  AI 生成的姿势
                </h4>
                <button
                  onClick={onGeneratePose}
                  disabled={isGenerating}
                  className="text-sm text-gray-500 hover:text-primary-600 flex items-center gap-1 transition-colors"
                >
                  <svg className={`w-4 h-4 ${isGenerating ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  重新生成
                </button>
              </div>
              
              {/* 大图展示 */}
              <div className="relative rounded-2xl overflow-hidden shadow-lg bg-gray-100 mb-6">
                <img
                  src={generatedPoseImage}
                  alt="AI 生成的姿势"
                  className="w-full max-w-2xl mx-auto"
                />
                
                {/* 图片描述 */}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-6">
                  <p className="text-white text-sm line-clamp-2">{generatedPose}</p>
                </div>
              </div>
              
              {/* 操作按钮 */}
              <div className="flex flex-wrap gap-3">
                <Link
                  href={`/upload?pose=${encodeURIComponent(generatedPose || '')}&poseUrl=${encodeURIComponent(generatedPoseImage || '')}&poseType=custom`}
                  className="flex-1 sm:flex-none px-6 py-3 bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-xl font-semibold hover:from-primary-700 hover:to-primary-800 transition-all inline-flex items-center justify-center gap-2 shadow-md"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  立即使用此姿势
                </Link>
                
                <button
                  onClick={onSaveCustomPose}
                  disabled={isSaving}
                  className="flex-1 sm:flex-none px-6 py-3 bg-white border-2 border-gray-200 text-gray-700 rounded-xl font-semibold hover:border-green-500 hover:text-green-600 transition-all disabled:opacity-70 inline-flex items-center justify-center gap-2"
                >
                  {isSaving ? (
                    <>
                      <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      同步中...
                    </>
                  ) : saveSuccess ? (
                    <>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      已同步
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                      </svg>
                      同步到云端
                    </>
                  )}
                </button>
                
                {/* 收藏按钮 */}
                <button
                  onClick={onToggleFavorite}
                  disabled={isFavoriting}
                  className={`flex-1 sm:flex-none px-6 py-3 rounded-xl font-semibold transition-all disabled:opacity-70 inline-flex items-center justify-center gap-2 ${
                    isFavorite
                      ? 'bg-red-50 border-2 border-red-200 text-red-600 hover:bg-red-100'
                      : 'bg-white border-2 border-gray-200 text-gray-700 hover:border-red-300 hover:text-red-500'
                  }`}
                  title={isFavorite ? '取消收藏' : '收藏此姿势'}
                >
                  {isFavoriting ? (
                    <>
                      <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      处理中...
                    </>
                  ) : isFavorite ? (
                    <>
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                      </svg>
                      已收藏
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                      </svg>
                      收藏
                    </>
                  )}
                </button>
              </div>
              
              {/* 存储状态提示 */}
              {saveSuccess && (
                <div className="mt-4">
                  <div className={`p-4 rounded-xl border flex items-start gap-3 ${
                    storageMode === 'cloud' 
                      ? 'bg-green-50 border-green-200' 
                      : 'bg-yellow-50 border-yellow-200'
                  }`}>
                    <span className="text-2xl">{storageMode === 'cloud' ? '☁️' : '💾'}</span>
                    <div>
                      <p className={`font-semibold ${
                        storageMode === 'cloud' ? 'text-green-800' : 'text-yellow-800'
                      }`}>
                        {storageMode === 'cloud' ? '云端存储模式' : '本地存储模式'}
                      </p>
                      <p className={`text-sm mt-1 ${
                        storageMode === 'cloud' ? 'text-green-700' : 'text-yellow-700'
                      }`}>
                        {storageMessage}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* 生成历史 - 可折叠 */}
          {generationHistory.length > 0 && (
            <div className="mt-8 pt-8 border-t border-gray-200">
              <div
                onClick={() => setIsHistoryExpanded(!isHistoryExpanded)}
                className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 rounded-xl transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <h4 className="font-semibold text-gray-900">生成历史</h4>
                  <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs font-medium rounded-full">
                    {generationHistory.length}
                  </span>
                </div>
                <svg 
                  className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${isHistoryExpanded ? 'rotate-180' : ''}`} 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
              
              {/* 折叠内容 */}
              <div className={`transition-all duration-300 ${isHistoryExpanded ? 'max-h-[2000px] opacity-100 mt-4' : 'max-h-0 opacity-0 overflow-hidden'}`}>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                  {generationHistory.map((pose) => (
                    <Link
                      key={pose.id}
                      href={`/upload?pose=${encodeURIComponent(pose.description || pose.name)}&poseUrl=${encodeURIComponent(pose.image)}&poseType=custom`}
                      className="group relative rounded-xl overflow-hidden border-2 border-gray-100 bg-white hover:border-blue-300 hover:shadow-md transition-all duration-200 cursor-pointer"
                    >
                      {/* 姿势图片 */}
                      <div className="relative aspect-[3/4] overflow-hidden bg-gray-100">
                        <img
                          src={pose.image}
                          alt={pose.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        
                        {/* 悬停遮罩 */}
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <span className="text-white text-sm font-medium">点击使用</span>
                        </div>
                      </div>

                      {/* 姿势信息 */}
                      <div className="p-3 text-center bg-white">
                        <p className="text-sm text-gray-600 line-clamp-1">{pose.name}</p>
                        <p className="text-xs text-gray-400 mt-1">
                          {new Date(pose.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* 我的自定义姿势列表 - 可折叠 */}
          {customPoses.length > 0 && (
            <div className="mt-8 pt-8 border-t border-gray-200">
              <div
                onClick={() => setIsCustomPosesExpanded(!isCustomPosesExpanded)}
                className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 rounded-xl transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <h4 className="font-semibold text-gray-900">我的自定义姿势</h4>
                  <span className="px-2 py-0.5 bg-primary-100 text-primary-700 text-xs font-medium rounded-full">
                    {customPoses.length}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      loadCustomPoses();
                    }}
                    className="p-1.5 text-gray-400 hover:text-primary-600 rounded-lg transition-colors"
                    disabled={isLoadingCustom}
                    title="刷新"
                  >
                    <svg className={`w-4 h-4 ${isLoadingCustom ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                  </button>
                  <svg 
                    className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${isCustomPosesExpanded ? 'rotate-180' : ''}`} 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
              
              {/* 折叠内容 */}
              <div className={`transition-all duration-300 ${isCustomPosesExpanded ? 'max-h-[2000px] opacity-100 mt-4' : 'max-h-0 opacity-0 overflow-hidden'}`}>
              
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                {customPoses.map((pose) => (
                  <div
                    key={pose.id}
                    className="group relative rounded-xl overflow-hidden border-2 border-gray-100 bg-white hover:border-primary-300 hover:shadow-md transition-all duration-200 cursor-pointer"
                  >
                    {/* 姿势图片 - 与预设姿势一致 */}
                    <div className="relative aspect-[3/4] overflow-hidden bg-gray-100">
                      <img
                        src={pose.image}
                        alt={pose.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      
                      {/* 收藏标识 */}
                      {pose.isFavorite && (
                        <div className="absolute top-2 right-2 w-8 h-8 bg-red-500 rounded-full flex items-center justify-center shadow-lg">
                          <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                          </svg>
                        </div>
                      )}
                      
                      {/* 操作按钮 - 悬停显示在底部 */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center pb-4">
                        <div className="flex gap-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setEditingPose(pose);
                              setEditName(pose.name);
                            }}
                            className="w-9 h-9 flex items-center justify-center bg-white rounded-full hover:bg-gray-100 transition-colors shadow-lg"
                            title="重命名"
                          >
                            <svg className="w-4 h-4 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteCustomPose(pose.id);
                            }}
                            className="w-9 h-9 flex items-center justify-center bg-white rounded-full hover:bg-red-50 transition-colors shadow-lg"
                            title="删除"
                          >
                            <svg className="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                          <Link
                            href={`/upload?pose=${encodeURIComponent(pose.name)}&poseId=${encodeURIComponent(pose.id)}&poseType=custom&poseImage=${encodeURIComponent(pose.image)}`}
                            className="px-4 py-2 bg-white text-primary-700 text-sm font-semibold rounded-full hover:bg-primary-50 transition-colors shadow-lg"
                            onClick={(e) => e.stopPropagation()}
                          >
                            使用
                          </Link>
                        </div>
                      </div>
                    </div>

                    {/* 姿势信息 */}
                    <div className="p-3 text-center bg-white">
                      {editingPose?.id === pose.id ? (
                        <div className="flex gap-1">
                          <input
                            type="text"
                            value={editName}
                            onChange={(e) => setEditName(e.target.value)}
                            className="flex-1 px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary-500"
                            autoFocus
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                renameCustomPose(pose.id, editName);
                              } else if (e.key === 'Escape') {
                                setEditingPose(null);
                                setEditName('');
                              }
                            }}
                            onClick={(e) => e.stopPropagation()}
                          />
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              renameCustomPose(pose.id, editName);
                            }}
                            className="px-2 py-1 bg-primary-600 text-white text-xs rounded hover:bg-primary-700"
                          >
                            保存
                          </button>
                        </div>
                      ) : (
                        <>
                          <h3 className="font-semibold text-gray-900 mb-0.5 truncate" title={pose.name}>
                            {pose.name}
                          </h3>
                          <div className="text-xs text-gray-500">自定义</div>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

"use client";

import React, { useState, useEffect } from 'react';

interface Pose {
  id: string;
  name: string;
  image: string;
  category: string;
  type?: 'preset' | 'custom';
  createdAt?: number;
  description?: string;
  tags?: string[];
  difficulty?: 'easy' | 'medium' | 'hard';
}

interface PoseGalleryProps {
  poses: Pose[];
  selectedPose: string | null;
  onSelect: (poseId: string, poseData?: any) => void;
  showCustomTab?: boolean;
}

const categories = [
  { id: 'all', label: '全部' },
  { id: 'custom', label: '我的自定义' },
  { id: 'standing', label: '站姿' },
  { id: 'sitting', label: '坐姿' },
  { id: 'walking', label: '行走' },
  { id: 'dynamic', label: '动态' },
  { id: 'leaning', label: '倚靠' },
];

export default function PoseGallery({
  poses,
  selectedPose,
  onSelect,
  showCustomTab = true,
}: PoseGalleryProps) {
  const [activeCategory, setActiveCategory] = useState('all');
  const [customPoses, setCustomPoses] = useState<Pose[]>([]);
  const [isLoadingCustom, setIsLoadingCustom] = useState(false);

  // 加载自定义姿势
  useEffect(() => {
    if (showCustomTab) {
      loadCustomPoses();
    }
  }, [showCustomTab]);

  const loadCustomPoses = () => {
    setIsLoadingCustom(true);
    try {
      // 从 localStorage 读取
      const stored = localStorage.getItem('customPoses');
      if (stored) {
        const parsed = JSON.parse(stored);
        setCustomPoses(parsed);
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
            image: pose.imageUrl,
            category: 'custom',
            type: 'custom' as const,
            createdAt: new Date(pose.createdAt).getTime(),
          }));
          
          setCustomPoses(prev => {
            const existingIds = new Set(prev.map(p => p.id));
            const newPoses = apiPoses.filter((p: Pose) => !existingIds.has(p.id));
            return [...newPoses, ...prev];
          });
        }
      }
    } catch (err) {
      // API 可能不可用，忽略错误
      console.log('API 加载失败，使用本地存储');
    }
  };

  // 合并预设姿势和自定义姿势
  const allPoses = [...customPoses, ...poses];

  const filteredPoses =
    activeCategory === 'all'
      ? allPoses
      : activeCategory === 'custom'
      ? customPoses
      : poses.filter((pose) => pose.category === activeCategory);

  const handleSelect = (pose: Pose) => {
    onSelect(pose.id, {
      ...pose,
      type: pose.type || 'preset',
    });
  };

  return (
    <div className="space-y-6">
      {/* Category Filter */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => setActiveCategory(category.id)}
            className={`px-5 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
              activeCategory === category.id
                ? 'bg-primary-600 text-white shadow-md'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {category.label}
            {category.id === 'custom' && customPoses.length > 0 && (
              <span className="ml-1 text-xs bg-primary-500 text-white px-1.5 py-0.5 rounded-full">
                {customPoses.length}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Loading State */}
      {activeCategory === 'custom' && isLoadingCustom && (
        <div className="text-center py-8 text-gray-500">
          <div className="inline-block animate-spin rounded-full h-6 w-6 border-2 border-primary-600 border-t-transparent mb-2"></div>
          <p>加载自定义姿势...</p>
        </div>
      )}

      {/* Empty State for Custom */}
      {activeCategory === 'custom' && !isLoadingCustom && customPoses.length === 0 && (
        <div className="text-center py-8 bg-gray-50 rounded-2xl">
          <div className="text-4xl mb-3">🎨</div>
          <p className="text-gray-600 mb-2">还没有自定义姿势</p>
          <p className="text-sm text-gray-500 mb-4">
            前往 <a href="/pose" className="text-primary-600 hover:underline">姿势库页面</a> 创建您的第一个自定义姿势
          </p>
        </div>
      )}

      {/* Pose Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {filteredPoses.map((pose) => {
          const isSelected = selectedPose === pose.id;
          const isCustom = pose.type === 'custom' || pose.category === 'custom';

          return (
            <div
              key={pose.id}
              onClick={() => handleSelect(pose)}
              className={`group relative rounded-xl overflow-hidden border-2 transition-all duration-200 cursor-pointer ${
                isSelected
                  ? 'border-primary-500 shadow-lg'
                  : 'border-gray-100 hover:border-primary-300 hover:shadow-md'
              }`}
            >
              {/* 图片区域 */}
              <div className="aspect-[3/4] relative bg-gray-100 overflow-hidden">
                <img
                  src={pose.image}
                  alt={pose.name}
                  className={`w-full h-full object-cover transition-transform duration-300 ${
                    isSelected ? 'scale-105' : 'group-hover:scale-105'
                  }`}
                  onError={(e) => {
                    // 图片加载失败时显示占位符
                    (e.target as HTMLImageElement).src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="200" height="300" viewBox="0 0 200 300"%3E%3Crect width="200" height="300" fill="%23f3f4f6"/%3E%3Ctext x="50%25" y="50%25" font-family="Arial" font-size="14" fill="%239ca3af" text-anchor="middle" dy=".3em"%3E姿势示意图%3C/text%3E%3C/svg%3E';
                  }}
                />
                
                {/* 底部渐变遮罩 */}
                <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/60 to-transparent" />

                {/* 选中状态指示器 */}
                {isSelected && (
                  <div className="absolute top-2 left-2 w-6 h-6 bg-primary-500 rounded-full flex items-center justify-center shadow-md">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                )}

              </div>

              {/* 信息区域 */}
              <div className="p-3 bg-white">
                {/* 姿势名称 - 独占一行 */}
                <h3
                  className={`font-semibold text-sm mb-1 truncate ${
                    isSelected ? 'text-primary-700' : 'text-gray-900'
                  }`}
                  title={pose.name}
                >
                  {pose.name}
                </h3>
                
                {/* 特征标签 */}
                {pose.tags && pose.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-1.5">
                    {pose.tags.slice(0, 2).map((tag, idx) => (
                      <span key={idx} className="px-1.5 py-0.5 bg-gray-100 text-gray-500 text-[10px] rounded">
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
                
                {/* 自定义标签 - 精致胶囊样式 */}
                {isCustom && (
                  <div className="inline-flex items-center gap-1 px-2 py-0.5 bg-primary-50 border border-primary-200 rounded-full">
                    <svg className="w-3 h-3 text-primary-600" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                    </svg>
                    <span className="text-[10px] font-medium text-primary-700">自定义</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Custom Description Input */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          或用文字描述您想要的姿势
        </label>
        <input
          type="text"
          placeholder="例如：双手插兜站立，侧身看向镜头..."
          className="input"
          onChange={(e) => {
            const value = e.target.value.trim();
            // 实时更新姿势描述，不需要确认
            const tempPose: Pose & { description?: string } = {
              id: `text-pose`,
              name: value.slice(0, 30) || '自定义姿势',
              description: value, // 存储完整描述
              image: '', // 空图片表示文本描述
              category: 'custom',
              type: 'custom',
            };
            onSelect(tempPose.id, tempPose);
          }}
        />
        <p className="text-xs text-gray-500 mt-1">
          输入即生效，无需确认
        </p>
      </div>

      {/* Refresh Button for Custom */}
      {activeCategory === 'custom' && (
        <button
          onClick={loadCustomPoses}
          className="text-sm text-primary-600 hover:text-primary-700 flex items-center gap-1"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          刷新列表
        </button>
      )}
    </div>
  );
}

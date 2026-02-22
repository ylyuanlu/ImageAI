"use client";

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';

// 时尚潮流穿搭库 - 提供穿搭方案用于AI换装
// 支持单件穿搭和组合穿搭，未来可扩展为多图组合
// 图片使用Unsplash服装相关图片，后续可替换为真实服装平铺图
const outfitLibrary = [
  // 夏季清爽穿搭
  { 
    id: 'summer-1', 
    name: '清爽白T配牛仔', 
    category: '夏季', 
    style: '休闲', 
    image: 'https://images.unsplash.com/photo-1581655353564-df123a1eb820?w=300&h=400&fit=crop', 
    tags: ['清爽', '日常', '百搭'], 
    popularity: 95,
    type: 'combo',
    description: '白色基础T恤搭配蓝色牛仔裤，简约清爽的日常穿搭',
    items: [
      { type: 'top', name: '白色基础T恤', image: 'https://images.unsplash.com/photo-1581655353564-df123a1eb820?w=300&h=400&fit=crop' },
      { type: 'bottom', name: '蓝色牛仔裤', image: 'https://images.unsplash.com/photo-1542272454315-4c01d7abdf4a?w=300&h=400&fit=crop' }
    ]
  },
  { 
    id: 'summer-2', 
    name: '碎花连衣裙', 
    category: '夏季', 
    style: '甜美', 
    image: 'https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=300&h=400&fit=crop', 
    tags: ['优雅', '约会', '夏日'], 
    popularity: 88,
    type: 'single',
    description: '清新碎花连衣裙，适合约会和夏日出行',
    items: [
      { type: 'fullbody', name: '碎花连衣裙', image: 'https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=300&h=400&fit=crop' }
    ]
  },
  { 
    id: 'summer-3', 
    name: '吊带背心配短裤', 
    category: '夏季', 
    style: '性感', 
    image: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=300&h=400&fit=crop', 
    tags: ['夏日', '清凉', '时尚'], 
    popularity: 85,
    type: 'combo',
    description: '黑色吊带背心搭配短裤，清凉时尚的夏日选择',
    items: [
      { type: 'top', name: '黑色吊带背心', image: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=300&h=400&fit=crop' },
      { type: 'bottom', name: '牛仔短裤', image: 'https://images.unsplash.com/photo-1591195853828-11db59a44f6b?w=300&h=400&fit=crop' }
    ]
  },
  { 
    id: 'summer-4', 
    name: '露肩上衣配半裙', 
    category: '夏季', 
    style: '优雅', 
    image: 'https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=300&h=400&fit=crop', 
    tags: ['约会', '聚会', '女性化'], 
    popularity: 87,
    type: 'combo',
    description: '露肩上衣搭配碎花半身裙，优雅女性化',
    items: [
      { type: 'top', name: '露肩上衣', image: 'https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=300&h=400&fit=crop' },
      { type: 'bottom', name: '碎花半身裙', image: 'https://images.unsplash.com/photo-1583496661160-fb5886a0ujf?w=300&h=400&fit=crop' }
    ]
  },
  
  // 冬季保暖穿搭
  { 
    id: 'winter-1', 
    name: '毛衣配牛仔裤', 
    category: '冬季', 
    style: '温柔', 
    image: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=300&h=400&fit=crop', 
    tags: ['保暖', '舒适', '日常'], 
    popularity: 91,
    type: 'combo',
    description: '温暖针织毛衣搭配经典牛仔裤，秋冬日常首选',
    items: [
      { type: 'top', name: '针织毛衣', image: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=300&h=400&fit=crop' },
      { type: 'bottom', name: '蓝色牛仔裤', image: 'https://images.unsplash.com/photo-1542272454315-4c01d7abdf4a?w=300&h=400&fit=crop' }
    ]
  },
  { 
    id: 'winter-2', 
    name: '毛呢大衣套装', 
    category: '冬季', 
    style: '优雅', 
    image: 'https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=300&h=400&fit=crop', 
    tags: ['保暖', '高端', '职场'], 
    popularity: 93,
    type: 'combo',
    description: '优雅毛呢大衣，冬季职场保暖首选',
    items: [
      { type: 'outerwear', name: '毛呢大衣', image: 'https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=300&h=400&fit=crop' },
      { type: 'fullbody', name: '内搭连衣裙', image: 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=300&h=400&fit=crop' }
    ]
  },
  { 
    id: 'winter-3', 
    name: '羽绒服休闲装', 
    category: '冬季', 
    style: '休闲', 
    image: 'https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=300&h=400&fit=crop', 
    tags: ['保暖', '日常', '舒适'], 
    popularity: 88,
    type: 'combo',
    description: '保暖羽绒服搭配休闲裤，冬日舒适穿搭',
    items: [
      { type: 'outerwear', name: '羽绒服', image: 'https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=300&h=400&fit=crop' },
      { type: 'bottom', name: '休闲裤', image: 'https://images.unsplash.com/photo-1552902865-b72c031ac5ea?w=300&h=400&fit=crop' }
    ]
  },
  
  // 职场商务穿搭
  { 
    id: 'formal-1', 
    name: '西装套装', 
    category: '职场', 
    style: '商务', 
    image: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=300&h=400&fit=crop', 
    tags: ['职场', '正式', '会议'], 
    popularity: 92,
    type: 'combo',
    description: '经典西装外套搭配西裤，职场正式场合首选',
    items: [
      { type: 'outerwear', name: '西装外套', image: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=300&h=400&fit=crop' },
      { type: 'bottom', name: '西裤', image: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=300&h=400&fit=crop' }
    ]
  },
  { 
    id: 'formal-2', 
    name: '衬衫配西裤', 
    category: '职场', 
    style: '干练', 
    image: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=300&h=400&fit=crop', 
    tags: ['职场', '通勤', '经典'], 
    popularity: 89,
    type: 'combo',
    description: '条纹衬衫搭配西裤，干练职场风',
    items: [
      { type: 'top', name: '条纹衬衫', image: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=300&h=400&fit=crop' },
      { type: 'bottom', name: '西裤', image: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=300&h=400&fit=crop' }
    ]
  },
  
  // 休闲街头穿搭
  { 
    id: 'casual-1', 
    name: '卫衣牛仔裤', 
    category: '休闲', 
    style: '街头', 
    image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=300&h=400&fit=crop', 
    tags: ['舒适', '日常', '潮流'], 
    popularity: 93,
    type: 'combo',
    description: 'oversize卫衣搭配牛仔裤，街头潮流风',
    items: [
      { type: 'top', name: 'oversize卫衣', image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=300&h=400&fit=crop' },
      { type: 'bottom', name: '蓝色牛仔裤', image: 'https://images.unsplash.com/photo-1542272454315-4c01d7abdf4a?w=300&h=400&fit=crop' }
    ]
  },
  { 
    id: 'casual-2', 
    name: '牛仔外套配T恤', 
    category: '休闲', 
    style: '经典', 
    image: 'https://images.unsplash.com/photo-1523205771623-e0faa4d2813d?w=300&h=400&fit=crop', 
    tags: ['百搭', '四季', '经典'], 
    popularity: 90,
    type: 'combo',
    description: '经典牛仔外套搭配白T，百搭不出错',
    items: [
      { type: 'outerwear', name: '牛仔外套', image: 'https://images.unsplash.com/photo-1523205771623-e0faa4d2813d?w=300&h=400&fit=crop' },
      { type: 'top', name: '白色基础T恤', image: 'https://images.unsplash.com/photo-1581655353564-df123a1eb820?w=300&h=400&fit=crop' },
      { type: 'bottom', name: '蓝色牛仔裤', image: 'https://images.unsplash.com/photo-1542272454315-4c01d7abdf4a?w=300&h=400&fit=crop' }
    ]
  },
  
  // 运动健身穿搭
  { 
    id: 'sport-1', 
    name: '运动背心套装', 
    category: '运动', 
    style: '活力', 
    image: 'https://images.unsplash.com/photo-1518310383802-640c2de311b2?w=300&h=400&fit=crop', 
    tags: ['健身', '透气', '活力'], 
    popularity: 86,
    type: 'combo',
    description: '运动背心搭配瑜伽裤，健身运动首选',
    items: [
      { type: 'top', name: '运动背心', image: 'https://images.unsplash.com/photo-1518310383802-640c2de311b2?w=300&h=400&fit=crop' },
      { type: 'bottom', name: '瑜伽裤', image: 'https://images.unsplash.com/photo-1506629082955-511b1aa562c8?w=300&h=400&fit=crop' }
    ]
  },
  { 
    id: 'sport-2', 
    name: '运动套装', 
    category: '运动', 
    style: '专业', 
    image: 'https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=300&h=400&fit=crop', 
    tags: ['跑步', '速干', '专业'], 
    popularity: 84,
    type: 'combo',
    description: '专业运动套装，速干透气适合跑步',
    items: [
      { type: 'top', name: '运动T恤', image: 'https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=300&h=400&fit=crop' },
      { type: 'bottom', name: '运动短裤', image: 'https://images.unsplash.com/photo-1562183241-b937e95585b6?w=300&h=400&fit=crop' }
    ]
  },
  
  // 优雅约会穿搭
  { 
    id: 'date-1', 
    name: '小黑裙', 
    category: '约会', 
    style: '优雅', 
    image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=300&h=400&fit=crop', 
    tags: ['经典', '百搭', '约会'], 
    popularity: 93,
    type: 'single',
    description: '经典小黑裙，约会必备单品',
    items: [
      { type: 'fullbody', name: '小黑裙', image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=300&h=400&fit=crop' }
    ]
  },
  { 
    id: 'date-2', 
    name: '风衣配裙', 
    category: '约会', 
    style: '知性', 
    image: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=300&h=400&fit=crop', 
    tags: ['优雅', '通勤', '知性'], 
    popularity: 88,
    type: 'combo',
    description: '优雅风衣搭配连衣裙，知性约会风',
    items: [
      { type: 'outerwear', name: '风衣', image: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=300&h=400&fit=crop' },
      { type: 'fullbody', name: '连衣裙', image: 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=300&h=400&fit=crop' }
    ]
  },
  
  // 派对晚宴穿搭
  { 
    id: 'party-1', 
    name: '礼服裙', 
    category: '派对', 
    style: '高贵', 
    image: 'https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=300&h=400&fit=crop', 
    tags: ['晚宴', '派对', '高贵'], 
    popularity: 85,
    type: 'single',
    description: '高贵礼服裙，晚宴派对焦点',
    items: [
      { type: 'fullbody', name: '礼服裙', image: 'https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=300&h=400&fit=crop' }
    ]
  },
  { 
    id: 'party-2', 
    name: '皮夹克配裙', 
    category: '派对', 
    style: '酷帅', 
    image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=300&h=400&fit=crop', 
    tags: ['个性', '街头', '酷帅'], 
    popularity: 82,
    type: 'combo',
    description: '酷帅皮夹克搭配连衣裙，个性派对风',
    items: [
      { type: 'outerwear', name: '皮夹克', image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=300&h=400&fit=crop' },
      { type: 'fullbody', name: '连衣裙', image: 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=300&h=400&fit=crop' }
    ]
  },
];



type OutfitCategory = '全部' | '夏季' | '冬季' | '职场' | '休闲' | '运动' | '约会' | '派对';
type SortOption = 'default' | 'popularity' | 'newest';

export default function OutfitPage() {
  const [selectedCategory, setSelectedCategory] = useState<OutfitCategory>('全部');
  const [selectedOutfit, setSelectedOutfit] = useState<string | null>(null);
  const [uploadedOutfits, setUploadedOutfits] = useState<string[]>([]);
  const [selectedUploadedIndices, setSelectedUploadedIndices] = useState<number[]>([]);
  const [activeTab, setActiveTab] = useState<'library' | 'upload'>('library');
  const [sortBy, setSortBy] = useState<SortOption>('default');
  const [searchQuery, setSearchQuery] = useState('');
  const [showRecommendations, setShowRecommendations] = useState(true);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 页面加载时从localStorage读取已上传的服装
  useEffect(() => {
    const savedOutfits = localStorage.getItem('uploadedOutfits');
    if (savedOutfits) {
      try {
        const parsed = JSON.parse(savedOutfits);
        if (Array.isArray(parsed)) {
          setUploadedOutfits(parsed);
        }
      } catch (e) {
        console.error('读取已上传服装失败:', e);
      }
    }
  }, []);

  // 保存上传的服装到localStorage
  const saveUploadedOutfits = (outfits: string[]) => {
    localStorage.setItem('uploadedOutfits', JSON.stringify(outfits));
  };

  // 智能推荐算法
  const getRecommendedOutfits = () => {
    // 基于热度、季节和多样性推荐
    const now = new Date();
    const month = now.getMonth() + 1;
    
    // 确定当前季节
    let currentSeason: string;
    if (month >= 3 && month <= 5) currentSeason = 'spring';
    else if (month >= 6 && month <= 8) currentSeason = 'summer';
    else if (month >= 9 && month <= 11) currentSeason = 'autumn';
    else currentSeason = 'winter';
    
    // 根据热度排序推荐
    return outfitLibrary
      .sort((a, b) => (b.popularity || 0) - (a.popularity || 0))
      .slice(0, 6);
  };

  // 过滤和排序穿搭
  const filteredOutfits = React.useMemo(() => {
    let filtered = selectedCategory === '全部'
      ? outfitLibrary
      : outfitLibrary.filter(item => item.category === selectedCategory);
    
    // 搜索过滤
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(item => 
        item.name.toLowerCase().includes(query) ||
        item.tags.some(tag => tag.toLowerCase().includes(query)) ||
        item.style.toLowerCase().includes(query)
      );
    }
    
    // 排序
    switch (sortBy) {
      case 'popularity':
        filtered = [...filtered].sort((a, b) => (b.popularity || 0) - (a.popularity || 0));
        break;
      case 'newest':
        filtered = [...filtered].reverse();
        break;
      default:
        // 默认按分类和热度排序
        filtered = [...filtered].sort((a, b) => (b.popularity || 0) - (a.popularity || 0));
    }
    
    return filtered;
  }, [selectedCategory, searchQuery, sortBy]);

  const categories: OutfitCategory[] = ['全部', '夏季', '冬季', '职场', '休闲', '运动', '约会', '派对'];
  const recommendedOutfits = getRecommendedOutfits();

  // 处理文件上传
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const newImages: string[] = [];
      let processedCount = 0;
      
      Array.from(files).forEach((file, index) => {
        const reader = new FileReader();
        reader.onload = () => {
          const imageData = reader.result as string;
          newImages.push(imageData);
          processedCount++;
          
          // 所有文件处理完成后，更新状态并保存
          if (processedCount === files.length) {
            setUploadedOutfits(prev => {
              const updatedOutfits = [...prev, ...newImages];
              saveUploadedOutfits(updatedOutfits);
              return updatedOutfits;
            });
            
            // 自动选中新上传的第一张图片
            if (newImages.length > 0) {
              setTimeout(() => {
                handleToggleUploadedSelection(uploadedOutfits.length);
              }, 0);
            }
          }
        };
        reader.readAsDataURL(file);
      });
    }
  };

  // 删除已上传的服装
  const handleDeleteUploaded = (imageToDelete: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setUploadedOutfits(prev => {
      const index = prev.indexOf(imageToDelete);
      const newOutfits = prev.filter(img => img !== imageToDelete);
      
      // 保存到localStorage
      saveUploadedOutfits(newOutfits);
      
      // 如果删除的是当前选中的，清空选择
      if (selectedOutfit === 'custom-' + index) {
        setSelectedOutfit(null);
        localStorage.removeItem('selectedOutfit');
      }
      
      return newOutfits;
    });
  };

  // 清空所有上传的服装
  const handleClearAllUploaded = () => {
    if (confirm('确定要清空所有上传的服装吗？此操作不可恢复。')) {
      setUploadedOutfits([]);
      saveUploadedOutfits([]);
      setSelectedOutfit(null);
      localStorage.removeItem('selectedOutfit');
    }
  };

  const handleSelectOutfit = (outfitId: string) => {
    setSelectedOutfit(outfitId);
    const outfit = outfitLibrary.find(o => o.id === outfitId);
    if (outfit) {
      // 保存完整的穿搭信息，包括自动生成的描述
      localStorage.setItem('selectedOutfit', JSON.stringify({
        id: outfit.id,
        name: outfit.name,
        category: outfit.category,
        style: outfit.style,
        image: outfit.image,
        tags: outfit.tags,
        // 自动生成详细描述，用于AI提示词
        description: `${outfit.name}，${outfit.category}${outfit.style}风格，${outfit.tags.join('、')}`
      }));
    }
  };

  // 处理上传服装的多选
  const handleToggleUploadedSelection = (index: number) => {
    setSelectedUploadedIndices(prev => {
      if (prev.includes(index)) {
        // 如果已选中，则取消选择
        return prev.filter(i => i !== index);
      } else {
        // 如果未选中，则添加（最多选择3件）
        if (prev.length >= 3) {
          alert('最多只能选择3件服装进行搭配');
          return prev;
        }
        return [...prev, index];
      }
    });
  };

  // 使用选中的上传服装（支持多选）
  const handleUseSelectedUploaded = () => {
    if (selectedUploadedIndices.length === 0) {
      alert('请至少选择一件服装');
      return;
    }

    const selectedImages = selectedUploadedIndices.map(idx => uploadedOutfits[idx]);
    const outfitNames = selectedUploadedIndices.map(idx => `自定义服装 ${idx + 1}`);
    
    localStorage.setItem('selectedOutfit', JSON.stringify({
      id: 'custom-multi',
      name: selectedImages.length > 1 ? outfitNames.join(' + ') : outfitNames[0],
      category: '自定义',
      style: '自定义',
      images: selectedImages,
      tags: ['自定义'],
      type: selectedImages.length > 1 ? 'combo' : 'single',
      description: `用户上传的${selectedImages.length}件自定义服装`
    }));

    // 清空选择状态
    setSelectedUploadedIndices([]);
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-24 px-6 pb-12">
      <div className="max-w-6xl mx-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="font-heading text-4xl md:text-5xl font-bold text-gray-900">
            穿搭库
          </h1>
        </div>

        {/* Tab 切换 */}
        <div className="flex gap-2 mb-8">
          <button
            onClick={() => setActiveTab('library')}
            className={`px-6 py-3 rounded-xl font-medium transition-all ${
              activeTab === 'library'
                ? 'bg-primary-600 text-white shadow-md'
                : 'bg-white text-gray-700 border border-gray-200 hover:border-primary-300'
            }`}
          >
            📚 系统穿搭库
          </button>
          <button
            onClick={() => setActiveTab('upload')}
            className={`px-6 py-3 rounded-xl font-medium transition-all ${
              activeTab === 'upload'
                ? 'bg-primary-600 text-white shadow-md'
                : 'bg-white text-gray-700 border border-gray-200 hover:border-primary-300'
            }`}
          >
            📤 上传我的服装
          </button>
        </div>

        {activeTab === 'library' ? (
          <>
            {/* 智能推荐区域 */}
            {showRecommendations && selectedCategory === '全部' && !searchQuery && (
              <div className="card p-8 mb-8 bg-gradient-to-br from-primary-50 to-white">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center shadow-md">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-heading text-xl font-bold text-gray-900">
                        为您推荐
                      </h3>
                      <p className="text-gray-500 text-sm">根据季节和热度智能推荐</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowRecommendations(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
                  {recommendedOutfits.map((outfit) => (
                    <div
                      key={`rec-${outfit.id}`}
                      className={`group rounded-xl overflow-hidden border-2 transition-all duration-200 ${
                        selectedOutfit === outfit.id
                          ? 'border-primary-500 shadow-md'
                          : 'border-transparent hover:border-primary-200 hover:shadow-md'
                      }`}
                    >
                      <div 
                        className="aspect-[3/4] relative cursor-pointer"
                        onClick={() => handleSelectOutfit(outfit.id)}
                      >
                        <img
                          src={outfit.image}
                          alt={outfit.name}
                          className="w-full h-full object-cover"
                        />
                        {/* 选中标记 - 右上角 */}
                        {selectedOutfit === outfit.id && (
                          <div className="absolute top-2 right-2 w-6 h-6 bg-primary-600 rounded-full flex items-center justify-center shadow-md z-10">
                            <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                          </div>
                        )}
                        {/* 悬停时显示使用按钮 */}
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <Link
                            href="/upload"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleSelectOutfit(outfit.id);
                            }}
                            className="px-3 py-1.5 bg-white text-primary-700 text-xs font-semibold rounded-full shadow-lg hover:bg-primary-50 transition-colors"
                          >
                            使用此穿搭
                          </Link>
                        </div>
                        {/* 热度标签 */}
                        {outfit.popularity && outfit.popularity >= 90 && (
                          <div className="absolute top-2 left-2 px-2 py-0.5 bg-red-500 text-white text-xs rounded-full">
                            热门
                          </div>
                        )}
                      </div>
                      <div className="p-2 bg-white">
                        <h4 className="font-medium text-gray-900 text-xs truncate">{outfit.name}</h4>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 系统推荐穿搭 */}
            <div className="card p-8">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center shadow-md">
                  <span className="font-bold text-white text-lg">1</span>
                </div>
                <div>
                  <h3 className="font-heading text-xl font-bold text-gray-900">
                    系统推荐穿搭
                  </h3>
                  <p className="text-gray-500 text-sm">选择分类，浏览适合您的穿搭方案</p>
                </div>
              </div>

              {/* 搜索和排序 */}
              <div className="flex flex-col sm:flex-row gap-4 mb-6 pb-6 border-b border-gray-100">
                <div className="flex-1 relative">
                  <input
                    type="text"
                    placeholder="搜索穿搭..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full px-4 py-2 pl-10 rounded-xl border border-gray-200 bg-white focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none"
                  />
                  <svg className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as SortOption)}
                  className="px-4 py-2 rounded-xl border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none bg-white"
                >
                  <option value="default">默认排序</option>
                  <option value="popularity">按热度</option>
                  <option value="newest">最新上架</option>
                </select>
              </div>

              {/* 分类筛选 */}
              <div className="flex flex-wrap gap-2 mb-6">
                {categories.map(category => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                      selectedCategory === category
                        ? 'bg-primary-600 text-white shadow-sm'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>

              {/* 穿搭网格 */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
                {filteredOutfits.map((outfit) => (
                  <div
                    key={outfit.id}
                    className={`group rounded-xl overflow-hidden border-2 transition-all duration-200 ${
                      selectedOutfit === outfit.id
                        ? 'border-primary-500 shadow-md'
                        : 'border-gray-100 hover:border-primary-200 hover:shadow-md'
                    }`}
                  >
                    <div 
                      className="aspect-[3/4] relative cursor-pointer"
                      onClick={() => handleSelectOutfit(outfit.id)}
                    >
                      <img
                        src={outfit.image}
                        alt={outfit.name}
                        className="w-full h-full object-cover"
                      />
                      {/* 选中标记 - 右上角 */}
                      {selectedOutfit === outfit.id && (
                        <div className="absolute top-2 right-2 w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center shadow-md z-10">
                          <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                      )}
                      {/* 悬停时显示使用按钮 */}
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <Link
                          href="/upload"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleSelectOutfit(outfit.id);
                          }}
                          className="px-4 py-2 bg-white text-primary-700 text-sm font-semibold rounded-full shadow-lg hover:bg-primary-50 transition-colors"
                        >
                          使用此穿搭
                        </Link>
                      </div>
                      {/* 热度指示器 */}
                      {outfit.popularity && outfit.popularity >= 90 && (
                        <div className="absolute top-2 left-2 px-2 py-0.5 bg-red-500 text-white text-xs rounded-full flex items-center gap-1">
                          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z" clipRule="evenodd" />
                          </svg>
                          热门
                        </div>
                      )}
                    </div>
                    <div className="p-3">
                      <h4 className="font-medium text-gray-900 text-sm mb-1">{outfit.name}</h4>
                      <div className="flex flex-wrap gap-1">
                        <span className="px-2 py-0.5 bg-primary-100 text-primary-700 text-xs rounded-full">
                          {outfit.category}
                        </span>
                        {outfit.tags.slice(0, 1).map((tag, idx) => (
                          <span key={idx} className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded-full">
                            {tag}
                          </span>
                        ))}
                      </div>
                      {/* 热度显示 */}
                      {outfit.popularity && (
                        <div className="mt-2 flex items-center gap-1 text-xs text-gray-500">
                          <svg className="w-3 h-3 text-orange-500" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                          <span>{outfit.popularity}°</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* 空状态 */}
              {filteredOutfits.length === 0 && (
                <div className="text-center py-12">
                  <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                  <p className="text-gray-500">没有找到匹配的穿搭方案</p>
                  <button
                    onClick={() => {setSearchQuery(''); setSelectedCategory('全部');}}
                    className="mt-2 text-primary-600 hover:text-primary-700 text-sm"
                  >
                    清除筛选条件
                  </button>
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="card p-8">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary-400 to-primary-500 flex items-center justify-center shadow-md">
                <span className="font-bold text-white text-lg">2</span>
              </div>
              <div>
                <h3 className="font-heading text-xl font-bold text-gray-900">
                  上传我的服装
                </h3>
                <p className="text-gray-500 text-sm">上传您自己的服装照片</p>
              </div>
            </div>

            {/* 上传区域 */}
            {uploadedOutfits.length === 0 ? (
              /* 空状态：显示大上传区域 */
              <>
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center cursor-pointer hover:border-primary-400 hover:bg-primary-50/50 transition-all mb-6"
                >
                  <div className="w-16 h-16 rounded-full bg-primary-100 flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                  </div>
                  <p className="text-gray-800 font-medium mb-2">点击上传服装照片</p>
                  <p className="text-gray-400 text-sm">支持 JPG, PNG 格式，可同时选择多张</p>
                  <p className="text-gray-400 text-xs mt-1">提示：上传上衣+下装可组合成完整穿搭</p>
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={handleFileUpload}
                />
              </>
            ) : (
              /* 有图片时：显示紧凑网格布局 */
              <div className="mb-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h4 className="font-medium text-gray-900">我的服装库 ({uploadedOutfits.length}件)</h4>
                    <p className="text-xs text-gray-500 mt-1">
                      {selectedUploadedIndices.length > 0 
                        ? `已选择 ${selectedUploadedIndices.length} 件，最多可选3件`
                        : '点击选择多件服装进行搭配'}
                    </p>
                  </div>
                  <button
                    onClick={handleClearAllUploaded}
                    className="text-xs text-red-500 hover:text-red-600 flex items-center gap-1 px-2 py-1 rounded hover:bg-red-50 transition-colors"
                  >
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    清空全部
                  </button>
                </div>
                
                {/* 选中的服装预览和确认按钮 */}
                {selectedUploadedIndices.length > 0 && (
                  <div className="mb-4 p-4 bg-primary-50 rounded-xl border border-primary-200">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-700">已选择:</span>
                        <div className="flex gap-1">
                          {selectedUploadedIndices.map(idx => (
                            <div key={idx} className="w-8 h-8 rounded-lg overflow-hidden border border-primary-300">
                              <img src={uploadedOutfits[idx]} alt="" className="w-full h-full object-cover" />
                            </div>
                          ))}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => setSelectedUploadedIndices([])}
                          className="px-3 py-1.5 text-xs text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                          取消
                        </button>
                        <Link
                          href="/upload"
                          onClick={handleUseSelectedUploaded}
                          className="px-4 py-1.5 bg-primary-600 text-white text-xs font-medium rounded-lg hover:bg-primary-700 transition-colors flex items-center gap-1"
                        >
                          <span>使用这{selectedUploadedIndices.length}件</span>
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </Link>
                      </div>
                    </div>
                  </div>
                )}
                
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4">
                  {/* 已上传的服装 */}
                  {uploadedOutfits.map((image, idx) => (
                    <div
                      key={idx}
                      onClick={() => handleToggleUploadedSelection(idx)}
                      className={`group rounded-xl overflow-hidden border-2 transition-all duration-200 relative cursor-pointer ${
                        selectedUploadedIndices.includes(idx)
                          ? 'border-primary-500 shadow-md'
                          : 'border-gray-100 hover:border-primary-200 hover:shadow-md'
                      }`}
                    >
                      <div className="aspect-square relative">
                        <img src={image} alt={`上传的服装${idx + 1}`} className="w-full h-full object-cover" />
                        
                        {/* 选中标记 - 右上角 */}
                        {selectedUploadedIndices.includes(idx) && (
                          <div className="absolute top-1.5 right-1.5 w-6 h-6 bg-primary-600 rounded-full flex items-center justify-center shadow-md z-10">
                            <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                          </div>
                        )}
                        
                        {/* 序号标记 - 左下角 */}
                        <div className="absolute bottom-1.5 left-1.5 px-1.5 py-0.5 bg-black/50 text-white text-[10px] rounded">
                          #{idx + 1}
                        </div>
                        
                        {/* 悬停时显示提示 */}
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <span className="text-white text-xs font-medium">
                            {selectedUploadedIndices.includes(idx) ? '点击取消' : '点击选择'}
                          </span>
                        </div>
                        
                        {/* 删除按钮 - 左上角 */}
                        <button
                          onClick={(e) => handleDeleteUploaded(image, e)}
                          className="absolute top-1.5 left-1.5 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-md hover:bg-red-600 z-10"
                          title="删除"
                        >
                          <svg className="w-2.5 h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  ))}
                  
                  {/* +号上传按钮 */}
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="aspect-square rounded-xl border-2 border-dashed border-gray-300 flex flex-col items-center justify-center bg-gray-50 hover:bg-primary-50 hover:border-primary-400 transition-all cursor-pointer group"
                  >
                    <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center mb-1 group-hover:bg-primary-200 transition-colors">
                      <svg className="w-5 h-5 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                    </div>
                    <span className="text-xs text-gray-500 group-hover:text-primary-600">添加</span>
                  </div>
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={handleFileUpload}
                />
              </div>
            )}
          </div>
        )}



      </div>
    </div>
  );
}

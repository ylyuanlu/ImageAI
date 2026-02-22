"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { getLocalHistory, type LocalHistoryItem } from '@/lib/localHistory';
import { storeImageData } from '@/lib/imageStore';

interface HistoryItem {
  id: string;
  createdAt: string;
  modelImage: string;
  outfitImages: string[];
  generatedImage: string;
  generatedImages: string[]; // 所有生成的图片
  count: number; // 生成数量
  time?: string; // 生成耗时（秒）
  params: {
    pose: string;
    style: string;
    lighting: string;
  };
  isLocal?: boolean; // 标记是否为本地记录
}

export default function HistoryPage() {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'week' | 'month'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    // 从后端 API 和本地存储获取历史记录
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      setLoading(true);
      setError(null);
      
      let serverHistory: HistoryItem[] = [];
      let localHistory: HistoryItem[] = [];
      
      // 1. 尝试从服务器获取
      try {
        const response = await fetch('/api/history', {
          credentials: 'include',
        });

        if (response.ok) {
          const data = await response.json();
          const historyData = data.generations || data.history || [];
          
          serverHistory = historyData.map((item: any) => {
            // 解析 JSON 字符串（数据库中存储的是 JSON 字符串）
            let outfitImages = item.outfitImages;
            let generatedImages = item.generatedImages;
            
            if (typeof outfitImages === 'string') {
              try {
                outfitImages = JSON.parse(outfitImages);
              } catch {
                outfitImages = [];
              }
            }
            
            if (typeof generatedImages === 'string') {
              try {
                generatedImages = JSON.parse(generatedImages);
              } catch {
                generatedImages = [];
              }
            }
            
            return {
              id: item.id,
              createdAt: item.createdAt,
              modelImage: item.modelImage,
              outfitImages: outfitImages || [],
              generatedImage: generatedImages?.[0] || '',
              generatedImages: generatedImages || [],
              count: generatedImages?.length || 1,
              time: item.time || '0',
              params: {
                pose: item.pose || '默认',
                style: item.style || '默认',
                lighting: item.lighting || '默认',
              },
              isLocal: false,
            };
          });
        }
      } catch (serverError) {
        console.warn('从服务器获取历史记录失败:', serverError);
      }
      
      // 2. 从本地存储获取
      const localData = getLocalHistory();
      localHistory = localData.map((item: LocalHistoryItem) => ({
        id: item.id,
        createdAt: item.createdAt,
        modelImage: item.modelImage,
        outfitImages: item.outfitImages || [],
        generatedImage: item.generatedImages?.[0] || '',
        generatedImages: item.generatedImages || [],
        count: item.generatedImages?.length || 1,
        time: item.time || '0',
        params: {
          pose: item.pose || '默认',
          style: item.style || '默认',
          lighting: item.lighting || '默认',
        },
        isLocal: true,
      }));
      
      // 3. 合并并排序（按时间倒序）
      const combinedHistory = [...serverHistory, ...localHistory].sort((a, b) => {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });
      
      setHistory(combinedHistory);
      
      // 如果没有数据，显示提示
      if (combinedHistory.length === 0) {
        console.log('没有找到任何历史记录（服务器和本地都没有）');
      }
    } catch (err: any) {
      console.error('获取历史记录错误:', err);
      setError(err.message || '获取历史记录失败');
      setHistory([]);
    } finally {
      setLoading(false);
    }
  };

  // 点击查看按钮的处理函数
  const handleViewResult = async (item: HistoryItem) => {
    try {
      // 将图片数据存储到 IndexedDB（避免 localStorage 配额限制）
      const timestamp = Date.now();
      const storeKey = await storeImageData({
        model: item.modelImage,
        outfits: item.outfitImages,
        timestamp,
      });
      
      // 存储轻量级配置到 localStorage
      const resultConfig = {
        pose: item.params.pose,
        style: item.params.style,
        storeKey,
        timestamp,
      };
      localStorage.setItem('historyResultConfig', JSON.stringify(resultConfig));
      
      // 跳转到结果页面（传递必要的参数）
      const params = new URLSearchParams({
        from: 'history',
        id: item.id,
        images: JSON.stringify(item.generatedImages),
        pose: item.params.pose,
        style: item.params.style,
        count: item.count.toString(),
        time: item.time || '0',
        key: storeKey,
      });
      
      window.location.href = `/result?${params.toString()}`;
    } catch (error) {
      console.error('存储历史记录数据失败:', error);
      alert('存储空间不足，无法查看此历史记录');
    }
  };

  const filteredHistory = history.filter((item) => {
    // 时间过滤
    if (filter === 'week') {
      const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
      return new Date(item.createdAt) > weekAgo;
    }
    if (filter === 'month') {
      const monthAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
      return new Date(item.createdAt) > monthAgo;
    }
    return true;
  }).filter((item) => {
    // 搜索过滤
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        item.params.pose.toLowerCase().includes(query) ||
        item.params.style.toLowerCase().includes(query) ||
        item.params.lighting.toLowerCase().includes(query)
      );
    }
    return true;
  });

  const totalPages = Math.ceil(filteredHistory.length / itemsPerPage);
  const paginatedHistory = filteredHistory.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return {
      date: date.toLocaleDateString('zh-CN'),
      time: date.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' }),
    };
  };

  // 计算统计数据
  const totalCount = history.length;
  const weekCount = history.filter(item => {
    const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    return new Date(item.createdAt) > weekAgo;
  }).length;
  const monthCount = history.filter(item => {
    const monthAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    return new Date(item.createdAt) > monthAgo;
  }).length;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-28 pb-12">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-28 pb-12">
      <div className="max-w-6xl mx-auto px-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="font-heading text-3xl font-bold text-gray-900 mb-2">历史记录</h1>
          <p className="text-gray-600">查看和管理您的所有换装作品</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl p-4 shadow border border-gray-200 text-center">
            <div className="font-heading text-2xl font-bold text-primary-600">{totalCount}</div>
            <div className="text-gray-500 text-sm">总创作数</div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow border border-gray-200 text-center">
            <div className="font-heading text-2xl font-bold text-primary-600">{weekCount}</div>
            <div className="text-gray-500 text-sm">本周创作</div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow border border-gray-200 text-center">
            <div className="font-heading text-2xl font-bold text-primary-600">{monthCount}</div>
            <div className="text-gray-500 text-sm">本月创作</div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow border border-gray-200 text-center">
            <div className="font-heading text-2xl font-bold text-primary-600">{totalCount > 0 ? Math.round(totalCount * 0.3) : 0}</div>
            <div className="text-gray-500 text-sm">已分享</div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{error}</span>
            </div>
            <button 
              onClick={fetchHistory}
              className="mt-2 text-sm underline hover:no-underline"
            >
              重新加载
            </button>
          </div>
        )}

        {/* Filter Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div className="flex gap-2">
            {(['all', 'week', 'month'] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  filter === f
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {f === 'all' ? '全部' : f === 'week' ? '本周' : '本月'}
              </button>
            ))}
          </div>
          <div className="relative">
            <input
              type="text"
              placeholder="搜索作品..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none text-sm w-56"
            />
            <svg
              className="w-5 h-5 text-gray-400 absolute left-3 top-2.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
        </div>

        {/* Data Table */}
        {filteredHistory.length > 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="text-left px-6 py-4 font-semibold text-gray-900 text-sm">时间</th>
                  <th className="text-left px-6 py-4 font-semibold text-gray-900 text-sm">输入</th>
                  <th className="text-left px-6 py-4 font-semibold text-gray-900 text-sm">参数</th>
                  <th className="text-left px-6 py-4 font-semibold text-gray-900 text-sm">结果</th>
                  <th className="text-left px-6 py-4 font-semibold text-gray-900 text-sm">操作</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {paginatedHistory.map((item) => {
                  const { date, time } = formatDate(item.createdAt);
                  return (
                    <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-gray-900">{date}</div>
                        <div className="text-xs text-gray-500">{time}</div>
                        {item.isLocal && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-yellow-100 text-yellow-800 mt-1">
                            本地
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex -space-x-2">
                          <div className="w-8 h-8 rounded-lg overflow-hidden border-2 border-white">
                            <img
                              src={item.modelImage}
                              alt="模特"
                              className="w-full h-full object-cover"
                            />
                          </div>
                          {item.outfitImages.map((img, idx) => (
                            <div
                              key={idx}
                              className="w-8 h-8 rounded-lg overflow-hidden border-2 border-white"
                            >
                              <img
                                src={img}
                                alt={`服装${idx + 1}`}
                                className="w-full h-full object-cover"
                              />
                            </div>
                          ))}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-wrap gap-1">
                          {Object.values(item.params).map((param, idx) => (
                            <span
                              key={idx}
                              className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-xs"
                            >
                              {param}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="w-12 h-12 rounded-lg overflow-hidden">
                          <img
                            src={item.generatedImage}
                            alt="结果"
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleViewResult(item)}
                            className="px-3 py-1 rounded-lg bg-primary-50 text-primary-600 text-xs font-medium hover:bg-primary-100 transition-colors"
                          >
                            查看
                          </button>
                          <a
                            href={item.generatedImage}
                            download
                            className="px-3 py-1 rounded-lg bg-gray-50 text-gray-600 text-xs font-medium hover:bg-gray-100 transition-colors"
                          >
                            下载
                          </a>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            {/* Pagination */}
            <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
              <div className="text-sm text-gray-500">
                显示 {(currentPage - 1) * itemsPerPage + 1}-{Math.min(currentPage * itemsPerPage, filteredHistory.length)} 条，共{' '}
                {filteredHistory.length} 条
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-1 rounded-lg border border-gray-300 text-gray-600 text-sm hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  上一页
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`px-3 py-1 rounded-lg text-sm ${
                      currentPage === page
                        ? 'bg-primary-600 text-white'
                        : 'border border-gray-300 text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    {page}
                  </button>
                ))}
                <button
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1 rounded-lg border border-gray-300 text-gray-600 text-sm hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  下一页
                </button>
              </div>
            </div>
          </div>
        ) : (
          /* Empty State */
          <div className="text-center py-16">
            <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">暂无历史记录</h3>
            <p className="text-gray-500 mb-4">开始创作您的第一张作品吧</p>
            <Link href="/upload" className="btn-primary">
              开始创作
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

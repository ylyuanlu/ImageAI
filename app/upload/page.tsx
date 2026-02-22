"use client";

import React, { Suspense } from 'react';
import dynamic from 'next/dynamic';

// 动态导入 UploadContent 组件，禁用 SSR
const UploadContent = dynamic(() => import('./UploadContent'), {
  ssr: false,
  loading: () => <LoadingState />
});

/**
 * 加载状态组件
 */
function LoadingState() {
  return (
    <div className="min-h-screen bg-gray-50 pt-24 px-6 pb-12">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-full bg-primary-100 flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-primary-600 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </div>
          <h1 className="font-heading text-2xl md:text-3xl font-bold text-gray-900 mb-2">
            加载中...
          </h1>
          <p className="text-gray-600">正在初始化上传页面</p>
        </div>
      </div>
    </div>
  );
}

/**
 * 上传页面
 * 使用动态导入避免 SSR 问题
 */
export default function UploadPage() {
  return (
    <Suspense fallback={<LoadingState />}>
      <UploadContent />
    </Suspense>
  );
}

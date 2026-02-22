"use client";

import React from 'react';
import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="min-h-[calc(100vh-4rem)] bg-gradient-to-br from-white via-gray-50 to-primary-50 relative overflow-hidden">
        {/* 背景装饰 */}
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-primary-100/30 to-transparent" />
        
        <div className="max-w-7xl mx-auto px-6 h-full flex items-center">
          <div className="grid lg:grid-cols-5 gap-8 w-full items-center py-8">
            
            {/* Left Content */}
            <div className="lg:col-span-3 space-y-6 animate-slide-up relative z-10">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-100 text-green-700 rounded-full">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <span className="text-sm font-medium">
                  新用户免费赠送5张AI生成额度
                </span>
              </div>

              {/* Title - 主标题 */}
              <div className="space-y-2">
                <h1 className="font-heading text-5xl lg:text-6xl font-bold leading-[1.1] text-gray-900">
                  虚拟换装
                </h1>
                <div className="font-heading text-4xl lg:text-5xl font-bold leading-[1.1]">
                  <span className="gradient-text">秒级生成</span>
                </div>
              </div>

              {/* Description - 副标题 */}
              <p className="text-xl text-gray-600 leading-relaxed max-w-lg pt-2">
                上传您的照片和喜欢的服装，AI智能生成专业级穿搭效果图。
              </p>

              {/* CTA Buttons - 核心操作 */}
              <div className="flex flex-wrap gap-4 pt-4">
                <Link
                  href="/upload"
                  className="btn-primary text-lg inline-flex items-center gap-2 px-8 py-4"
                >
                  立即免费体验
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 7l5 5m0 0l-5 5m5-5H6"
                    />
                  </svg>
                </Link>
                <Link 
                  href="/membership" 
                  className="btn-secondary text-lg px-8 py-4"
                >
                  查看价格方案
                </Link>
              </div>

              {/* Stats - 底部信任数据 */}
              <div className="flex gap-12 pt-10 mt-10 border-t border-gray-200">
                {/* 数据1：用户量 */}
                <div>
                  <div className="font-heading text-3xl font-bold text-blue-600">50K+</div>
                  <div className="text-gray-500 text-sm">活跃用户</div>
                </div>

                {/* 数据2：生成量（中间突出） */}
                <div className="px-5 py-2 bg-primary-50 rounded-2xl -my-2">
                  <div className="font-heading text-3xl font-bold text-primary-600">2M+</div>
                  <div className="text-gray-600 text-sm font-medium">已生成穿搭</div>
                </div>

                {/* 数据3：满意度 */}
                <div>
                  <div className="font-heading text-3xl font-bold text-green-600">98%</div>
                  <div className="text-gray-500 text-sm">用户满意度</div>
                </div>
              </div>
            </div>

            {/* Right Content - 干净的大图展示 */}
            <div className="lg:col-span-2 animate-fade-in">
              <div className="rounded-2xl overflow-hidden shadow-lg">
                <img
                  src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&h=800&fit=crop"
                  alt="AI生成效果展示"
                  className="w-full h-auto object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="font-heading text-3xl font-bold text-gray-900 mb-4">
              三步完成虚拟换装
            </h2>
            <p className="text-gray-600 text-lg">
              简单直观的操作流程，让创意瞬间呈现
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="card-hover p-8">
              <div className="w-14 h-14 bg-primary-600 rounded-xl flex items-center justify-center mb-6 shadow-md">
                <svg
                  className="w-7 h-7 text-white"
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
              <h3 className="font-heading text-xl font-bold mb-3 text-gray-900">
                1. 上传模特照片
              </h3>
              <p className="text-gray-600">
                上传清晰的人物全身照，支持多种姿势和角度
              </p>
            </div>

            {/* Step 2 */}
            <div className="card-hover p-8">
              <div className="w-14 h-14 bg-primary-600 rounded-xl flex items-center justify-center mb-6 shadow-md">
                <svg
                  className="w-7 h-7 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01"
                  />
                </svg>
              </div>
              <h3 className="font-heading text-xl font-bold mb-3 text-gray-900">
                2. 选择姿势和服装
              </h3>
              <p className="text-gray-600">
                从姿势库中选择姿态，上传或选择服装搭配
              </p>
            </div>

            {/* Step 3 */}
            <div className="card-hover p-8">
              <div className="w-14 h-14 bg-primary-600 rounded-xl flex items-center justify-center mb-6 shadow-md">
                <svg
                  className="w-7 h-7 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
              </div>
              <h3 className="font-heading text-xl font-bold mb-3 text-gray-900">
                3. AI生成效果图
              </h3>
              <p className="text-gray-600">
                15秒内获得专业级穿搭效果图，支持多次调整
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary-600 py-16">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="font-heading text-3xl font-bold text-white mb-6">
            准备好开始创作了吗？
          </h2>
          <p className="text-primary-100 text-xl mb-8">
            新用户免费赠送5张AI生成额度，无需信用卡
          </p>
          <div className="flex justify-center gap-4">
            <Link
              href="/upload"
              className="inline-flex items-center gap-2 bg-white text-primary-600 px-8 py-4 rounded-xl font-bold text-lg hover:bg-gray-100 transition-colors shadow-lg"
            >
              立即免费试用
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 7l5 5m0 0l-5 5m5-5H6"
                />
              </svg>
            </Link>
            <Link
              href="/membership"
              className="inline-flex items-center gap-2 border-2 border-white/30 text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-white/10 transition-colors"
            >
              查看价格方案
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-primary-600 flex items-center justify-center">
                  <svg
                    className="w-5 h-5 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                </div>
                <span className="font-bold text-xl text-white">AI试衣间</span>
              </div>
              <p className="text-sm">AI驱动的虚拟换装解决方案</p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">产品</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link className="hover:text-white transition-colors" href="/upload">
                    开始创作
                  </Link>
                </li>
                <li>
                  <Link className="hover:text-white transition-colors" href="/membership">
                    价格方案
                  </Link>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    API接口
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">资源</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    使用教程
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    常见问题
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    更新日志
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">联系</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    帮助中心
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    商务合作
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    反馈建议
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm">© 2026 AI试衣间. 保留所有权利.</p>
            <div className="flex gap-6 text-sm">
              <a href="#" className="hover:text-white transition-colors">
                隐私政策
              </a>
              <a href="#" className="hover:text-white transition-colors">
                服务条款
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

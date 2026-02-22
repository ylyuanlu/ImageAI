"use client";

import React from 'react';
import Link from 'next/link';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="pt-12 pb-16 bg-gradient-to-b from-white to-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            {/* Left Content */}
            <div className="space-y-5">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary-50 rounded-full">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                <span className="text-sm font-medium text-primary-700">已服务 1000+ 跨境电商卖家</span>
              </div>
              
              {/* Title */}
              <div className="space-y-2">
                <h1 className="font-heading text-5xl lg:text-6xl font-bold leading-tight text-gray-900">
                  请不起欧美模特？
                </h1>
                <div className="font-heading text-4xl lg:text-5xl font-bold leading-tight">
                  <span className="gradient-text">AI 帮你一键生成</span>
                </div>
              </div>
              
              {/* Description */}
              <p className="text-xl text-gray-600 leading-relaxed max-w-lg pt-2">
                用中国模特原图，AI 自动生成欧美模特效果图。
              </p>

              {/* Key Benefits */}
              <div className="flex gap-8 py-2">
                <div className="text-center">
                  <div className="font-heading text-4xl font-bold text-primary-600">90%</div>
                  <div className="text-gray-500 text-sm">成本降低</div>
                </div>
                <div className="text-center">
                  <div className="font-heading text-4xl font-bold text-primary-600">10倍</div>
                  <div className="text-gray-500 text-sm">效率提升</div>
                </div>
              </div>
              
              {/* CTA Buttons */}
              <div className="flex flex-wrap gap-4 pt-2">
                <Link href="/upload" className="btn-primary text-lg inline-flex items-center gap-2 px-8 py-4">
                  立即免费体验
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6"/>
                  </svg>
                </Link>
                <Link href="#cases" className="btn-secondary text-lg px-8 py-4">
                  查看案例
                </Link>
              </div>
              
              {/* Stats */}
              <div className="flex gap-10 pt-8 mt-6 border-t border-gray-200">
                <div>
                  <div className="font-heading text-2xl font-bold text-gray-900">1000+</div>
                  <div className="text-gray-500 text-sm">服务商家</div>
                </div>
                <div className="px-4 py-1 bg-primary-50 rounded-xl -my-1">
                  <div className="font-heading text-2xl font-bold text-primary-600">50万+</div>
                  <div className="text-gray-600 text-sm font-medium">已生成图片</div>
                </div>
                <div>
                  <div className="font-heading text-2xl font-bold text-gray-900">¥2.5</div>
                  <div className="text-gray-500 text-sm">平均单张成本</div>
                </div>
              </div>
            </div>

            {/* Right Content - Demo */}
            <div className="relative lg:pt-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-3">
                  <div className="card p-3">
                    <div className="aspect-[3/4] rounded-xl overflow-hidden bg-gray-100 mb-2">
                      <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=533&fit=crop" alt="中国模特原图" className="w-full h-full object-cover" />
                    </div>
                    <p className="text-xs text-gray-500 text-center">中国模特原图</p>
                  </div>
                </div>
                <div className="space-y-3 pt-6">
                  <div className="card p-3 border-2 border-primary-500 shadow-md">
                    <div className="aspect-[3/4] rounded-xl overflow-hidden bg-gray-100 mb-2 relative">
                      <img src="https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=400&h=533&fit=crop" alt="AI生成欧美模特" className="w-full h-full object-cover" />
                      <div className="absolute top-2 right-2 px-2 py-1 bg-primary-600 text-white text-xs rounded-full font-medium">
                        AI生成
                      </div>
                    </div>
                    <p className="text-xs text-primary-600 font-medium text-center">欧美模特效果图</p>
                  </div>
                </div>
              </div>
              
              <div className="mt-4 text-center">
                <span className="inline-flex items-center gap-1.5 text-sm text-gray-500">
                  <svg className="w-4 h-4 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z"/>
                  </svg>
                  15秒完成转换
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pain Points Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="font-heading text-3xl font-bold text-gray-900 mb-4">跨境电商的痛点</h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">我们深入调研了 500+ 跨境电商卖家，发现这些共同难题</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="card-hover p-8 text-center">
              <div className="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
              </div>
              <h3 className="font-heading text-xl font-bold mb-3 text-gray-900">成本高昂</h3>
              <p className="text-gray-600">欧美模特拍摄成本高，单次拍摄费用 ¥5000-20000，中小卖家难以承受</p>
            </div>
            
            <div className="card-hover p-8 text-center">
              <div className="w-16 h-16 bg-orange-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
              </div>
              <h3 className="font-heading text-xl font-bold mb-3 text-gray-900">周期漫长</h3>
              <p className="text-gray-600">从预约模特到拿到成片需要 1-2 周，新品上架周期长，错过销售旺季</p>
            </div>
            
            <div className="card-hover p-8 text-center">
              <div className="w-16 h-16 bg-yellow-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3"/>
                </svg>
              </div>
              <h3 className="font-heading text-xl font-bold mb-3 text-gray-900">效率低下</h3>
              <p className="text-gray-600">一次拍摄只能产出有限图片，产品SKU多时需要反复拍摄，成本倍增</p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="font-heading text-3xl font-bold text-gray-900 mb-4">三步完成转换</h2>
            <p className="text-gray-600 text-lg">无需重新拍摄，用现有图片即可生成</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-20 h-20 bg-primary-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <span className="font-heading text-3xl font-bold text-primary-600">1</span>
              </div>
              <h3 className="font-heading text-xl font-bold mb-3 text-gray-900">上传原图</h3>
              <p className="text-gray-600">上传中国模特照片，支持 JPG、PNG 格式</p>
            </div>
            
            <div className="text-center">
              <div className="w-20 h-20 bg-primary-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <span className="font-heading text-3xl font-bold text-primary-600">2</span>
              </div>
              <h3 className="font-heading text-xl font-bold mb-3 text-gray-900">选择人种</h3>
              <p className="text-gray-600">选择目标人种：欧美、拉美、中东等</p>
            </div>
            
            <div className="text-center">
              <div className="w-20 h-20 bg-primary-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <span className="font-heading text-3xl font-bold text-primary-600">3</span>
              </div>
              <h3 className="font-heading text-xl font-bold mb-3 text-gray-900">AI生成</h3>
              <p className="text-gray-600">15秒内获得高质量欧美模特效果图</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="font-heading text-3xl font-bold text-gray-900 mb-4">为什么选择 AI试衣间</h2>
            <p className="text-gray-600 text-lg">专为跨境电商打造的 AI 模特解决方案</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z"/>
                </svg>
              </div>
              <h3 className="font-heading text-lg font-bold mb-2">极速生成</h3>
              <p className="text-gray-600 text-sm">15秒完成单张图片转换，支持批量处理</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
              </div>
              <h3 className="font-heading text-lg font-bold mb-2">高清画质</h3>
              <p className="text-gray-600 text-sm">支持 4K 超清输出，细节清晰可见</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
                </svg>
              </div>
              <h3 className="font-heading text-lg font-bold mb-2">安全合规</h3>
              <p className="text-gray-600 text-sm">AI生成图片无版权风险，商用无忧</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/>
                </svg>
              </div>
              <h3 className="font-heading text-lg font-bold mb-2">多人人种</h3>
              <p className="text-gray-600 text-sm">支持欧美、拉美、中东等多人种转换</p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="font-heading text-3xl font-bold text-gray-900 mb-4">简单透明的价格</h2>
            <p className="text-gray-600 text-lg">按量付费，用多少付多少，无隐藏费用</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="card p-8 text-center">
              <h3 className="font-heading text-xl font-bold mb-2">免费体验</h3>
              <p className="text-gray-500 mb-6">新用户专享</p>
              <div className="font-heading text-4xl font-bold text-gray-900 mb-2">¥0</div>
              <p className="text-gray-500 mb-8">赠送 5 张</p>
              <ul className="text-left space-y-3 mb-8 text-gray-600">
                <li className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7"/>
                  </svg>
                  5张免费生成
                </li>
                <li className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7"/>
                  </svg>
                  标准清晰度
                </li>
                <li className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7"/>
                  </svg>
                  基础功能
                </li>
              </ul>
              <Link href="/upload" className="btn-secondary w-full">免费试用</Link>
            </div>
            
            <div className="card p-8 text-center border-2 border-primary-500 relative">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary-600 text-white px-4 py-1 rounded-full text-sm font-medium">
                最受欢迎
              </div>
              <h3 className="font-heading text-xl font-bold mb-2">按量付费</h3>
              <p className="text-gray-500 mb-6">灵活使用</p>
              <div className="font-heading text-4xl font-bold text-gray-900 mb-2">¥2</div>
              <p className="text-gray-500 mb-8">每张</p>
              <ul className="text-left space-y-3 mb-8 text-gray-600">
                <li className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7"/>
                  </svg>
                  高清 4K 输出
                </li>
                <li className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7"/>
                  </svg>
                  多人种选择
                </li>
                <li className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7"/>
                  </svg>
                  批量处理
                </li>
              </ul>
              <Link href="/upload" className="btn-primary w-full">立即使用</Link>
            </div>
            
            <div className="card p-8 text-center">
              <h3 className="font-heading text-xl font-bold mb-2">企业套餐</h3>
              <p className="text-gray-500 mb-6">大用量客户</p>
              <div className="font-heading text-4xl font-bold text-gray-900 mb-2">¥1.8</div>
              <p className="text-gray-500 mb-8">每张起</p>
              <ul className="text-left space-y-3 mb-8 text-gray-600">
                <li className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7"/>
                  </svg>
                  月付 1000 张起
                </li>
                <li className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7"/>
                  </svg>
                  专属客服
                </li>
                <li className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7"/>
                  </svg>
                  API 接口
                </li>
              </ul>
              <Link href="/membership" className="btn-secondary w-full">联系销售</Link>
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
              className="inline-flex items-center gap-2 bg-white text-primary-600 px-8 py-4 rounded-xl font-bold text-lg hover:bg-gray-100 transition-colors shadow-md"
            >
              立即免费试用
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6"/>
              </svg>
            </Link>
            <Link href="/membership" className="border-2 border-white/30 text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-white/10 transition-colors">
              查看详细价格
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
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                  </svg>
                </div>
                <span className="font-bold text-xl text-white">AI试衣间</span>
              </div>
              <p className="text-sm">AI驱动的虚拟换装解决方案</p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">产品</h4>
              <ul className="space-y-2 text-sm">
                <li><Link className="hover:text-white transition-colors" href="/upload">开始创作</Link></li>
                <li><Link className="hover:text-white transition-colors" href="/membership">价格方案</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">资源</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">使用教程</a></li>
                <li><a href="#" className="hover:text-white transition-colors">常见问题</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">联系</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">帮助中心</a></li>
                <li><a href="#" className="hover:text-white transition-colors">商务合作</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm">© 2026 AI试衣间. 保留所有权利.</p>
            <div className="flex gap-6 text-sm">
              <a href="#" className="hover:text-white transition-colors">隐私政策</a>
              <a href="#" className="hover:text-white transition-colors">服务条款</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

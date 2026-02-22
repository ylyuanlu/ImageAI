"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

interface MembershipLevel {
  id: string;
  name: string;
  description: string;
  monthlyPrice: number;
  yearlyPrice: number;
  originalMonthlyPrice?: number;
  monthlyQuota: number;
  maxResolution: string;
  features: string[];
  popular?: boolean;
}

const membershipLevels: MembershipLevel[] = [
  {
    id: 'free',
    name: '免费版',
    description: '适合初次体验用户',
    monthlyPrice: 0,
    yearlyPrice: 0,
    monthlyQuota: 5,
    maxResolution: '1080p',
    features: [
      '每月5张免费生成额度',
      '标准清晰度 (1080p)',
      '基础姿势库',
      '带水印下载',
      '历史记录保存7天',
    ],
  },
  {
    id: 'pro',
    name: '专业版',
    description: '适合个人创作者和博主',
    monthlyPrice: 49,
    yearlyPrice: 399,
    originalMonthlyPrice: 59,
    monthlyQuota: 50,
    maxResolution: '2K',
    features: [
      '每月50张生成额度',
      '高清输出 (2K)',
      '完整姿势库 (50+姿势)',
      '无水印下载',
      '历史记录永久保存',
      '优先生成队列',
    ],
    popular: true,
  },
  {
    id: 'team',
    name: '团队版',
    description: '适合企业和小型团队',
    monthlyPrice: 199,
    yearlyPrice: 1599,
    originalMonthlyPrice: 249,
    monthlyQuota: 200,
    maxResolution: '4K',
    features: [
      '每月200张生成额度',
      '超清输出 (4K)',
      'VIP姿势库 (100+姿势)',
      '批量生成 (一次10张)',
      'API接口访问',
      '专属客服支持',
    ],
  },
];

const featureComparison = [
  { name: '每月生成额度', free: '5张', pro: '50张', team: '200张' },
  { name: '输出分辨率', free: '1080p', pro: '2K', team: '4K' },
  { name: '姿势库数量', free: '基础 (20+)', pro: '完整 (50+)', team: 'VIP (100+)' },
  { name: '水印', free: '有', pro: '无', team: '无' },
  { name: '历史记录保存', free: '7天', pro: '永久', team: '永久' },
  { name: '批量生成', free: '—', pro: '—', team: '✓' },
  { name: 'API接口', free: '—', pro: '—', team: '✓' },
  { name: '优先队列', free: '—', pro: '✓', team: '✓' },
];

const faqs = [
  {
    question: '我可以随时升级或降级吗？',
    answer: '是的，您可以随时在账户设置中更改订阅方案。升级后立即生效，降级将在当前计费周期结束后生效。',
  },
  {
    question: '未使用的生成额度会结转吗？',
    answer: '专业版和团队版的月度额度用不完可结转至下月，最多累积3个月。免费版额度每月重置。',
  },
  {
    question: '支持哪些支付方式？',
    answer: '我们支持支付宝、微信支付、银联卡以及主流信用卡。企业用户可申请对公转账。',
  },
  {
    question: '如何获得退款？',
    answer: '如果您对服务不满意，可以在订阅后7天内申请全额退款。按量购买的额度不支持退款。',
  },
];

export default function MembershipPage() {
  const [isYearly, setIsYearly] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-gray-50 pt-20 pb-12">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="font-heading text-4xl font-bold text-gray-900 mb-4">
            选择适合您的方案
          </h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            灵活的定价方案，满足不同需求。新用户免费赠送5张生成额度。
          </p>

          {/* Billing Toggle */}
          <div className="flex items-center justify-center gap-4 mt-8">
            <span className={`font-medium transition-colors ${!isYearly ? 'text-gray-900' : 'text-gray-500'}`}>
              月付
            </span>
            <button
              onClick={() => setIsYearly(!isYearly)}
              className={`relative w-14 h-7 rounded-full transition-colors duration-200 ${
                isYearly ? 'bg-primary-600' : 'bg-gray-300'
              }`}
              aria-label={isYearly ? '切换到月付' : '切换到年付'}
            >
              <span
                className={`absolute top-1 left-1 w-5 h-5 bg-white rounded-full shadow-sm transition-transform duration-200 ease-in-out ${
                  isYearly ? 'translate-x-7' : 'translate-x-0'
                }`}
              />
            </button>
            <span className={`font-medium transition-colors ${isYearly ? 'text-gray-900' : 'text-gray-500'}`}>
              年付
            </span>
            <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
              省20%
            </span>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {membershipLevels.map((level) => (
            <div
              key={level.id}
              className={`card p-8 relative ${
                level.popular
                  ? 'border-2 border-primary-600 scale-105 shadow-md'
                  : 'card-hover'
              }`}
            >
              {level.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <span className="bg-green-500 text-white px-4 py-1.5 rounded-full text-sm font-semibold shadow-md">
                    最受欢迎
                  </span>
                </div>
              )}

              <div className="mb-6">
                <h3 className="font-heading text-xl font-bold text-gray-900 mb-2">
                  {level.name}
                </h3>
                <p className="text-gray-500 text-sm">{level.description}</p>
              </div>

              <div className="mb-6">
                <span className="font-heading text-4xl font-bold text-gray-900">
                  ¥{isYearly ? Math.round(level.yearlyPrice / 12) : level.monthlyPrice}
                </span>
                <span className="text-gray-500">/月</span>
                {!isYearly && level.originalMonthlyPrice && level.originalMonthlyPrice > level.monthlyPrice && (
                  <p className="text-gray-400 text-sm mt-1 line-through">
                    原价 ¥{level.originalMonthlyPrice}/月
                  </p>
                )}
                {isYearly && level.yearlyPrice > 0 && (
                  <p className="text-gray-400 text-sm mt-1">
                    按年付费 ¥{level.yearlyPrice}/年
                  </p>
                )}
              </div>

              <button
                className={`w-full py-3 rounded-xl font-bold mb-8 transition-colors ${
                  level.id === 'free'
                    ? 'border-2 border-gray-300 text-gray-700 hover:border-gray-400'
                    : level.popular
                    ? 'bg-primary-600 text-white hover:bg-primary-700 shadow-md '
                    : 'border-2 border-primary-600 text-primary-600 hover:bg-primary-50'
                }`}
              >
                {level.id === 'free' ? '开始使用' : level.popular ? '立即订阅' : '联系销售'}
              </button>

              <ul className="space-y-4">
                {level.features.map((feature, idx) => (
                  <li key={idx} className="flex items-center gap-3">
                    <svg
                      className="w-5 h-5 text-green-500 flex-shrink-0"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    <span className="text-gray-600 text-sm">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Pay Per Use */}
        <div className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-2xl p-8 text-white mb-16">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="font-heading text-2xl font-bold mb-2">按量付费</h3>
              <p className="text-primary-100">不需要订阅？随时购买生成额度，永不过期。</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <div className="font-heading text-3xl font-bold">
                  ¥2<span className="text-lg">/张</span>
                </div>
                <div className="text-primary-200 text-sm">最低购买10张</div>
              </div>
              <button className="px-6 py-3 bg-white text-primary-600 rounded-xl font-bold hover:bg-gray-100 transition-colors shadow-md">
                立即购买
              </button>
            </div>
          </div>
        </div>

        {/* Feature Comparison */}
        <div className="mb-16">
          <h2 className="font-heading text-2xl font-bold text-center text-gray-900 mb-8">
            功能对比
          </h2>
          <div className="bg-white rounded-2xl shadow overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="text-left px-6 py-4 font-semibold text-gray-900">功能特性</th>
                    <th className="text-center px-6 py-4 font-semibold text-gray-900">免费版</th>
                    <th className="text-center px-6 py-4 font-semibold text-primary-600">专业版</th>
                    <th className="text-center px-6 py-4 font-semibold text-gray-900">团队版</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {featureComparison.map((feature, idx) => (
                    <tr key={idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                      <td className="px-6 py-4 text-gray-700">{feature.name}</td>
                      <td className="text-center px-6 py-4 text-gray-600">{feature.free}</td>
                      <td className="text-center px-6 py-4 text-primary-600 font-medium">
                        {feature.pro}
                      </td>
                      <td className="text-center px-6 py-4 text-gray-600">{feature.team}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* FAQ */}
        <div className="max-w-3xl mx-auto mb-16">
          <h2 className="font-heading text-2xl font-bold text-center text-gray-900 mb-8">
            常见问题
          </h2>
          <div className="space-y-4">
            {faqs.map((faq, idx) => (
              <div key={idx} className="card">
                <button
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  className="w-full flex items-center justify-between p-6 text-left"
                >
                  <h4 className="font-semibold text-gray-900">{faq.question}</h4>
                  <svg
                    className={`w-5 h-5 text-gray-400 transition-transform ${
                      openFaq === idx ? 'rotate-180' : ''
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>
                {openFaq === idx && (
                  <div className="px-6 pb-6">
                    <p className="text-gray-600">{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <section className="bg-primary-600 py-16 rounded-2xl mb-16">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <h2 className="font-heading text-3xl font-bold text-white mb-4">还有疑问？</h2>
            <p className="text-primary-100 text-xl mb-8">
              我们的团队随时为您解答，帮助您选择最适合的方案
            </p>
            <div className="flex justify-center gap-4">
              <a
                href="#"
                className="bg-white text-primary-600 px-8 py-4 rounded-xl font-bold text-lg hover:bg-gray-100 transition-colors shadow-md"
              >
                联系客服
              </a>
              <Link
                href="/upload"
                className="border-2 border-white/30 text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-white/10 transition-colors"
              >
                先免费试用
              </Link>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-gray-900 text-gray-400 py-12 -mx-6">
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
                  <li><Link href="/upload" className="hover:text-white transition-colors">开始创作</Link></li>
                  <li><Link href="/membership" className="hover:text-white transition-colors">价格方案</Link></li>
                  <li><a href="#" className="hover:text-white transition-colors">API接口</a></li>
                </ul>
              </div>
              <div>
                <h4 className="text-white font-semibold mb-4">资源</h4>
                <ul className="space-y-2 text-sm">
                  <li><a href="#" className="hover:text-white transition-colors">使用教程</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">常见问题</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">更新日志</a></li>
                </ul>
              </div>
              <div>
                <h4 className="text-white font-semibold mb-4">联系</h4>
                <ul className="space-y-2 text-sm">
                  <li><a href="#" className="hover:text-white transition-colors">帮助中心</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">商务合作</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">反馈建议</a></li>
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
    </div>
  );
}

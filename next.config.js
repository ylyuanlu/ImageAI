/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // 配置外部依赖，避免 webpack 处理 (Next.js 16 新配置方式)
  serverExternalPackages: ['alipay-sdk', 'wechatpay-node-v3'],
  // Turbopack 配置 (Next.js 16 默认启用)
  turbopack: {},
  // 配置 webpack (保留用于兼容)
  webpack: (config, { isServer }) => {
    // 确保路径别名正确解析
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': require('path').resolve(__dirname),
    }
    
    if (isServer) {
      // 服务器端排除这些模块的打包问题
      config.externals.push('alipay-sdk')
    }
    return config
  }
}

module.exports = nextConfig

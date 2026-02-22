// 支付配置
export const paymentConfig = {
  // 支付宝配置
  alipay: {
    // 应用ID
    appId: process.env.ALIPAY_APP_ID || '',
    // 应用私钥
    privateKey: process.env.ALIPAY_PRIVATE_KEY || '',
    // 支付宝公钥
    alipayPublicKey: process.env.ALIPAY_PUBLIC_KEY || '',
    // 网关地址
    gateway: process.env.ALIPAY_GATEWAY || 'https://openapi.alipay.com/gateway.do',
    // 回调地址 - 使用环境变量或动态构建
    notifyUrl: process.env.ALIPAY_NOTIFY_URL || `${process.env.NEXT_PUBLIC_APP_URL || 'https://ai-shiyi.com'}/api/payment/alipay/notify`,
    // 返回地址 - 使用环境变量或动态构建
    returnUrl: process.env.ALIPAY_RETURN_URL || `${process.env.NEXT_PUBLIC_APP_URL || 'https://ai-shiyi.com'}/payment/result`,
  },

  // 微信支付配置
  wechat: {
    // 应用ID
    appId: process.env.WECHAT_APP_ID || '',
    // 商户号
    mchId: process.env.WECHAT_MCH_ID || '',
    // APIv3密钥
    apiV3Key: process.env.WECHAT_API_V3_KEY || '',
    // 商户证书序列号
    serialNo: process.env.WECHAT_SERIAL_NO || '',
    // 商户私钥
    privateKey: process.env.WECHAT_PRIVATE_KEY || '',
    // 回调地址 - 使用环境变量或动态构建
    notifyUrl: process.env.WECHAT_NOTIFY_URL || `${process.env.NEXT_PUBLIC_APP_URL || 'https://ai-shiyi.com'}/api/payment/wechat/notify`,
  }
}

// 检查支付配置是否完整
export function checkAlipayConfig(): boolean {
  return !!(
    paymentConfig.alipay.appId &&
    paymentConfig.alipay.privateKey &&
    paymentConfig.alipay.alipayPublicKey
  )
}

export function checkWechatConfig(): boolean {
  return !!(
    paymentConfig.wechat.appId &&
    paymentConfig.wechat.mchId &&
    paymentConfig.wechat.apiV3Key &&
    paymentConfig.wechat.privateKey
  )
}

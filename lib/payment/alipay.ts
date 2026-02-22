// 支付宝支付工具
import { paymentConfig, checkAlipayConfig } from './config'

// 初始化支付宝 SDK
let alipaySdk: any = null

export async function getAlipaySdk(): Promise<any> {
  if (!checkAlipayConfig()) {
    console.warn('支付宝配置不完整，无法初始化')
    return null
  }

  if (!alipaySdk) {
    // 使用 require 避免类型问题
    const AlipaySdk = require('alipay-sdk')
    alipaySdk = new AlipaySdk({
      appId: paymentConfig.alipay.appId,
      privateKey: paymentConfig.alipay.privateKey,
      alipayPublicKey: paymentConfig.alipay.alipayPublicKey,
      gateway: paymentConfig.alipay.gateway,
      signType: 'RSA2',
    })
  }

  return alipaySdk
}

/**
 * 创建支付宝电脑网站支付
 * @param orderNo 订单号
 * @param amount 金额
 * @param subject 订单标题
 * @param body 订单描述
 */
export async function createAlipayPagePay(
  orderNo: string,
  amount: number,
  subject: string,
  body: string
): Promise<string | null> {
  const sdk = await getAlipaySdk()
  if (!sdk) {
    throw new Error('支付宝未配置')
  }

  try {
    const result = await sdk.exec('alipay.trade.page.pay', {
      notify_url: paymentConfig.alipay.notifyUrl,
      return_url: paymentConfig.alipay.returnUrl,
      bizContent: {
        out_trade_no: orderNo,
        total_amount: amount.toFixed(2),
        subject: subject,
        body: body,
        product_code: 'FAST_INSTANT_TRADE_PAY',
      },
    })

    // 返回支付表单 HTML
    return result as string
  } catch (error) {
    console.error('创建支付宝支付失败:', error)
    throw error
  }
}

/**
 * 创建支付宝手机网站支付
 * @param orderNo 订单号
 * @param amount 金额
 * @param subject 订单标题
 * @param body 订单描述
 */
export async function createAlipayWapPay(
  orderNo: string,
  amount: number,
  subject: string,
  body: string
): Promise<string | null> {
  const sdk = await getAlipaySdk()
  if (!sdk) {
    throw new Error('支付宝未配置')
  }

  try {
    const result = await sdk.exec('alipay.trade.wap.pay', {
      notify_url: paymentConfig.alipay.notifyUrl,
      return_url: paymentConfig.alipay.returnUrl,
      bizContent: {
        out_trade_no: orderNo,
        total_amount: amount.toFixed(2),
        subject: subject,
        body: body,
        product_code: 'QUICK_WAP_WAY',
      },
    })

    return result as string
  } catch (error) {
    console.error('创建支付宝手机支付失败:', error)
    throw error
  }
}

/**
 * 验证支付宝回调签名
 * @param params 回调参数
 */
export async function verifyAlipayNotify(params: Record<string, any>): Promise<boolean> {
  const sdk = await getAlipaySdk()
  if (!sdk) {
    console.warn('支付宝未配置，跳过签名验证')
    return true // 开发环境跳过验证
  }

  try {
    return sdk.checkNotifySign(params)
  } catch (error) {
    console.error('验证支付宝签名失败:', error)
    return false
  }
}

/**
 * 查询支付宝订单状态
 * @param orderNo 订单号
 * @param tradeNo 支付宝交易号（可选）
 */
export async function queryAlipayOrder(
  orderNo: string,
  tradeNo?: string
): Promise<any> {
  const sdk = await getAlipaySdk()
  if (!sdk) {
    throw new Error('支付宝未配置')
  }

  try {
    const result = await sdk.exec('alipay.trade.query', {
      bizContent: {
        out_trade_no: orderNo,
        trade_no: tradeNo,
      },
    })

    return result
  } catch (error) {
    console.error('查询支付宝订单失败:', error)
    throw error
  }
}

/**
 * 关闭支付宝订单
 * @param orderNo 订单号
 * @param tradeNo 支付宝交易号（可选）
 */
export async function closeAlipayOrder(
  orderNo: string,
  tradeNo?: string
): Promise<any> {
  const sdk = await getAlipaySdk()
  if (!sdk) {
    throw new Error('支付宝未配置')
  }

  try {
    const result = await sdk.exec('alipay.trade.close', {
      bizContent: {
        out_trade_no: orderNo,
        trade_no: tradeNo,
      },
    })

    return result
  } catch (error) {
    console.error('关闭支付宝订单失败:', error)
    throw error
  }
}

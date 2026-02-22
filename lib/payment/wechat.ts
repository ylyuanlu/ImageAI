// 微信支付工具
import { paymentConfig, checkWechatConfig } from './config'

// 初始化微信支付 SDK
let wechatPay: any = null

export async function getWechatPay(): Promise<any> {
  if (!checkWechatConfig()) {
    console.warn('微信支付配置不完整，无法初始化')
    return null
  }

  if (!wechatPay) {
    // 使用 require 避免类型问题
    const WxPay = require('wechatpay-node-v3')
    wechatPay = new WxPay({
      appid: paymentConfig.wechat.appId,
      mchid: paymentConfig.wechat.mchId,
      private_key: paymentConfig.wechat.privateKey,
      serial_no: paymentConfig.wechat.serialNo,
      apiv3_private_key: paymentConfig.wechat.apiV3Key,
    })
  }

  return wechatPay
}

/**
 * 创建微信支付 Native 支付（扫码支付）
 * @param orderNo 订单号
 * @param amount 金额（元）
 * @param description 商品描述
 */
export async function createWechatNativePay(
  orderNo: string,
  amount: number,
  description: string
): Promise<{ codeUrl: string; prepayId: string } | null> {
  const wxpay = await getWechatPay()
  if (!wxpay) {
    throw new Error('微信支付未配置')
  }

  try {
    const result = await wxpay.transactions_native({
      description,
      out_trade_no: orderNo,
      notify_url: paymentConfig.wechat.notifyUrl,
      amount: {
        total: Math.round(amount * 100), // 转换为分
        currency: 'CNY',
      },
    })

    return {
      codeUrl: result.code_url,
      prepayId: result.prepay_id,
    }
  } catch (error) {
    console.error('创建微信支付失败:', error)
    throw error
  }
}

/**
 * 创建微信支付 JSAPI 支付（公众号/小程序）
 * @param orderNo 订单号
 * @param amount 金额（元）
 * @param description 商品描述
 * @param openId 用户 OpenID
 */
export async function createWechatJsapiPay(
  orderNo: string,
  amount: number,
  description: string,
  openId: string
): Promise<{ prepayId: string; appId: string; timeStamp: string; nonceStr: string; package: string; signType: string; paySign: string } | null> {
  const wxpay = await getWechatPay()
  if (!wxpay) {
    throw new Error('微信支付未配置')
  }

  try {
    const result = await wxpay.transactions_jsapi({
      description,
      out_trade_no: orderNo,
      notify_url: paymentConfig.wechat.notifyUrl,
      amount: {
        total: Math.round(amount * 100),
        currency: 'CNY',
      },
      payer: {
        openid: openId,
      },
    })

    // 生成前端调起支付所需的参数
    const timeStamp = Math.floor(Date.now() / 1000).toString()
    const nonceStr = generateNonceStr()
    const packageStr = `prepay_id=${result.prepay_id}`

    // 计算签名
    const signStr = `${paymentConfig.wechat.appId}\n${timeStamp}\n${nonceStr}\n${packageStr}\n`
    const paySign = wxpay.sign(signStr)

    return {
      prepayId: result.prepay_id,
      appId: paymentConfig.wechat.appId,
      timeStamp,
      nonceStr,
      package: packageStr,
      signType: 'RSA',
      paySign,
    }
  } catch (error) {
    console.error('创建微信支付失败:', error)
    throw error
  }
}

/**
 * 创建微信支付 H5 支付
 * @param orderNo 订单号
 * @param amount 金额（元）
 * @param description 商品描述
 * @param clientIp 客户端 IP
 */
export async function createWechatH5Pay(
  orderNo: string,
  amount: number,
  description: string,
  clientIp: string
): Promise<{ h5Url: string } | null> {
  const wxpay = await getWechatPay()
  if (!wxpay) {
    throw new Error('微信支付未配置')
  }

  try {
    const result = await wxpay.transactions_h5({
      description,
      out_trade_no: orderNo,
      notify_url: paymentConfig.wechat.notifyUrl,
      amount: {
        total: Math.round(amount * 100),
        currency: 'CNY',
      },
      scene_info: {
          payer_client_ip: clientIp,
          h5_info: {
            type: 'Wap',
            app_name: 'ImageAI',
            app_url: process.env.NEXT_PUBLIC_APP_URL || 'https://ai-shiyi.com',
          },
        },
    })

    return {
      h5Url: result.h5_url,
    }
  } catch (error) {
    console.error('创建微信支付 H5 失败:', error)
    throw error
  }
}

/**
 * 验证微信支付回调
 * @param headers 请求头
 * @param body 请求体
 */
export async function verifyWechatNotify(
  headers: Record<string, string>,
  body: string
): Promise<{ valid: boolean; data?: any }> {
  const wxpay = await getWechatPay()
  if (!wxpay) {
    console.warn('微信支付未配置，跳过验证')
    return { valid: true, data: JSON.parse(body) }
  }

  try {
    const result = await wxpay.verifySign(headers, body)
    return { valid: true, data: result }
  } catch (error) {
    console.error('验证微信支付签名失败:', error)
    return { valid: false }
  }
}

/**
 * 查询微信支付订单
 * @param orderNo 订单号
 */
export async function queryWechatOrder(orderNo: string): Promise<any> {
  const wxpay = await getWechatPay()
  if (!wxpay) {
    throw new Error('微信支付未配置')
  }

  try {
    const result = await wxpay.query({ out_trade_no: orderNo })
    return result
  } catch (error) {
    console.error('查询微信支付订单失败:', error)
    throw error
  }
}

/**
 * 关闭微信支付订单
 * @param orderNo 订单号
 */
export async function closeWechatOrder(orderNo: string): Promise<any> {
  const wxpay = await getWechatPay()
  if (!wxpay) {
    throw new Error('微信支付未配置')
  }

  try {
    const result = await wxpay.close({ out_trade_no: orderNo })
    return result
  } catch (error) {
    console.error('关闭微信支付订单失败:', error)
    throw error
  }
}

/**
 * 生成随机字符串
 */
function generateNonceStr(length: number = 32): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  let result = ''
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return result
}

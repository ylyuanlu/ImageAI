import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { authenticateRequest } from '@/lib/auth'
import { createAlipayPagePay, createAlipayWapPay } from '@/lib/payment/alipay'
import { createWechatNativePay, createWechatH5Pay } from '@/lib/payment/wechat'
import { checkAlipayConfig, checkWechatConfig } from '@/lib/payment/config'
import { headers } from 'next/headers'

/**
 * 创建支付
 * POST /api/payment/pay
 * Body: { orderId: string, payMethod: 'ALIPAY' | 'WECHAT', deviceType?: 'pc' | 'mobile' | 'wap' }
 */
export async function POST(request: NextRequest) {
  try {
    // 验证用户
    const authResult = await authenticateRequest(request)
    if (!authResult.success) {
      return NextResponse.json(
        { error: authResult.error || '请先登录' },
        { status: authResult.status || 401 }
      )
    }
    const user = authResult.user!

    const body = await request.json()
    const { orderId, payMethod, deviceType = 'pc' } = body

    if (!orderId || !payMethod || !['ALIPAY', 'WECHAT'].includes(payMethod)) {
      return NextResponse.json(
        { error: '参数错误' },
        { status: 400 }
      )
    }

    // 查找订单
    const order = await prisma.order.findFirst({
      where: {
        id: orderId,
        userId: user.userId,
        payStatus: 'PENDING',
        expireAt: {
          gt: new Date()
        }
      },
      include: {
        membership: true
      }
    })

    if (!order) {
      return NextResponse.json(
        { error: '订单不存在或已过期' },
        { status: 404 }
      )
    }

    // 创建支付记录
    const payment = await prisma.payment.create({
      data: {
        orderId: order.id,
        userId: user.userId,
        amount: order.amount,
        currency: order.currency,
        payMethod,
        status: 'PENDING',
        payData: JSON.stringify({
          orderNo: order.orderNo,
          amount: order.amount,
          payMethod,
          deviceType
        })
      }
    })

    // 根据支付方式创建支付
    let payData: any = null

    if (payMethod === 'ALIPAY') {
      // 检查支付宝配置
      if (!checkAlipayConfig()) {
        // 开发环境使用模拟支付
        if (process.env.NODE_ENV === 'development') {
          return NextResponse.json({
            message: '支付创建成功（模拟）',
            payment: {
              id: payment.id,
              amount: payment.amount,
              payMethod: payment.payMethod,
              status: payment.status
            },
            mockPayUrl: `/api/payment/mock?paymentId=${payment.id}&orderId=${order.id}`
          })
        }
        return NextResponse.json(
          { error: '支付宝支付未配置' },
          { status: 500 }
        )
      }

      // 创建支付宝支付
      const subject = order.type === 'MEMBERSHIP' 
        ? `ImageAI ${order.membership?.name || '会员'}`
        : 'ImageAI 额度充值'
      const body = `订单号: ${order.orderNo}`

      if (deviceType === 'mobile' || deviceType === 'wap') {
        // 手机网站支付
        const form = await createAlipayWapPay(order.orderNo, order.amount, subject, body)
        payData = { type: 'form', form }
      } else {
        // 电脑网站支付
        const form = await createAlipayPagePay(order.orderNo, order.amount, subject, body)
        payData = { type: 'form', form }
      }

    } else if (payMethod === 'WECHAT') {
      // 检查微信支付配置
      if (!checkWechatConfig()) {
        // 开发环境使用模拟支付
        if (process.env.NODE_ENV === 'development') {
          return NextResponse.json({
            message: '支付创建成功（模拟）',
            payment: {
              id: payment.id,
              amount: payment.amount,
              payMethod: payment.payMethod,
              status: payment.status
            },
            mockPayUrl: `/api/payment/mock?paymentId=${payment.id}&orderId=${order.id}`
          })
        }
        return NextResponse.json(
          { error: '微信支付未配置' },
          { status: 500 }
        )
      }

      // 创建微信支付
      const description = order.type === 'MEMBERSHIP'
        ? `ImageAI ${order.membership?.name || '会员'}`
        : 'ImageAI 额度充值'

      if (deviceType === 'pc') {
        // Native 支付（扫码）
        const result = await createWechatNativePay(order.orderNo, order.amount, description)
        payData = { type: 'qrcode', codeUrl: result?.codeUrl }
      } else {
        // H5 支付
        const headersList = await headers()
        const clientIp = headersList.get('x-forwarded-for') || '127.0.0.1'
        const result = await createWechatH5Pay(order.orderNo, order.amount, description, clientIp)
        payData = { type: 'h5', h5Url: result?.h5Url }
      }
    }

    // 更新支付记录
    await prisma.payment.update({
      where: { id: payment.id },
      data: {
        payData: JSON.stringify({
          ...JSON.parse(payment.payData || '{}'),
          ...payData
        })
      }
    })

    return NextResponse.json({
      message: '支付创建成功',
      payment: {
        id: payment.id,
        amount: payment.amount,
        payMethod: payment.payMethod,
        status: payment.status
      },
      payData
    })

  } catch (error) {
    console.error('创建支付错误:', error)
    return NextResponse.json(
      { error: '创建支付失败' },
      { status: 500 }
    )
  }
}

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyWechatNotify } from '@/lib/payment/wechat'

/**
 * 微信支付回调
 * POST /api/payment/wechat/notify
 */
export async function POST(request: NextRequest) {
  try {
    // 获取回调数据
    const body = await request.text()
    const headersList = Object.fromEntries(request.headers.entries())

    console.log('微信支付回调数据:', body)

    // 验证签名
    const { valid, data } = await verifyWechatNotify(headersList, body)
    if (!valid) {
      console.error('微信支付签名验证失败')
      return new Response(
        '<xml><return_code><![CDATA[FAIL]]></return_code><return_msg><![CDATA[签名验证失败]]></return_msg></xml>',
        { status: 400, headers: { 'Content-Type': 'application/xml' } }
      )
    }

    // 解析回调数据
    const notifyData = typeof data === 'string' ? JSON.parse(data) : data
    const orderNo = notifyData.out_trade_no
    const tradeNo = notifyData.transaction_id
    const tradeState = notifyData.trade_state || 'SUCCESS'
    const totalAmount = notifyData.amount?.total / 100 // 分转元

    // 查找订单
    const order = await prisma.order.findUnique({
      where: { orderNo },
      include: { membership: true }
    })

    if (!order) {
      console.error('订单不存在:', orderNo)
      return new Response(
        '<xml><return_code><![CDATA[FAIL]]></return_code><return_msg><![CDATA[订单不存在]]></return_msg></xml>',
        { status: 400, headers: { 'Content-Type': 'application/xml' } }
      )
    }

    // 验证金额
    if (Math.abs(order.amount - totalAmount) > 0.01) {
      console.error('金额不匹配:', order.amount, totalAmount)
      return new Response(
        '<xml><return_code><![CDATA[FAIL]]></return_code><return_msg><![CDATA[金额不匹配]]></return_msg></xml>',
        { status: 400, headers: { 'Content-Type': 'application/xml' } }
      )
    }

    // 处理支付成功
    if (tradeState === 'SUCCESS') {
      // 查找支付记录
      const payment = await prisma.payment.findFirst({
        where: {
          orderId: order.id,
          payMethod: 'WECHAT',
          status: 'PENDING'
        }
      })

      if (!payment) {
        console.error('支付记录不存在')
        return new Response(
          '<xml><return_code><![CDATA[SUCCESS]]></return_code><return_msg><![CDATA[OK]]></return_msg></xml>',
          { headers: { 'Content-Type': 'application/xml' } }
        )
      }

      // 处理支付成功
      await prisma.$transaction(async (tx) => {
        // 更新支付记录
        await tx.payment.update({
          where: { id: payment.id },
          data: {
            status: 'SUCCESS',
            paidAt: new Date(),
            payTradeNo: tradeNo,
            notifyData: JSON.stringify(notifyData)
          }
        })

        // 更新订单状态
        await tx.order.update({
          where: { id: order.id },
          data: {
            payStatus: 'PAID',
            status: 'COMPLETED',
            payTime: new Date(),
            payTradeNo: tradeNo
          }
        })

        // 更新用户额度和会员信息
        if (order.type === 'MEMBERSHIP' && order.membership) {
          // 会员订单 - 更新订阅信息
          const now = new Date()
          const endDate = new Date(now)
          endDate.setMonth(endDate.getMonth() + (order.duration || 1))

          await tx.subscription.upsert({
            where: { userId: order.userId },
            update: {
              plan: order.membership.level,
              status: 'ACTIVE',
              currentPeriodStart: now,
              currentPeriodEnd: endDate,
              cancelAtPeriodEnd: false
            },
            create: {
              userId: order.userId,
              plan: order.membership.level,
              status: 'ACTIVE',
              currentPeriodStart: now,
              currentPeriodEnd: endDate
            }
          })

          // 更新用户角色
          await tx.user.update({
            where: { id: order.userId },
            data: { role: 'VIP' }
          })

          // 更新额度
          await tx.quota.update({
            where: { userId: order.userId },
            data: {
              paidQuota: order.membership.monthlyQuota,
              paidQuotaUsed: 0,
              totalQuota: {
                increment: order.membership.monthlyQuota
              },
              remainingQuota: {
                increment: order.membership.monthlyQuota
              }
            }
          })
        } else if (order.type === 'QUOTA' && order.quotaAmount) {
          // 额度充值订单
          await tx.quota.update({
            where: { userId: order.userId },
            data: {
              extraQuota: {
                increment: order.quotaAmount
              },
              totalQuota: {
                increment: order.quotaAmount
              },
              remainingQuota: {
                increment: order.quotaAmount
              }
            }
          })
        }
      })

      console.log('微信支付处理成功:', orderNo)
    }

    // 返回成功响应
    return new Response(
      '<xml><return_code><![CDATA[SUCCESS]]></return_code><return_msg><![CDATA[OK]]></return_msg></xml>',
      { headers: { 'Content-Type': 'application/xml' } }
    )

  } catch (error) {
    console.error('微信支付回调处理错误:', error)
    return new Response(
      '<xml><return_code><![CDATA[FAIL]]></return_code><return_msg><![CDATA[处理失败]]></return_msg></xml>',
      { status: 500, headers: { 'Content-Type': 'application/xml' } }
    )
  }
}

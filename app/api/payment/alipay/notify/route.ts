import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyAlipayNotify } from '@/lib/payment/alipay'

/**
 * 支付宝支付回调
 * POST /api/payment/alipay/notify
 */
export async function POST(request: NextRequest) {
  try {
    // 获取回调数据
    const formData = await request.formData()
    const params: Record<string, any> = {}
    formData.forEach((value, key) => {
      params[key] = value
    })

    console.log('支付宝回调数据:', params)

    // 验证签名
    const isValid = await verifyAlipayNotify(params)
    if (!isValid) {
      console.error('支付宝签名验证失败')
      return new Response('fail', { status: 400 })
    }

    // 获取订单信息
    const orderNo = params.out_trade_no
    const tradeNo = params.trade_no
    const tradeStatus = params.trade_status
    const totalAmount = parseFloat(params.total_amount)

    // 查找订单
    const order = await prisma.order.findUnique({
      where: { orderNo },
      include: { membership: true }
    })

    if (!order) {
      console.error('订单不存在:', orderNo)
      return new Response('fail', { status: 400 })
    }

    // 验证金额
    if (Math.abs(order.amount - totalAmount) > 0.01) {
      console.error('金额不匹配:', order.amount, totalAmount)
      return new Response('fail', { status: 400 })
    }

    // 处理支付成功
    if (tradeStatus === 'TRADE_SUCCESS' || tradeStatus === 'TRADE_FINISHED') {
      // 查找支付记录
      const payment = await prisma.payment.findFirst({
        where: {
          orderId: order.id,
          payMethod: 'ALIPAY',
          status: 'PENDING'
        }
      })

      if (!payment) {
        console.error('支付记录不存在')
        return new Response('success')
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
            notifyData: JSON.stringify(params)
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

      console.log('支付宝支付处理成功:', orderNo)
    }

    // 返回 success 告诉支付宝处理成功
    return new Response('success')

  } catch (error) {
    console.error('支付宝回调处理错误:', error)
    return new Response('fail', { status: 500 })
  }
}

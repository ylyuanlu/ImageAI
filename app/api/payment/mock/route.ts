import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

/**
 * 模拟支付回调（开发环境使用）
 * GET /api/payment/mock?paymentId=xxx&orderId=xxx
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const paymentId = searchParams.get('paymentId')
    const orderId = searchParams.get('orderId')

    if (!paymentId || !orderId) {
      return NextResponse.json(
        { error: '参数错误' },
        { status: 400 }
      )
    }

    // 查找支付记录
    const payment = await prisma.payment.findUnique({
      where: { id: paymentId }
    })

    if (!payment || payment.status !== 'PENDING') {
      return NextResponse.json(
        { error: '支付记录不存在或已处理' },
        { status: 400 }
      )
    }

    // 查找订单
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: { membership: true }
    })

    if (!order || order.payStatus !== 'PENDING') {
      return NextResponse.json(
        { error: '订单不存在或已处理' },
        { status: 400 }
      )
    }

    // 模拟支付成功处理
    await prisma.$transaction(async (tx) => {
      // 更新支付记录
      await tx.payment.update({
        where: { id: paymentId },
        data: {
          status: 'SUCCESS',
          paidAt: new Date(),
          payTradeNo: `MOCK${Date.now()}`,
          notifyData: JSON.stringify({ mock: true, time: Date.now() })
        }
      })

      // 更新订单状态
      await tx.order.update({
        where: { id: orderId },
        data: {
          payStatus: 'PAID',
          status: 'COMPLETED',
          payTime: new Date(),
          payTradeNo: `MOCK${Date.now()}`
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

    return NextResponse.json({
      message: '支付成功',
      orderId,
      paymentId
    })

  } catch (error) {
    console.error('模拟支付错误:', error)
    return NextResponse.json(
      { error: '支付处理失败' },
      { status: 500 }
    )
  }
}

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { authenticateRequest } from '@/lib/auth'
import crypto from 'crypto'

/**
 * 创建订单
 * POST /api/order/create
 * Body: { type: 'MEMBERSHIP' | 'QUOTA', membershipId?: string, duration?: number, quotaAmount?: number }
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
    const { type, membershipId, duration = 1, quotaAmount } = body

    // 验证参数
    if (!type || !['MEMBERSHIP', 'QUOTA'].includes(type)) {
      return NextResponse.json(
        { error: '无效的订单类型' },
        { status: 400 }
      )
    }

    let amount = 0
    let orderData: any = {
      type,
      userId: user.userId,
      payStatus: 'PENDING',
      status: 'PENDING',
      expireAt: new Date(Date.now() + 30 * 60 * 1000) // 30分钟后过期
    }

    if (type === 'MEMBERSHIP') {
      // 会员订单
      if (!membershipId) {
        return NextResponse.json(
          { error: '请选择会员等级' },
          { status: 400 }
        )
      }

      const membership = await prisma.membershipLevel.findUnique({
        where: { id: membershipId, isActive: true }
      })

      if (!membership) {
        return NextResponse.json(
          { error: '会员等级不存在' },
          { status: 404 }
        )
      }

      // 计算价格（年费有优惠）
      amount = duration === 12 ? membership.yearlyPrice : membership.price * duration

      orderData.membershipId = membershipId
      orderData.duration = duration
      orderData.amount = amount

    } else if (type === 'QUOTA') {
      // 额度充值订单
      if (!quotaAmount || quotaAmount < 10) {
        return NextResponse.json(
          { error: '充值额度至少为10' },
          { status: 400 }
        )
      }

      // 额度价格：1元 = 5次生成
      const pricePerQuota = 0.2
      amount = Math.round(quotaAmount * pricePerQuota * 100) / 100

      orderData.quotaAmount = quotaAmount
      orderData.amount = amount
    }

    // 生成订单号
    const orderNo = `ORD${Date.now()}${crypto.randomBytes(4).toString('hex').toUpperCase()}`
    orderData.orderNo = orderNo

    // 创建订单
    const order = await prisma.order.create({
      data: orderData
    })

    return NextResponse.json({
      message: '订单创建成功',
      order: {
        id: order.id,
        orderNo: order.orderNo,
        type: order.type,
        amount: order.amount,
        currency: order.currency,
        status: order.status,
        payStatus: order.payStatus,
        expireAt: order.expireAt
      }
    })

  } catch (error) {
    console.error('创建订单错误:', error)
    return NextResponse.json(
      { error: '创建订单失败' },
      { status: 500 }
    )
  }
}

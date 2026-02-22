import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { authenticateRequest } from '@/lib/auth'

/**
 * 获取用户订单列表
 * GET /api/order/list?page=1&limit=10
 */
export async function GET(request: NextRequest) {
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

    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')

    // 查询订单
    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where: { userId: user.userId },
        include: {
          membership: {
            select: {
              name: true,
              level: true
            }
          }
        },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit
      }),
      prisma.order.count({
        where: { userId: user.userId }
      })
    ])

    return NextResponse.json({
      orders,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    })

  } catch (error) {
    console.error('获取订单列表错误:', error)
    return NextResponse.json(
      { error: '获取订单列表失败' },
      { status: 500 }
    )
  }
}

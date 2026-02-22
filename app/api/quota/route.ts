import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { authenticateRequest } from '@/lib/auth'

/**
 * 获取用户额度信息
 * GET /api/quota
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

    // 获取或创建用户额度
    let quota = await prisma.quota.findUnique({
      where: { userId: user.userId }
    })

    if (!quota) {
      // 创建默认额度
      quota = await prisma.quota.create({
        data: {
          userId: user.userId,
          freeQuota: 5,
          freeQuotaUsed: 0,
          paidQuota: 0,
          paidQuotaUsed: 0,
          extraQuota: 0,
          extraQuotaUsed: 0,
          totalQuota: 5,
          remainingQuota: 5
        }
      })
    }

    return NextResponse.json({
      quota: {
        freeQuota: quota.freeQuota,
        freeQuotaUsed: quota.freeQuotaUsed,
        paidQuota: quota.paidQuota,
        paidQuotaUsed: quota.paidQuotaUsed,
        extraQuota: quota.extraQuota,
        extraQuotaUsed: quota.extraQuotaUsed,
        totalQuota: quota.totalQuota,
        remainingQuota: quota.remainingQuota,
        resetAt: quota.resetAt
      }
    })

  } catch (error) {
    console.error('获取额度错误:', error)
    return NextResponse.json(
      { error: '获取额度失败' },
      { status: 500 }
    )
  }
}

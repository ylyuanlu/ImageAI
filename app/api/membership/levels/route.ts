import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

/**
 * 获取会员等级列表
 * GET /api/membership/levels
 */
export async function GET(request: NextRequest) {
  try {
    const levels = await prisma.membershipLevel.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: 'asc' }
    })

    // 解析 features JSON
    const formattedLevels = levels.map(level => ({
      ...level,
      features: JSON.parse(level.features)
    }))

    return NextResponse.json({
      levels: formattedLevels
    })

  } catch (error) {
    console.error('获取会员等级错误:', error)
    return NextResponse.json(
      { error: '获取会员等级失败' },
      { status: 500 }
    )
  }
}

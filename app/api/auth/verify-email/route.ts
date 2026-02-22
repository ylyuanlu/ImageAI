import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

/**
 * 验证邮箱
 * GET /api/auth/verify-email?token=xxx
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const token = searchParams.get('token')

    if (!token) {
      return NextResponse.json(
        { error: '缺少验证令牌' },
        { status: 400 }
      )
    }

    // 查找用户
    const user = await prisma.user.findFirst({
      where: {
        emailVerificationToken: token,
        emailVerificationExpires: {
          gt: new Date() // 令牌未过期
        }
      }
    })

    if (!user) {
      return NextResponse.json(
        { error: '验证令牌无效或已过期' },
        { status: 400 }
      )
    }

    // 更新用户邮箱验证状态
    await prisma.user.update({
      where: { id: user.id },
      data: {
        emailVerified: true,
        emailVerificationToken: null,
        emailVerificationExpires: null
      }
    })

    return NextResponse.json({
      message: '邮箱验证成功',
      email: user.email
    })

  } catch (error) {
    console.error('邮箱验证错误:', error)
    return NextResponse.json(
      { error: '验证失败，请稍后重试' },
      { status: 500 }
    )
  }
}

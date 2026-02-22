import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { hashPassword } from '@/lib/auth'

/**
 * 重置密码
 * POST /api/auth/reset-password
 * Body: { token: string, password: string }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { token, password } = body

    // 验证输入
    if (!token || !password) {
      return NextResponse.json(
        { error: '缺少必要参数' },
        { status: 400 }
      )
    }

    // 验证密码长度
    if (password.length < 6) {
      return NextResponse.json(
        { error: '密码长度至少为6位' },
        { status: 400 }
      )
    }

    // 查找用户
    const user = await prisma.user.findFirst({
      where: {
        passwordResetToken: token,
        passwordResetExpires: {
          gt: new Date() // 令牌未过期
        }
      }
    })

    if (!user) {
      return NextResponse.json(
        { error: '重置令牌无效或已过期' },
        { status: 400 }
      )
    }

    // 加密新密码
    const hashedPassword = await hashPassword(password)

    // 更新密码并清除重置令牌
    await prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        passwordResetToken: null,
        passwordResetExpires: null
      }
    })

    return NextResponse.json({
      message: '密码重置成功，请使用新密码登录'
    })

  } catch (error) {
    console.error('重置密码错误:', error)
    return NextResponse.json(
      { error: '重置失败，请稍后重试' },
      { status: 500 }
    )
  }
}

/**
 * 验证重置令牌是否有效
 * GET /api/auth/reset-password?token=xxx
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const token = searchParams.get('token')

    if (!token) {
      return NextResponse.json(
        { error: '缺少重置令牌' },
        { status: 400 }
      )
    }

    // 查找用户
    const user = await prisma.user.findFirst({
      where: {
        passwordResetToken: token,
        passwordResetExpires: {
          gt: new Date()
        }
      }
    })

    if (!user) {
      return NextResponse.json(
        { error: '重置令牌无效或已过期' },
        { status: 400 }
      )
    }

    return NextResponse.json({
      valid: true,
      email: user.email
    })

  } catch (error) {
    console.error('验证重置令牌错误:', error)
    return NextResponse.json(
      { error: '验证失败' },
      { status: 500 }
    )
  }
}

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import crypto from 'crypto'

/**
 * 发送密码重置邮件
 * POST /api/auth/forgot-password
 * Body: { email: string }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email } = body

    // 验证输入
    if (!email) {
      return NextResponse.json(
        { error: '请输入邮箱地址' },
        { status: 400 }
      )
    }

    // 查找用户
    const user = await prisma.user.findUnique({
      where: { email }
    })

    // 即使用户不存在，也返回成功（安全考虑）
    if (!user) {
      return NextResponse.json({
        message: '如果该邮箱已注册，我们将发送密码重置链接'
      })
    }

    // 生成重置令牌
    const resetToken = crypto.randomBytes(32).toString('hex')
    const resetExpires = new Date(Date.now() + 3600000) // 1小时后过期

    // 保存重置令牌
    await prisma.user.update({
      where: { id: user.id },
      data: {
        passwordResetToken: resetToken,
        passwordResetExpires: resetExpires
      }
    })

    // TODO: 发送重置邮件
    // 在开发环境中，我们直接返回令牌
    const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/reset-password?token=${resetToken}`

    console.log('密码重置链接:', resetUrl)

    return NextResponse.json({
      message: '密码重置链接已发送到您的邮箱',
      // 开发环境下返回链接，生产环境应该发送邮件
      resetUrl: process.env.NODE_ENV === 'development' ? resetUrl : undefined,
      resetToken: process.env.NODE_ENV === 'development' ? resetToken : undefined
    })

  } catch (error) {
    console.error('忘记密码错误:', error)
    return NextResponse.json(
      { error: '请求失败，请稍后重试' },
      { status: 500 }
    )
  }
}

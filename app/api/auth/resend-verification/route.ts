import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { authenticateRequest } from '@/lib/auth'
import { sendVerificationEmail, isEmailConfigured } from '@/lib/email'
import crypto from 'crypto'

/**
 * 重新发送验证邮件
 * POST /api/auth/resend-verification
 * Cookie: token=<jwt_token>
 */
export async function POST(request: NextRequest) {
  try {
    // 验证用户（从 Cookie 获取 token）
    const auth = await authenticateRequest(request)
    
    if (!auth.success) {
      return NextResponse.json(
        { error: auth.error },
        { status: auth.status }
      )
    }

    // 查找用户
    const user = await prisma.user.findUnique({
      where: { id: auth.user!.userId }
    })

    if (!user) {
      return NextResponse.json(
        { error: '用户不存在' },
        { status: 404 }
      )
    }

    // 检查邮箱是否已验证
    if (user.emailVerified) {
      return NextResponse.json(
        { error: '邮箱已验证' },
        { status: 400 }
      )
    }

    // 生成新的验证令牌
    const verificationToken = crypto.randomBytes(32).toString('hex')
    const verificationExpires = new Date(Date.now() + 24 * 3600000) // 24小时后过期

    // 更新用户
    await prisma.user.update({
      where: { id: user.id },
      data: {
        emailVerificationToken: verificationToken,
        emailVerificationExpires: verificationExpires
      }
    })

    // 生成验证链接
    const verificationUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/verify-email?token=${verificationToken}`

    // 发送验证邮件
    let emailSent = false
    if (isEmailConfigured()) {
      const emailResult = await sendVerificationEmail(user.email, user.username, verificationUrl)
      emailSent = emailResult.success
      if (!emailResult.success) {
        console.error('发送验证邮件失败:', emailResult.error)
      }
    } else {
      console.log('邮件服务未配置，验证链接:', verificationUrl)
    }

    return NextResponse.json({
      message: emailSent 
        ? '验证邮件已发送，请检查邮箱' 
        : '验证邮件已发送（开发模式：验证链接已打印到控制台）',
      // 开发环境下或邮件发送失败时返回链接
      verificationUrl: (!emailSent || process.env.NODE_ENV === 'development') ? verificationUrl : undefined
    })

  } catch (error) {
    console.error('重新发送验证邮件错误:', error)
    return NextResponse.json(
      { error: '发送失败，请稍后重试' },
      { status: 500 }
    )
  }
}

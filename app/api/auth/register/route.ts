import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { hashPassword, generateToken } from '@/lib/auth'
import { sendVerificationEmail, isEmailConfigured } from '@/lib/email'
import crypto from 'crypto'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, username, password } = body

    // 验证输入
    if (!email || !username || !password) {
      return NextResponse.json(
        { error: '请填写所有必填字段' },
        { status: 400 }
      )
    }

    // 验证邮箱格式
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: '请输入有效的邮箱地址' },
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

    // 验证用户名长度
    if (username.length < 3 || username.length > 30) {
      return NextResponse.json(
        { error: '用户名长度应为3-30个字符' },
        { status: 400 }
      )
    }

    // 检查邮箱是否已存在
    const existingEmail = await prisma.user.findUnique({
      where: { email }
    })

    if (existingEmail) {
      return NextResponse.json(
        { error: '该邮箱已被注册' },
        { status: 409 }
      )
    }

    // 检查用户名是否已存在
    const existingUsername = await prisma.user.findUnique({
      where: { username }
    })

    if (existingUsername) {
      return NextResponse.json(
        { error: '该用户名已被使用' },
        { status: 409 }
      )
    }

    // 加密密码
    const hashedPassword = await hashPassword(password)

    // 生成邮箱验证令牌
    const verificationToken = crypto.randomBytes(32).toString('hex')
    const verificationExpires = new Date(Date.now() + 24 * 3600000) // 24小时后过期

    // 创建用户
    const user = await prisma.user.create({
      data: {
        email,
        username,
        password: hashedPassword,
        emailVerificationToken: verificationToken,
        emailVerificationExpires: verificationExpires,
      }
    })

    // 创建用户额度记录
    await prisma.quota.create({
      data: {
        userId: user.id,
        freeQuota: 5,
        freeQuotaUsed: 0,
        totalQuota: 5,
        remainingQuota: 5,
      }
    })

    // 生成 JWT Token
    const token = generateToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    })

    // 生成验证链接
    const verificationUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/verify-email?token=${verificationToken}`

    // 发送验证邮件
    let emailSent = false
    if (isEmailConfigured()) {
      const emailResult = await sendVerificationEmail(email, username, verificationUrl)
      emailSent = emailResult.success
      if (!emailResult.success) {
        console.error('发送验证邮件失败:', emailResult.error)
      }
    } else {
      console.log('邮件服务未配置，验证链接:', verificationUrl)
    }

    // 返回用户信息（不包含密码）
    const { password: _, ...userWithoutPassword } = user

    return NextResponse.json({
      message: emailSent 
        ? '注册成功，验证邮件已发送，请检查邮箱完成验证' 
        : '注册成功，请检查邮箱完成验证（开发模式：验证链接已打印到控制台）',
      user: userWithoutPassword,
      token,
      // 开发环境下或邮件发送失败时返回验证链接
      verificationUrl: (!emailSent || process.env.NODE_ENV === 'development') ? verificationUrl : undefined,
    }, {
      status: 201,
      headers: {
        'Set-Cookie': `token=${token}; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=604800`
      }
    })

  } catch (error) {
    console.error('注册错误:', error)
    return NextResponse.json(
      { error: '注册失败，请稍后重试' },
      { status: 500 }
    )
  }
}

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { authenticateRequest, hashPassword, verifyPassword } from '@/lib/auth'

/**
 * 获取个人资料
 * GET /api/auth/profile
 */
export async function GET(request: NextRequest) {
  try {
    // 验证用户
    const auth = await authenticateRequest(request)
    
    if (!auth.success) {
      return NextResponse.json(
        { error: auth.error },
        { status: auth.status }
      )
    }

    // 获取用户详细信息
    const user = await prisma.user.findUnique({
      where: { id: auth.user!.userId },
      include: {
        subscription: true,
        quota: true,
      }
    })

    if (!user) {
      return NextResponse.json(
        { error: '用户不存在' },
        { status: 404 }
      )
    }

    // 返回用户信息（不包含密码）
    const { password: _, ...userWithoutPassword } = user

    return NextResponse.json({
      user: userWithoutPassword,
    })

  } catch (error) {
    console.error('获取个人资料错误:', error)
    return NextResponse.json(
      { error: '获取个人资料失败' },
      { status: 500 }
    )
  }
}

/**
 * 更新个人资料
 * PUT /api/auth/profile
 * Body: { username?: string, avatar?: string }
 */
export async function PUT(request: NextRequest) {
  try {
    // 验证用户
    const auth = await authenticateRequest(request)
    
    if (!auth.success) {
      return NextResponse.json(
        { error: auth.error },
        { status: auth.status }
      )
    }

    const body = await request.json()
    const { username, avatar } = body

    // 验证用户名
    if (username !== undefined) {
      if (username.length < 3 || username.length > 30) {
        return NextResponse.json(
          { error: '用户名长度应为3-30个字符' },
          { status: 400 }
        )
      }

      // 检查用户名是否已被其他用户使用
      const existingUser = await prisma.user.findUnique({
        where: { username }
      })

      if (existingUser && existingUser.id !== auth.user!.userId) {
        return NextResponse.json(
          { error: '该用户名已被使用' },
          { status: 409 }
        )
      }
    }

    // 更新用户信息
    const updateData: any = {}
    if (username !== undefined) updateData.username = username
    if (avatar !== undefined) updateData.avatar = avatar

    const user = await prisma.user.update({
      where: { id: auth.user!.userId },
      data: updateData,
      include: {
        subscription: true,
        quota: true,
      }
    })

    // 返回更新后的用户信息（不包含密码）
    const { password: _, ...userWithoutPassword } = user

    return NextResponse.json({
      message: '个人资料更新成功',
      user: userWithoutPassword,
    })

  } catch (error) {
    console.error('更新个人资料错误:', error)
    return NextResponse.json(
      { error: '更新个人资料失败' },
      { status: 500 }
    )
  }
}

/**
 * 修改密码
 * POST /api/auth/profile/change-password
 * Body: { currentPassword: string, newPassword: string }
 */
export async function POST(request: NextRequest) {
  try {
    // 验证用户
    const auth = await authenticateRequest(request)
    
    if (!auth.success) {
      return NextResponse.json(
        { error: auth.error },
        { status: auth.status }
      )
    }

    const body = await request.json()
    const { currentPassword, newPassword } = body

    // 验证输入
    if (!currentPassword || !newPassword) {
      return NextResponse.json(
        { error: '请填写当前密码和新密码' },
        { status: 400 }
      )
    }

    // 验证新密码长度
    if (newPassword.length < 6) {
      return NextResponse.json(
        { error: '新密码长度至少为6位' },
        { status: 400 }
      )
    }

    // 获取用户信息
    const user = await prisma.user.findUnique({
      where: { id: auth.user!.userId }
    })

    if (!user) {
      return NextResponse.json(
        { error: '用户不存在' },
        { status: 404 }
      )
    }

    // 验证当前密码
    const isValidPassword = await verifyPassword(currentPassword, user.password)

    if (!isValidPassword) {
      return NextResponse.json(
        { error: '当前密码错误' },
        { status: 401 }
      )
    }

    // 加密新密码
    const hashedPassword = await hashPassword(newPassword)

    // 更新密码
    await prisma.user.update({
      where: { id: auth.user!.userId },
      data: { password: hashedPassword }
    })

    return NextResponse.json({
      message: '密码修改成功',
    })

  } catch (error) {
    console.error('修改密码错误:', error)
    return NextResponse.json(
      { error: '修改密码失败' },
      { status: 500 }
    )
  }
}

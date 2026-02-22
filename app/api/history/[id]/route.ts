import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { authenticateRequest } from '@/lib/auth'

interface RouteParams {
  params: Promise<{ id: string }>
}

// 获取单个历史记录
export async function GET(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    // 验证用户
    const auth = await authenticateRequest(request)
    
    if (!auth.success) {
      return NextResponse.json(
        { error: auth.error },
        { status: auth.status }
      )
    }

    const { id } = await params

    const generation = await prisma.generation.findFirst({
      where: {
        id,
        userId: auth.user!.userId,
      }
    })

    if (!generation) {
      return NextResponse.json(
        { error: '记录不存在' },
        { status: 404 }
      )
    }

    return NextResponse.json({ generation })

  } catch (error) {
    console.error('获取历史记录详情错误:', error)
    return NextResponse.json(
      { error: '获取历史记录详情失败' },
      { status: 500 }
    )
  }
}

// 删除历史记录
export async function DELETE(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    // 验证用户
    const auth = await authenticateRequest(request)
    
    if (!auth.success) {
      return NextResponse.json(
        { error: auth.error },
        { status: auth.status }
      )
    }

    const { id } = await params

    // 检查记录是否存在且属于当前用户
    const generation = await prisma.generation.findFirst({
      where: {
        id,
        userId: auth.user!.userId,
      }
    })

    if (!generation) {
      return NextResponse.json(
        { error: '记录不存在' },
        { status: 404 }
      )
    }

    // 删除记录
    await prisma.generation.delete({
      where: { id }
    })

    return NextResponse.json({
      message: '记录删除成功',
    })

  } catch (error) {
    console.error('删除历史记录错误:', error)
    return NextResponse.json(
      { error: '删除历史记录失败' },
      { status: 500 }
    )
  }
}

// 更新历史记录（主要用于重新生成）
export async function PUT(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    // 验证用户
    const auth = await authenticateRequest(request)
    
    if (!auth.success) {
      return NextResponse.json(
        { error: auth.error },
        { status: auth.status }
      )
    }

    const { id } = await params
    const body = await request.json()

    // 检查记录是否存在且属于当前用户
    const existingGeneration = await prisma.generation.findFirst({
      where: {
        id,
        userId: auth.user!.userId,
      }
    })

    if (!existingGeneration) {
      return NextResponse.json(
        { error: '记录不存在' },
        { status: 404 }
      )
    }

    // 更新记录
    const generation = await prisma.generation.update({
      where: { id },
      data: {
        ...body,
        updatedAt: new Date(),
      }
    })

    return NextResponse.json({
      message: '记录更新成功',
      generation,
    })

  } catch (error) {
    console.error('更新历史记录错误:', error)
    return NextResponse.json(
      { error: '更新历史记录失败' },
      { status: 500 }
    )
  }
}

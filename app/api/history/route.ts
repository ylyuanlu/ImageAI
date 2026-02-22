import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { authenticateRequest } from '@/lib/auth'

// 获取历史记录列表
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

    console.log('获取历史记录 - 用户ID:', auth.user?.userId)

    // 获取查询参数
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const sortBy = searchParams.get('sortBy') || 'createdAt'
    const sortOrder = searchParams.get('sortOrder') || 'desc'

    // 计算分页
    const skip = (page - 1) * limit

    // 获取历史记录
    const generations = await prisma.generation.findMany({
      where: { userId: auth.user!.userId },
      orderBy: { [sortBy]: sortOrder },
      skip,
      take: limit,
    })

    // 获取总数
    const total = await prisma.generation.count({
      where: { userId: auth.user!.userId }
    })

    console.log(`获取历史记录成功 - 用户ID: ${auth.user?.userId}, 记录数: ${generations.length}, 总数: ${total}`)

    return NextResponse.json({
      generations,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      }
    })

  } catch (error) {
    console.error('获取历史记录错误:', error)
    return NextResponse.json(
      { error: '获取历史记录失败' },
      { status: 500 }
    )
  }
}

// 创建历史记录
export async function POST(request: NextRequest) {
  try {
    console.log('开始创建历史记录...')
    
    // 验证用户
    const auth = await authenticateRequest(request)
    
    if (!auth.success) {
      console.log('创建历史记录失败 - 用户未认证:', auth.error)
      return NextResponse.json(
        { error: auth.error },
        { status: auth.status }
      )
    }

    console.log('用户认证成功 - 用户ID:', auth.user?.userId)

    const body = await request.json()
    const {
      modelImage,
      outfitImages,
      pose,
      style,
      lighting,
      background,
      colorTone,
      count,
      generatedImages,
      time,
    } = body

    console.log('接收到的数据:', {
      userId: auth.user!.userId,
      hasModelImage: !!modelImage,
      hasOutfitImages: !!outfitImages,
      outfitImagesCount: outfitImages?.length,
      pose,
      style,
      lighting,
      generatedImagesCount: generatedImages?.length,
    })

    // 创建记录
    // 注意：数据库中 outfitImages 和 generatedImages 是 String 类型（JSON字符串）
    const generation = await prisma.generation.create({
      data: {
        userId: auth.user!.userId,
        modelImage,
        outfitImages: JSON.stringify(outfitImages || []),
        pose,
        style,
        lighting,
        background,
        colorTone: colorTone || '冷暖平衡', // 提供默认值
        count: count || 1,
        generatedImages: JSON.stringify(generatedImages || []),
        time: time || '0',
        status: 'COMPLETED',
        completedAt: new Date(),
      }
    })

    console.log('历史记录创建成功 - ID:', generation.id)

    // 更新用户额度
    try {
      await prisma.quota.update({
        where: { userId: auth.user!.userId },
        data: {
          freeQuotaUsed: { increment: 1 },
          remainingQuota: { decrement: 1 },
        }
      })
      console.log('用户额度更新成功')
    } catch (quotaError) {
      console.warn('更新用户额度失败（可能用户没有额度记录）:', quotaError)
      // 不影响主流程，继续返回成功
    }

    return NextResponse.json({
      message: '记录创建成功',
      generation,
    }, { status: 201 })

  } catch (error) {
    console.error('创建历史记录错误:', error)
    return NextResponse.json(
      { error: '创建历史记录失败', details: error instanceof Error ? error.message : '未知错误' },
      { status: 500 }
    )
  }
}

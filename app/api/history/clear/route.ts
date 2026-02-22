import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { authenticateRequest } from '@/lib/auth'

export async function DELETE(request: NextRequest) {
  try {
    // 验证用户
    const auth = await authenticateRequest(request)
    
    if (!auth.success) {
      return NextResponse.json(
        { error: auth.error },
        { status: auth.status }
      )
    }

    // 删除该用户的所有历史记录
    const result = await prisma.generation.deleteMany({
      where: { userId: auth.user!.userId }
    })

    return NextResponse.json({
      message: '所有历史记录已清空',
      deletedCount: result.count,
    })

  } catch (error) {
    console.error('清空历史记录错误:', error)
    return NextResponse.json(
      { error: '清空历史记录失败' },
      { status: 500 }
    )
  }
}

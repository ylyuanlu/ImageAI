/**
 * 用户自定义姿势 API
 * POST - 创建自定义姿势
 * GET - 获取用户的自定义姿势列表
 * DELETE - 删除自定义姿势
 */
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { authenticateRequest } from '@/lib/auth';
import { generateId } from '@/lib/auth';

/**
 * POST /api/poses/custom
 * 创建自定义姿势
 */
export async function POST(request: NextRequest) {
  try {
    // 验证用户身份
    const auth = await authenticateRequest(request);
    if (!auth.success) {
      return NextResponse.json(
        { status: 'error', message: auth.error },
        { status: auth.status || 401 }
      );
    }

    const body = await request.json();
    const { name, description, imageUrl, thumbnailUrl, prompt, tags } = body;

    // 验证必要字段
    if (!name || !description || !imageUrl) {
      return NextResponse.json(
        { status: 'error', message: '缺少必要参数：name, description, imageUrl 不能为空' },
        { status: 400 }
      );
    }

    // 检查用户自定义姿势数量限制（最多50个）
    const existingCount = await prisma.customPose.count({
      where: { userId: auth.user!.userId, isActive: true }
    });

    if (existingCount >= 50) {
      return NextResponse.json(
        { status: 'error', message: '自定义姿势数量已达上限（50个），请先删除部分姿势' },
        { status: 400 }
      );
    }

    // 创建自定义姿势
    const customPose = await prisma.customPose.create({
      data: {
        id: generateId(),
        userId: auth.user!.userId,
        name: name.slice(0, 50), // 限制名称长度
        description: description.slice(0, 500), // 限制描述长度
        imageUrl,
        thumbnailUrl: thumbnailUrl || imageUrl,
        prompt: prompt || null,
        tags: tags ? JSON.stringify(tags) : null,
        category: 'CUSTOM',
        source: 'TEXT',
        isActive: true,
      }
    });

    return NextResponse.json({
      status: 'success',
      message: '自定义姿势创建成功',
      data: {
        id: customPose.id,
        name: customPose.name,
        description: customPose.description,
        imageUrl: customPose.imageUrl,
        createdAt: customPose.createdAt,
      }
    });

  } catch (error: any) {
    console.error('创建自定义姿势失败:', error);
    return NextResponse.json(
      { status: 'error', message: '创建自定义姿势失败：' + error.message },
      { status: 500 }
    );
  }
}

/**
 * GET /api/poses/custom
 * 获取用户的自定义姿势列表
 */
export async function GET(request: NextRequest) {
  try {
    // 验证用户身份
    const auth = await authenticateRequest(request);
    if (!auth.success) {
      return NextResponse.json(
        { status: 'error', message: auth.error },
        { status: auth.status || 401 }
      );
    }

    // 获取查询参数
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const favoriteOnly = searchParams.get('favorite') === 'true';

    // 构建查询条件
    const where: any = {
      userId: auth.user!.userId,
      isActive: true,
    };

    if (favoriteOnly) {
      where.isFavorite = true;
    }

    // 查询自定义姿势列表
    const [poses, total] = await Promise.all([
      prisma.customPose.findMany({
        where,
        orderBy: [
          { isFavorite: 'desc' }, // 收藏优先
          { useCount: 'desc' },   // 使用次数优先
          { createdAt: 'desc' },  // 最新创建优先
        ],
        skip: (page - 1) * limit,
        take: limit,
        select: {
          id: true,
          name: true,
          description: true,
          imageUrl: true,
          thumbnailUrl: true,
          category: true,
          tags: true,
          isFavorite: true,
          useCount: true,
          createdAt: true,
        }
      }),
      prisma.customPose.count({ where })
    ]);

    // 解析tags字段
    const formattedPoses = poses.map(pose => ({
      ...pose,
      tags: pose.tags ? JSON.parse(pose.tags) : [],
    }));

    return NextResponse.json({
      status: 'success',
      data: {
        poses: formattedPoses,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        }
      }
    });

  } catch (error: any) {
    console.error('获取自定义姿势列表失败:', error);
    return NextResponse.json(
      { status: 'error', message: '获取自定义姿势列表失败：' + error.message },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/poses/custom?id=xxx
 * 删除自定义姿势（软删除）
 */
export async function DELETE(request: NextRequest) {
  try {
    // 验证用户身份
    const auth = await authenticateRequest(request);
    if (!auth.success) {
      return NextResponse.json(
        { status: 'error', message: auth.error },
        { status: auth.status || 401 }
      );
    }

    // 获取要删除的姿势ID
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { status: 'error', message: '缺少参数：id' },
        { status: 400 }
      );
    }

    // 验证姿势属于当前用户
    const pose = await prisma.customPose.findFirst({
      where: { id, userId: auth.user!.userId }
    });

    if (!pose) {
      return NextResponse.json(
        { status: 'error', message: '姿势不存在或无权限' },
        { status: 404 }
      );
    }

    // 软删除
    await prisma.customPose.update({
      where: { id },
      data: { isActive: false }
    });

    return NextResponse.json({
      status: 'success',
      message: '姿势已删除'
    });

  } catch (error: any) {
    console.error('删除自定义姿势失败:', error);
    return NextResponse.json(
      { status: 'error', message: '删除自定义姿势失败：' + error.message },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/poses/custom?id=xxx
 * 更新自定义姿势（收藏状态等）
 */
export async function PATCH(request: NextRequest) {
  try {
    // 验证用户身份
    const auth = await authenticateRequest(request);
    if (!auth.success) {
      return NextResponse.json(
        { status: 'error', message: auth.error },
        { status: auth.status || 401 }
      );
    }

    // 获取姿势ID
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { status: 'error', message: '缺少参数：id' },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { isFavorite, name } = body;

    // 验证姿势属于当前用户
    const pose = await prisma.customPose.findFirst({
      where: { id, userId: auth.user!.userId, isActive: true }
    });

    if (!pose) {
      return NextResponse.json(
        { status: 'error', message: '姿势不存在或无权限' },
        { status: 404 }
      );
    }

    // 更新字段
    const updateData: any = {};
    if (typeof isFavorite === 'boolean') {
      updateData.isFavorite = isFavorite;
    }
    if (name) {
      updateData.name = name.slice(0, 50);
    }

    const updatedPose = await prisma.customPose.update({
      where: { id },
      data: updateData,
      select: {
        id: true,
        name: true,
        isFavorite: true,
        updatedAt: true,
      }
    });

    return NextResponse.json({
      status: 'success',
      message: '姿势更新成功',
      data: updatedPose
    });

  } catch (error: any) {
    console.error('更新自定义姿势失败:', error);
    return NextResponse.json(
      { status: 'error', message: '更新自定义姿势失败：' + error.message },
      { status: 500 }
    );
  }
}

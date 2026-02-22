import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    // 清除 cookie 中的 token
    return NextResponse.json(
      { message: '登出成功' },
      {
        headers: {
          'Set-Cookie': `token=; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=0`
        }
      }
    )

  } catch (error) {
    console.error('登出错误:', error)
    return NextResponse.json(
      { error: '登出失败' },
      { status: 500 }
    )
  }
}

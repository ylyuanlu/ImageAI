import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import { randomBytes } from 'crypto'
import { NextRequest } from 'next/server'

// JWT Secret 必须配置，不允许使用默认密钥
const JWT_SECRET = process.env.JWT_SECRET
if (!JWT_SECRET) {
  throw new Error('JWT_SECRET 环境变量未设置，请配置安全的 JWT 密钥')
}

// 确保 JWT_SECRET 是字符串类型
const JWT_SECRET_KEY: string = JWT_SECRET

const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d'

// 密码加密
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12)
}

// 密码验证
export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword)
}

// 生成 JWT Token
export function generateToken(payload: { userId: string; email: string; role: string }): string {
  return jwt.sign(payload, JWT_SECRET_KEY, { expiresIn: JWT_EXPIRES_IN as jwt.SignOptions['expiresIn'] })
}

// 验证 JWT Token
export function verifyToken(token: string): { userId: string; email: string; role: string } | null {
  try {
    return jwt.verify(token, JWT_SECRET_KEY) as { userId: string; email: string; role: string }
  } catch {
    return null
  }
}

// 从请求中获取 Token
export function getTokenFromRequest(request: NextRequest): string | null {
  const authHeader = request.headers.get('authorization')
  if (authHeader?.startsWith('Bearer ')) {
    return authHeader.substring(7)
  }
  
  // 从 cookie 中获取
  const token = request.cookies.get('token')?.value
  return token || null
}

// 认证中间件
export async function authenticateRequest(request: NextRequest) {
  const token = getTokenFromRequest(request)
  
  if (!token) {
    return { success: false, error: '未提供认证令牌', status: 401 }
  }
  
  const decoded = verifyToken(token)
  
  if (!decoded) {
    return { success: false, error: '无效的认证令牌', status: 401 }
  }
  
  return { success: true, user: decoded }
}

// 生成随机 ID - 使用密码学安全的随机数生成
export function generateId(): string {
  // 使用 crypto.randomBytes 生成密码学安全的随机数
  // 16字节 = 128位熵，转换为32字符的十六进制字符串
  return randomBytes(16).toString('hex')
}

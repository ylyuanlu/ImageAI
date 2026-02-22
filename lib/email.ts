import { Resend } from 'resend';

// 初始化 Resend 客户端
const resend = process.env.RESEND_API_KEY 
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

// 发件人邮箱
const FROM_EMAIL = process.env.FROM_EMAIL || 'noreply@imageai.app';
const FROM_NAME = process.env.FROM_NAME || 'ImageAI';

/**
 * 检查邮件服务是否已配置
 */
export function isEmailConfigured(): boolean {
  return !!resend && !!process.env.RESEND_API_KEY;
}

/**
 * 发送邮箱验证邮件
 * @param to 收件人邮箱
 * @param username 用户名
 * @param verificationUrl 验证链接
 */
export async function sendVerificationEmail(
  to: string,
  username: string,
  verificationUrl: string
): Promise<{ success: boolean; error?: string }> {
  if (!isEmailConfigured()) {
    console.warn('邮件服务未配置，跳过发送验证邮件');
    console.log('验证链接:', verificationUrl);
    return { success: false, error: '邮件服务未配置' };
  }

  try {
    const { data, error } = await resend!.emails.send({
      from: `${FROM_NAME} <${FROM_EMAIL}>`,
      to: [to],
      subject: '验证您的邮箱 - ImageAI',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>验证您的邮箱</title>
          <style>
            body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
              line-height: 1.6;
              color: #333;
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
              background-color: #f5f5f5;
            }
            .container {
              background-color: #ffffff;
              border-radius: 12px;
              padding: 40px;
              box-shadow: 0 2px 8px rgba(0,0,0,0.1);
            }
            .logo {
              text-align: center;
              margin-bottom: 30px;
            }
            .logo h1 {
              color: #8B5CF6;
              margin: 0;
              font-size: 28px;
            }
            h2 {
              color: #1E293B;
              font-size: 24px;
              margin-bottom: 20px;
            }
            p {
              color: #64748B;
              font-size: 16px;
              margin-bottom: 20px;
            }
            .button {
              display: inline-block;
              background: linear-gradient(135deg, #8B5CF6 0%, #EC4899 100%);
              color: white;
              text-decoration: none;
              padding: 14px 32px;
              border-radius: 8px;
              font-weight: 600;
              font-size: 16px;
              margin: 20px 0;
            }
            .link {
              color: #8B5CF6;
              word-break: break-all;
            }
            .footer {
              margin-top: 40px;
              padding-top: 20px;
              border-top: 1px solid #E5E7EB;
              text-align: center;
              color: #9CA3AF;
              font-size: 14px;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="logo">
              <h1>ImageAI</h1>
            </div>
            <h2>欢迎加入 ImageAI！</h2>
            <p>您好 ${username}，</p>
            <p>感谢您注册 ImageAI 账号。请点击下方按钮验证您的邮箱地址：</p>
            <div style="text-align: center;">
              <a href="${verificationUrl}" class="button">验证邮箱地址</a>
            </div>
            <p>或者复制以下链接到浏览器中打开：</p>
            <p class="link">${verificationUrl}</p>
            <p>此链接将在 24 小时后过期。如果您没有注册 ImageAI 账号，请忽略此邮件。</p>
            <div class="footer">
              <p>此邮件由 ImageAI 自动发送，请勿回复。</p>
              <p>&copy; ${new Date().getFullYear()} ImageAI. All rights reserved.</p>
            </div>
          </div>
        </body>
        </html>
      `,
    });

    if (error) {
      console.error('发送验证邮件失败:', error);
      return { success: false, error: error.message };
    }

    console.log('验证邮件已发送:', data?.id);
    return { success: true };
  } catch (error) {
    console.error('发送验证邮件出错:', error);
    return { success: false, error: '发送邮件失败' };
  }
}

/**
 * 发送密码重置邮件
 * @param to 收件人邮箱
 * @param username 用户名
 * @param resetUrl 重置密码链接
 */
export async function sendPasswordResetEmail(
  to: string,
  username: string,
  resetUrl: string
): Promise<{ success: boolean; error?: string }> {
  if (!isEmailConfigured()) {
    console.warn('邮件服务未配置，跳过发送密码重置邮件');
    console.log('密码重置链接:', resetUrl);
    return { success: false, error: '邮件服务未配置' };
  }

  try {
    const { data, error } = await resend!.emails.send({
      from: `${FROM_NAME} <${FROM_EMAIL}>`,
      to: [to],
      subject: '重置您的密码 - ImageAI',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>重置您的密码</title>
          <style>
            body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
              line-height: 1.6;
              color: #333;
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
              background-color: #f5f5f5;
            }
            .container {
              background-color: #ffffff;
              border-radius: 12px;
              padding: 40px;
              box-shadow: 0 2px 8px rgba(0,0,0,0.1);
            }
            .logo {
              text-align: center;
              margin-bottom: 30px;
            }
            .logo h1 {
              color: #8B5CF6;
              margin: 0;
              font-size: 28px;
            }
            h2 {
              color: #1E293B;
              font-size: 24px;
              margin-bottom: 20px;
            }
            p {
              color: #64748B;
              font-size: 16px;
              margin-bottom: 20px;
            }
            .button {
              display: inline-block;
              background: linear-gradient(135deg, #8B5CF6 0%, #EC4899 100%);
              color: white;
              text-decoration: none;
              padding: 14px 32px;
              border-radius: 8px;
              font-weight: 600;
              font-size: 16px;
              margin: 20px 0;
            }
            .link {
              color: #8B5CF6;
              word-break: break-all;
            }
            .warning {
              background-color: #FEF3C7;
              border-left: 4px solid #F59E0B;
              padding: 12px 16px;
              margin: 20px 0;
              border-radius: 4px;
            }
            .footer {
              margin-top: 40px;
              padding-top: 20px;
              border-top: 1px solid #E5E7EB;
              text-align: center;
              color: #9CA3AF;
              font-size: 14px;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="logo">
              <h1>ImageAI</h1>
            </div>
            <h2>重置密码</h2>
            <p>您好 ${username}，</p>
            <p>我们收到了您重置密码的请求。请点击下方按钮重置您的密码：</p>
            <div style="text-align: center;">
              <a href="${resetUrl}" class="button">重置密码</a>
            </div>
            <p>或者复制以下链接到浏览器中打开：</p>
            <p class="link">${resetUrl}</p>
            <div class="warning">
              <strong>注意：</strong>此链接将在 1 小时后过期。如果您没有请求重置密码，请忽略此邮件，您的账户仍然安全。
            </div>
            <div class="footer">
              <p>此邮件由 ImageAI 自动发送，请勿回复。</p>
              <p>&copy; ${new Date().getFullYear()} ImageAI. All rights reserved.</p>
            </div>
          </div>
        </body>
        </html>
      `,
    });

    if (error) {
      console.error('发送密码重置邮件失败:', error);
      return { success: false, error: error.message };
    }

    console.log('密码重置邮件已发送:', data?.id);
    return { success: true };
  } catch (error) {
    console.error('发送密码重置邮件出错:', error);
    return { success: false, error: '发送邮件失败' };
  }
}

/**
 * 发送欢迎邮件（注册成功后）
 * @param to 收件人邮箱
 * @param username 用户名
 */
export async function sendWelcomeEmail(
  to: string,
  username: string
): Promise<{ success: boolean; error?: string }> {
  if (!isEmailConfigured()) {
    console.warn('邮件服务未配置，跳过发送欢迎邮件');
    return { success: false, error: '邮件服务未配置' };
  }

  try {
    const { data, error } = await resend!.emails.send({
      from: `${FROM_NAME} <${FROM_EMAIL}>`,
      to: [to],
      subject: '欢迎加入 ImageAI！',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>欢迎加入 ImageAI</title>
          <style>
            body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
              line-height: 1.6;
              color: #333;
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
              background-color: #f5f5f5;
            }
            .container {
              background-color: #ffffff;
              border-radius: 12px;
              padding: 40px;
              box-shadow: 0 2px 8px rgba(0,0,0,0.1);
            }
            .logo {
              text-align: center;
              margin-bottom: 30px;
            }
            .logo h1 {
              color: #8B5CF6;
              margin: 0;
              font-size: 28px;
            }
            h2 {
              color: #1E293B;
              font-size: 24px;
              margin-bottom: 20px;
            }
            p {
              color: #64748B;
              font-size: 16px;
              margin-bottom: 20px;
            }
            .features {
              background-color: #F9FAFB;
              border-radius: 8px;
              padding: 20px;
              margin: 20px 0;
            }
            .feature {
              display: flex;
              align-items: center;
              margin-bottom: 12px;
            }
            .feature-icon {
              width: 24px;
              height: 24px;
              background: linear-gradient(135deg, #8B5CF6 0%, #EC4899 100%);
              border-radius: 50%;
              display: flex;
              align-items: center;
              justify-content: center;
              margin-right: 12px;
              color: white;
              font-size: 14px;
            }
            .button {
              display: inline-block;
              background: linear-gradient(135deg, #8B5CF6 0%, #EC4899 100%);
              color: white;
              text-decoration: none;
              padding: 14px 32px;
              border-radius: 8px;
              font-weight: 600;
              font-size: 16px;
              margin: 20px 0;
            }
            .footer {
              margin-top: 40px;
              padding-top: 20px;
              border-top: 1px solid #E5E7EB;
              text-align: center;
              color: #9CA3AF;
              font-size: 14px;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="logo">
              <h1>ImageAI</h1>
            </div>
            <h2>欢迎加入 ImageAI，${username}！</h2>
            <p>您的账号已成功创建。现在您可以开始使用 AI 服装模特生成功能了！</p>
            
            <div class="features">
              <h3 style="margin-top: 0; color: #1E293B;">您可以：</h3>
              <div class="feature">
                <div class="feature-icon">✓</div>
                <span>上传照片和服装，生成专业穿搭效果图</span>
              </div>
              <div class="feature">
                <div class="feature-icon">✓</div>
                <span>选择多种姿势和风格，打造个性化造型</span>
              </div>
              <div class="feature">
                <div class="feature-icon">✓</div>
                <span>保存和分享您的创作到社交媒体</span>
              </div>
              <div class="feature">
                <div class="feature-icon">✓</div>
                <span>查看历史记录，随时回顾您的作品</span>
              </div>
            </div>
            
            <div style="text-align: center;">
              <a href="${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/upload" class="button">开始创作</a>
            </div>
            
            <p>如果您有任何问题，欢迎随时联系我们的支持团队。</p>
            
            <div class="footer">
              <p>此邮件由 ImageAI 自动发送，请勿回复。</p>
              <p>&copy; ${new Date().getFullYear()} ImageAI. All rights reserved.</p>
            </div>
          </div>
        </body>
        </html>
      `,
    });

    if (error) {
      console.error('发送欢迎邮件失败:', error);
      return { success: false, error: error.message };
    }

    console.log('欢迎邮件已发送:', data?.id);
    return { success: true };
  } catch (error) {
    console.error('发送欢迎邮件出错:', error);
    return { success: false, error: '发送邮件失败' };
  }
}

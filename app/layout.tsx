import type { Metadata } from 'next'
import './globals.css'
import Navbar from './components/Navbar'
import ThemeProvider from './components/ThemeProvider'
import { AuthProvider } from './components/AuthProvider'

export const metadata: Metadata = {
  title: 'AI试衣间 - 虚拟换装秒级生成',
  description: '上传您的照片和喜欢的服装，AI智能生成专业级穿搭效果图。无需真实拍摄，无限风格创意。',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-CN">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link 
          href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=Inter:wght@300;400;500;600&display=swap" 
          rel="stylesheet" 
        />
      </head>
      <body className="font-body antialiased">
        <AuthProvider>
          <ThemeProvider>
            <Navbar />
            <main className="pt-16 min-h-screen">
              {children}
            </main>
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  )
}

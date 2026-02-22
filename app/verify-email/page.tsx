"use client";
import React, { useState, useEffect, Suspense } from 'react';
import { useTheme } from '../components/ThemeProvider';
import { useSearchParams } from 'next/navigation';

/**
 * 邮箱验证页面内容组件
 * 使用 useSearchParams 需要在 Suspense 边界内
 */
function VerifyEmailContent() {
  const { theme } = useTheme();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('正在验证邮箱...');

  useEffect(() => {
    if (!token) {
      setStatus('error');
      setMessage('缺少验证令牌');
      return;
    }

    // 调用验证 API
    fetch(`/api/auth/verify-email?token=${token}`)
      .then(async (res) => {
        const data = await res.json();
        if (res.ok) {
          setStatus('success');
          setMessage(data.message || '邮箱验证成功！');
        } else {
          setStatus('error');
          setMessage(data.error || '验证失败');
        }
      })
      .catch(() => {
        setStatus('error');
        setMessage('网络错误，请稍后重试');
      });
  }, [token]);

  const styles = {
    container: {
      minHeight: '80vh',
      display: 'flex',
      flexDirection: 'column' as const,
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem',
      backgroundColor: theme === 'dark' ? '#0b1020' : '#f8fafc'
    },
    card: {
      width: '100%',
      maxWidth: 480,
      padding: '3rem',
      borderRadius: 16,
      backgroundColor: theme === 'dark' ? '#1f2a3a' : 'white',
      boxShadow: theme === 'dark' ? '0 8px 24px rgba(0,0,0,.5)' : '0 12px 32px rgba(0,0,0,.1)',
      border: `1px solid ${theme === 'dark' ? '#2b3240' : '#e5e7eb'}`,
      textAlign: 'center' as const
    },
    icon: {
      fontSize: '4rem',
      marginBottom: '1.5rem'
    },
    title: {
      fontSize: '1.75rem',
      fontWeight: 700,
      marginBottom: '1rem',
      color: theme === 'dark' ? '#e5e7eb' : '#1E293B'
    },
    message: {
      fontSize: '1rem',
      color: theme === 'dark' ? '#a3a3a3' : '#64748B',
      marginBottom: '2rem'
    },
    button: {
      padding: '0.875rem 2rem',
      borderRadius: 10,
      border: 'none',
      backgroundColor: theme === 'dark' ? '#60a5fa' : '#8B5CF6',
      color: 'white',
      fontSize: '1rem',
      fontWeight: 600,
      cursor: 'pointer',
      textDecoration: 'none',
      display: 'inline-block'
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        {status === 'loading' && (
          <>
            <div style={styles.icon}>⏳</div>
            <h1 style={styles.title}>验证中...</h1>
            <p style={styles.message}>{message}</p>
          </>
        )}

        {status === 'success' && (
          <>
            <div style={styles.icon}>✅</div>
            <h1 style={styles.title}>验证成功！</h1>
            <p style={styles.message}>{message}</p>
            <a href="/account" style={styles.button}>
              去登录
            </a>
          </>
        )}

        {status === 'error' && (
          <>
            <div style={styles.icon}>❌</div>
            <h1 style={styles.title}>验证失败</h1>
            <p style={styles.message}>{message}</p>
            <a href="/account" style={styles.button}>
              返回登录页
            </a>
          </>
        )}
      </div>
    </div>
  );
}

/**
 * 加载状态组件
 */
function LoadingState() {
  return (
    <div style={{
      minHeight: '80vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem',
      backgroundColor: '#f8fafc'
    }}>
      <div style={{
        width: '100%',
        maxWidth: 480,
        padding: '3rem',
        borderRadius: 16,
        backgroundColor: 'white',
        boxShadow: '0 12px 32px rgba(0,0,0,.1)',
        textAlign: 'center'
      }}>
        <div style={{ fontSize: '4rem', marginBottom: '1.5rem' }}>⏳</div>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 700, marginBottom: '1rem' }}>
          加载中...
        </h1>
        <p style={{ fontSize: '1rem', color: '#64748B' }}>正在初始化页面</p>
      </div>
    </div>
  );
}

/**
 * 邮箱验证页面
 * 使用 Suspense 包装使用 useSearchParams 的组件
 */
export default function VerifyEmailPage() {
  return (
    <Suspense fallback={<LoadingState />}>
      <VerifyEmailContent />
    </Suspense>
  );
}

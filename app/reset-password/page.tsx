"use client";
import React, { useState, useEffect, Suspense } from 'react';
import { useTheme } from '../components/ThemeProvider';
import { useSearchParams } from 'next/navigation';

/**
 * 重置密码页面内容组件
 * 使用 useSearchParams 需要在 Suspense 边界内
 */
function ResetPasswordContent() {
  const { theme } = useTheme();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  const [status, setStatus] = useState<'loading' | 'form' | 'submitting' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('正在验证链接...');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (!token) {
      setStatus('error');
      setMessage('缺少重置令牌');
      return;
    }

    // 验证令牌是否有效
    fetch(`/api/auth/reset-password?token=${token}`)
      .then(async (res) => {
        const data = await res.json();
        if (res.ok) {
          setStatus('form');
          setMessage('');
        } else {
          setStatus('error');
          setMessage(data.error || '链接无效或已过期');
        }
      })
      .catch(() => {
        setStatus('error');
        setMessage('网络错误，请稍后重试');
      });
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password.length < 6) {
      setError('密码长度至少为6位');
      return;
    }

    if (password !== confirmPassword) {
      setError('两次输入的密码不一致');
      return;
    }

    setStatus('submitting');

    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password })
      });

      const data = await res.json();

      if (res.ok) {
        setStatus('success');
        setMessage(data.message || '密码重置成功！');
      } else {
        setStatus('form');
        setError(data.error || '重置失败');
      }
    } catch {
      setStatus('form');
      setError('网络错误，请稍后重试');
    }
  };

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
    form: {
      textAlign: 'left' as const
    },
    formGroup: {
      marginBottom: '1.5rem'
    },
    label: {
      display: 'block',
      fontSize: '0.8rem',
      fontWeight: 600,
      marginBottom: '0.5rem',
      color: theme === 'dark' ? '#9ca3af' : '#6b7280',
      textTransform: 'uppercase' as const,
      letterSpacing: '0.05em'
    },
    input: {
      width: '100%',
      padding: '0.875rem 1rem',
      borderRadius: 12,
      border: `1px solid ${theme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)'}`,
      backgroundColor: theme === 'dark' ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)',
      color: theme === 'dark' ? '#ffffff' : '#1e293b',
      fontSize: '1rem',
      fontWeight: 500
    },
    error: {
      color: theme === 'dark' ? '#f87171' : '#ef4444',
      fontSize: '0.875rem',
      marginBottom: '1rem'
    },
    button: {
      width: '100%',
      padding: '1rem',
      borderRadius: 10,
      border: 'none',
      backgroundColor: theme === 'dark' ? '#60a5fa' : '#8B5CF6',
      color: 'white',
      fontSize: '1rem',
      fontWeight: 600,
      cursor: 'pointer'
    },
    linkButton: {
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

        {status === 'error' && (
          <>
            <div style={styles.icon}>❌</div>
            <h1 style={styles.title}>链接无效</h1>
            <p style={styles.message}>{message}</p>
            <a href="/account" style={styles.linkButton}>
              返回登录页
            </a>
          </>
        )}

        {status === 'form' && (
          <>
            <div style={styles.icon}>🔐</div>
            <h1 style={styles.title}>重置密码</h1>
            <p style={styles.message}>请输入新密码</p>
            <form onSubmit={handleSubmit} style={styles.form}>
              <div style={styles.formGroup}>
                <label style={styles.label}>新密码</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={styles.input}
                  placeholder="请输入新密码"
                  required
                />
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>确认密码</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  style={styles.input}
                  placeholder="请再次输入新密码"
                  required
                />
              </div>
              {error && <p style={styles.error}>{error}</p>}
              <button type="submit" style={styles.button}>
                重置密码
              </button>
            </form>
          </>
        )}

        {status === 'submitting' && (
          <>
            <div style={styles.icon}>⏳</div>
            <h1 style={styles.title}>处理中...</h1>
            <p style={styles.message}>正在重置密码</p>
          </>
        )}

        {status === 'success' && (
          <>
            <div style={styles.icon}>✅</div>
            <h1 style={styles.title}>重置成功！</h1>
            <p style={styles.message}>{message}</p>
            <a href="/account" style={styles.linkButton}>
              去登录
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
 * 重置密码页面
 * 使用 Suspense 包装使用 useSearchParams 的组件
 */
export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<LoadingState />}>
      <ResetPasswordContent />
    </Suspense>
  );
}

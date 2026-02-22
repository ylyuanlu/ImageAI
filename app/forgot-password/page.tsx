"use client";
import React, { useState } from 'react';
import { useTheme } from '../components/ThemeProvider';

export default function ForgotPasswordPage() {
  const { theme } = useTheme();
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');

    if (!email.trim()) {
      setError('请输入邮箱地址');
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('请输入有效的邮箱地址');
      return;
    }

    setStatus('submitting');

    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });

      const data = await res.json();

      if (res.ok) {
        setStatus('success');
        setMessage(data.message || '密码重置链接已发送到您的邮箱');
        // 开发环境下显示重置链接
        if (data.resetUrl) {
          console.log('密码重置链接:', data.resetUrl);
        }
      } else {
        setStatus('error');
        setError(data.error || '请求失败');
      }
    } catch {
      setStatus('error');
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
    },
    backLink: {
      display: 'block',
      marginTop: '1.5rem',
      fontSize: '0.875rem',
      color: theme === 'dark' ? '#60a5fa' : '#8B5CF6',
      textDecoration: 'none'
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        {status === 'success' ? (
          <>
            <div style={styles.icon}>✉️</div>
            <h1 style={styles.title}>邮件已发送</h1>
            <p style={styles.message}>{message}</p>
            <a href="/account" style={styles.linkButton}>
              返回登录页
            </a>
          </>
        ) : (
          <>
            <div style={styles.icon}>🔐</div>
            <h1 style={styles.title}>忘记密码</h1>
            <p style={styles.message}>请输入您的邮箱地址，我们将发送密码重置链接</p>
            <form onSubmit={handleSubmit} style={styles.form}>
              <div style={styles.formGroup}>
                <label style={styles.label}>邮箱</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={styles.input}
                  placeholder="请输入注册时的邮箱地址"
                  required
                  disabled={status === 'submitting'}
                />
              </div>
              {error && <p style={styles.error}>{error}</p>}
              <button
                type="submit"
                style={{
                  ...styles.button,
                  opacity: status === 'submitting' ? 0.7 : 1
                }}
                disabled={status === 'submitting'}
              >
                {status === 'submitting' ? '发送中...' : '发送重置链接'}
              </button>
            </form>
            <a href="/account" style={styles.backLink}>
              ← 返回登录
            </a>
          </>
        )}
      </div>
    </div>
  );
}

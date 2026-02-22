"use client";
import React, { useState, useEffect } from 'react';
import { useTheme } from '../components/ThemeProvider';
import Link from 'next/link';

type User = {
  id: string;
  email: string;
  username: string;
  avatar: string | null;
  role: string;
  status: string;
  emailVerified: boolean;
  createdAt: string;
} | null;

type FormError = { email?: string; username?: string; password?: string; general?: string };

export default function AccountPage() {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [user, setUser] = useState<User>(null);
  const [loading, setLoading] = useState(true);
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<FormError>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 获取当前用户信息（使用 Cookie 认证）
  const fetchUser = async () => {
    try {
      const response = await fetch('/api/auth/me', {
        credentials: 'include',
      });

      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error('获取用户信息失败:', error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  // 只在客户端加载用户数据
  useEffect(() => {
    setMounted(true);
    fetchUser();
  }, []);

  // 如果还没挂载，显示加载状态
  if (!mounted || loading) {
    return (
      <div style={{
        minHeight: '80vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem',
        backgroundColor: theme === 'dark' ? '#0b1020' : '#f8fafc'
      }}>
        <div style={{
          width: '100%',
          maxWidth: 480,
          padding: '2.5rem',
          borderRadius: 16,
          backgroundColor: theme === 'dark' ? '#1f2a3a' : 'white',
          boxShadow: theme === 'dark' ? '0 8px 24px rgba(0,0,0,.5)' : '0 12px 32px rgba(0,0,0,.1)',
          border: `1px solid ${theme === 'dark' ? '#2b3240' : '#e5e7eb'}`
        }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{
              width: 40,
              height: 40,
              border: `3px solid ${theme === 'dark' ? '#2b3240' : '#e5e7eb'}`,
              borderTopColor: theme === 'dark' ? '#60a5fa' : '#8B5CF6',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite',
              margin: '0 auto 1rem'
            }} />
            <p style={{ color: theme === 'dark' ? '#a3a3a3' : '#64748B' }}>加载中...</p>
          </div>
        </div>
      </div>
    );
  }

  // 动态样式
  const styles: { [key: string]: React.CSSProperties } = {
    container: {
      minHeight: '80vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem',
      backgroundColor: theme === 'dark' ? '#0b1020' : '#f8fafc'
    },
    card: {
      width: '100%',
      maxWidth: 480,
      padding: '2.5rem',
      borderRadius: 16,
      backgroundColor: theme === 'dark' ? '#1f2a3a' : 'white',
      boxShadow: theme === 'dark' ? '0 8px 24px rgba(0,0,0,.5)' : '0 12px 32px rgba(0,0,0,.1)',
      border: `1px solid ${theme === 'dark' ? '#2b3240' : '#e5e7eb'}`,
      transition: 'all 0.3s ease'
    },
    header: {
      textAlign: 'center' as const,
      marginBottom: '2rem'
    },
    title: {
      fontSize: '1.75rem',
      fontWeight: 700,
      marginBottom: '0.5rem',
      background: 'linear-gradient(90deg, #8B5CF6 0%, #EC4899 100%)',
      WebkitBackgroundClip: 'text',
      backgroundClip: 'text',
      color: 'transparent'
    },
    subtitle: {
      fontSize: '1rem',
      color: theme === 'dark' ? '#a3a3a3' : '#64748B',
      marginBottom: '1.5rem'
    },
    modeToggle: {
      display: 'flex',
      marginBottom: '2rem',
      borderRadius: 12,
      border: `1px solid ${theme === 'dark' ? '#2b3240' : '#e5e7eb'}`,
      overflow: 'hidden'
    },
    modeButton: {
      flex: 1,
      padding: '0.75rem 1.5rem',
      border: 'none',
      backgroundColor: 'transparent',
      color: theme === 'dark' ? '#a3a3a3' : '#64748B',
      cursor: 'pointer',
      fontSize: '0.9rem',
      fontWeight: 500,
      transition: 'all 0.2s ease'
    },
    modeButtonActive: {
      backgroundColor: theme === 'dark' ? '#60a5fa' : '#8B5CF6',
      color: 'white'
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
      fontWeight: 500,
      transition: 'all 0.2s ease'
    },
    inputError: {
      borderColor: theme === 'dark' ? '#f87171' : '#ef4444'
    },
    errorMessage: {
      fontSize: '0.75rem',
      color: theme === 'dark' ? '#f87171' : '#ef4444',
      marginTop: '0.25rem'
    },
    generalError: {
      padding: '1rem',
      borderRadius: 8,
      backgroundColor: theme === 'dark' ? '#371c26' : '#fee2e2',
      color: theme === 'dark' ? '#fecaca' : '#dc2626',
      marginBottom: '1.5rem',
      fontSize: '0.875rem'
    },
    submitButton: {
      width: '100%',
      padding: '1rem',
      borderRadius: 10,
      border: 'none',
      backgroundColor: theme === 'dark' ? '#60a5fa' : '#8B5CF6',
      color: 'white',
      fontSize: '1rem',
      fontWeight: 600,
      cursor: 'pointer',
      transition: 'all 0.2s ease',
      marginTop: '1rem'
    },
    submitButtonDisabled: {
      opacity: 0.6,
      cursor: 'not-allowed'
    },
    submitButtonLoading: {
      opacity: 0.8
    },
    userInfo: {
      textAlign: 'center' as const,
      padding: '2rem'
    },
    userAvatar: {
      width: 100,
      height: 100,
      borderRadius: '50%',
      backgroundColor: theme === 'dark' ? '#2b3240' : '#e5e7eb',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      margin: '0 auto 1.5rem',
      fontSize: '2.5rem'
    },
    userName: {
      fontSize: '1.5rem',
      fontWeight: 600,
      marginBottom: '0.5rem',
      color: theme === 'dark' ? '#e5e7eb' : '#1E293B'
    },
    userMeta: {
      fontSize: '1rem',
      color: theme === 'dark' ? '#a3a3a3' : '#64748B',
      marginBottom: '2rem'
    },
    actionButton: {
      padding: '0.75rem 1.5rem',
      borderRadius: 8,
      border: `1px solid ${theme === 'dark' ? '#2b3240' : '#e5e7eb'}`,
      backgroundColor: theme === 'dark' ? '#141b2a' : 'white',
      color: theme === 'dark' ? '#e5e7eb' : '#1E293B',
      cursor: 'pointer',
      fontSize: '0.9rem',
      fontWeight: 500,
      transition: 'all 0.2s ease'
    },
    actionButtonPrimary: {
      backgroundColor: theme === 'dark' ? '#60a5fa' : '#8B5CF6',
      color: 'white',
      borderColor: theme === 'dark' ? '#60a5fa' : '#8B5CF6'
    },
    actionButtonDanger: {
      backgroundColor: theme === 'dark' ? '#f87171' : '#ef4444',
      color: 'white',
      borderColor: theme === 'dark' ? '#f87171' : '#ef4444'
    },
    featureGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
      gap: '1rem',
      marginTop: '2rem'
    },
    featureCard: {
      padding: '1.5rem',
      borderRadius: 12,
      backgroundColor: theme === 'dark' ? '#141b2a' : '#f8fafc',
      border: `1px solid ${theme === 'dark' ? '#2b3240' : '#e5e7eb'}`,
      textAlign: 'center' as const,
      transition: 'all 0.2s ease'
    },
    featureIcon: {
      fontSize: '2rem',
      marginBottom: '1rem'
    },
    featureTitle: {
      fontSize: '1rem',
      fontWeight: 600,
      marginBottom: '0.5rem',
      color: theme === 'dark' ? '#e5e7eb' : '#1E293B'
    },
    featureDescription: {
      fontSize: '0.875rem',
      color: theme === 'dark' ? '#a3a3a3' : '#64748B'
    }
  };

  const validateForm = (): FormError => {
    const newErrors: FormError = {};

    if (mode === 'register') {
      if (!email.trim()) {
        newErrors.email = '请输入邮箱';
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        newErrors.email = '请输入有效的邮箱地址';
      }
    }

    if (!username.trim()) {
      newErrors.username = mode === 'register' ? '请输入用户名' : '请输入用户名或邮箱';
    }

    if (!password.trim()) {
      newErrors.password = '请输入密码';
    } else if (password.length < 6) {
      newErrors.password = '密码长度至少为6位';
    }

    return newErrors;
  };

  const submit = async () => {
    const formErrors = validateForm();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }

    setIsSubmitting(true);
    setErrors({});

    try {
      if (mode === 'register') {
        // 调用注册 API（使用 Cookie）
        const response = await fetch('/api/auth/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify({
            email,
            username,
            password,
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          setErrors({ general: data.error || '注册失败' });
          return;
        }

        setUser(data.user);
        alert('注册成功！欢迎加入 AI 服装模特生成平台');
      } else {
        // 调用登录 API（使用 Cookie）
        const response = await fetch('/api/auth/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify({
            email: username,
            password,
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          setErrors({ general: data.error || '登录失败' });
          return;
        }

        setUser(data.user);
        alert('登录成功！欢迎回来');
      }
    } catch (error) {
      setErrors({ general: '网络错误，请稍后重试' });
      console.error('提交失败:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const logout = async () => {
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include',
      });
      
      setUser(null);
      setEmail('');
      setUsername('');
      setPassword('');
      alert('已成功退出登录');
    } catch (error) {
      console.error('登出失败:', error);
    }
  };

  const resetForm = () => {
    setEmail('');
    setUsername('');
    setPassword('');
    setErrors({});
  };

  return (
    <div style={styles.container}>
      {user ? (
        <div style={styles.card}>
          <div style={styles.userInfo}>
            <div style={styles.userAvatar}>
              {user.username.charAt(0).toUpperCase()}
            </div>
            <h2 style={styles.userName}>{user.username}</h2>
            <p style={styles.userMeta}>{user.email}</p>
            <p style={{ ...styles.userMeta, fontSize: '0.875rem' }}>
              角色: {user.role} | 状态: {user.status}
            </p>
            
            {user.emailVerified ? (
              <p style={{ ...styles.userMeta, fontSize: '0.875rem', color: '#10b981', marginBottom: '1.5rem' }}>
                ✅ 邮箱已验证
              </p>
            ) : (
              <div style={{ marginBottom: '1.5rem' }}>
                <button
                  style={{ ...styles.actionButton, ...styles.actionButtonPrimary }}
                  onClick={async () => {
                    try {
                      const response = await fetch('/api/auth/resend-verification', {
                        method: 'POST',
                        headers: {
                          'Content-Type': 'application/json'
                        },
                        credentials: 'include'
                      });
                      const data = await response.json();
                      if (response.ok) {
                        alert('验证邮件已发送，请检查邮箱');
                      } else {
                        alert(data.error || '发送失败');
                      }
                    } catch {
                      alert('网络错误');
                    }
                  }}
                >
                  重新发送验证邮件
                </button>
              </div>
            )}

            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <button
                style={styles.actionButton}
                onClick={() => alert('个人资料编辑功能开发中')}
              >
                编辑资料
              </button>
              <button
                style={{ ...styles.actionButton, ...styles.actionButtonDanger }}
                onClick={logout}
              >
                退出登录
              </button>
            </div>

            <div style={styles.featureGrid}>
              <Link href="/history" style={{ textDecoration: 'none' }}>
                <div style={styles.featureCard}>
                  <div style={styles.featureIcon}>📊</div>
                  <div style={styles.featureTitle}>使用统计</div>
                  <div style={styles.featureDescription}>查看您的创作记录</div>
                </div>
              </Link>
              <Link href="/membership" style={{ textDecoration: 'none' }}>
                <div style={styles.featureCard}>
                  <div style={styles.featureIcon}>⚙️</div>
                  <div style={styles.featureTitle}>账户设置</div>
                  <div style={styles.featureDescription}>管理您的订阅</div>
                </div>
              </Link>
            </div>
          </div>
        </div>
      ) : (
        <div style={styles.card}>
          <div style={styles.header}>
            <h1 style={styles.title}>AI 服装模特生成</h1>
            <p style={styles.subtitle}>
              {mode === 'login' ? '登录您的账户，继续创作之旅' : '创建账户，开启 AI 时尚之旅'}
            </p>
          </div>

          <div style={styles.modeToggle}>
            <button
              style={{
                ...styles.modeButton,
                ...(mode === 'login' ? styles.modeButtonActive : {})
              }}
              onClick={() => { setMode('login'); resetForm(); }}
            >
              登录
            </button>
            <button
              style={{
                ...styles.modeButton,
                ...(mode === 'register' ? styles.modeButtonActive : {})
              }}
              onClick={() => { setMode('register'); resetForm(); }}
            >
              注册
            </button>
          </div>

          {errors.general && (
            <div style={styles.generalError}>{errors.general}</div>
          )}

          <div style={styles.formGroup}>
            <label style={styles.label}>
              {mode === 'register' ? '用户名' : '用户名或邮箱'}
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder={mode === 'register' ? '请输入用户名' : '请输入用户名或邮箱'}
              style={{
                ...styles.input,
                ...(errors.username ? styles.inputError : {})
              }}
            />
            {errors.username && <span style={styles.errorMessage}>{errors.username}</span>}
          </div>

          {mode === 'register' && (
            <div style={styles.formGroup}>
              <label style={styles.label}>邮箱</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                style={{
                  ...styles.input,
                  ...(errors.email ? styles.inputError : {})
                }}
              />
              {errors.email && <span style={styles.errorMessage}>{errors.email}</span>}
            </div>
          )}

          <div style={styles.formGroup}>
            <label style={styles.label}>密码</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              style={{
                ...styles.input,
                ...(errors.password ? styles.inputError : {})
              }}
            />
            {errors.password && <span style={styles.errorMessage}>{errors.password}</span>}
          </div>

          <button
            style={{
              ...styles.submitButton,
              ...(isSubmitting ? styles.submitButtonLoading : {})
            }}
            onClick={submit}
            disabled={isSubmitting}
          >
            {isSubmitting ? '处理中...' : (mode === 'login' ? '登录' : '注册')}
          </button>

          <p style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.875rem', color: theme === 'dark' ? '#a3a3a3' : '#64748B' }}>
            {mode === 'login' ? (
              <>还没有账户？ <button onClick={() => { setMode('register'); resetForm(); }} style={{ background: 'none', border: 'none', color: theme === 'dark' ? '#60a5fa' : '#8B5CF6', cursor: 'pointer', fontWeight: 500 }}>立即注册</button></>
            ) : (
              <>已有账户？ <button onClick={() => { setMode('login'); resetForm(); }} style={{ background: 'none', border: 'none', color: theme === 'dark' ? '#60a5fa' : '#8B5CF6', cursor: 'pointer', fontWeight: 500 }}>立即登录</button></>
            )}
          </p>
        </div>
      )}
    </div>
  );
}

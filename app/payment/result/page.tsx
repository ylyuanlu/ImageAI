"use client";
import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useTheme } from '../../components/ThemeProvider';

/**
 * 支付结果页面内容组件
 * 使用 useSearchParams 需要在 Suspense 边界内
 */
function PaymentResultContent() {
  const { theme } = useTheme();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<'loading' | 'success' | 'fail'>('loading');
  const [message, setMessage] = useState('');

  useEffect(() => {
    // 获取 URL 参数
    const outTradeNo = searchParams.get('out_trade_no');
    const tradeNo = searchParams.get('trade_no');
    const result = searchParams.get('result');

    if (result === 'success' || outTradeNo) {
      setStatus('success');
      setMessage('支付成功！您的订单已处理完成。');
    } else {
      setStatus('fail');
      setMessage('支付未完成，如有问题请联系客服。');
    }
  }, [searchParams]);

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
      fontSize: '5rem',
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
    },
    secondaryButton: {
      padding: '0.875rem 2rem',
      borderRadius: 10,
      border: `1px solid ${theme === 'dark' ? '#60a5fa' : '#8B5CF6'}`,
      backgroundColor: 'transparent',
      color: theme === 'dark' ? '#60a5fa' : '#8B5CF6',
      fontSize: '1rem',
      fontWeight: 600,
      cursor: 'pointer',
      textDecoration: 'none',
      display: 'inline-block',
      marginLeft: '1rem'
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        {status === 'loading' ? (
          <>
            <div style={{ ...styles.icon, animation: 'spin 1s linear infinite' }}>⏳</div>
            <h1 style={styles.title}>处理中...</h1>
            <p style={styles.message}>正在查询支付结果，请稍候</p>
          </>
        ) : status === 'success' ? (
          <>
            <div style={{ ...styles.icon, color: '#10b981' }}>✅</div>
            <h1 style={styles.title}>支付成功</h1>
            <p style={styles.message}>{message}</p>
            <div>
              <a href="/membership" style={styles.button}>
                查看会员中心
              </a>
              <a href="/" style={styles.secondaryButton}>
                返回首页
              </a>
            </div>
          </>
        ) : (
          <>
            <div style={{ ...styles.icon, color: '#ef4444' }}>❌</div>
            <h1 style={styles.title}>支付未完成</h1>
            <p style={styles.message}>{message}</p>
            <div>
              <a href="/membership" style={styles.button}>
                重新支付
              </a>
              <a href="/" style={styles.secondaryButton}>
                返回首页
              </a>
            </div>
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
        <div style={{ fontSize: '5rem', marginBottom: '1.5rem' }}>⏳</div>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 700, marginBottom: '1rem' }}>
          处理中...
        </h1>
        <p style={{ fontSize: '1rem', color: '#64748B' }}>正在查询支付结果，请稍候</p>
      </div>
    </div>
  );
}

/**
 * 支付结果页面
 * 使用 Suspense 包装使用 useSearchParams 的组件
 */
export default function PaymentResultPage() {
  return (
    <Suspense fallback={<LoadingState />}>
      <PaymentResultContent />
    </Suspense>
  );
}

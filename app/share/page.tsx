"use client";
import React, { useState } from 'react';
import { useTheme } from '../components/ThemeProvider';

export default function SharePage() {
  const { theme } = useTheme();
  const [selectedPlatform, setSelectedPlatform] = useState('微信');
  const [shareText, setShareText] = useState('看看我用 AI 生成的穿搭效果图！');
  const [imageUrl, setImageUrl] = useState('https://example.com/generated-image.jpg');
  const [showSuccess, setShowSuccess] = useState(false);

  // 动态样式
  const styles: { [key: string]: React.CSSProperties } = {
    container: {
      padding: '2rem',
      maxWidth: 1200,
      margin: '0 auto',
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column'
    },
    header: {
      marginBottom: '2.5rem'
    },
    title: {
      fontSize: '2.25rem',
      fontWeight: 700,
      marginBottom: '0.75rem',
      lineHeight: 1.2,
      display: 'inline-block',
      backgroundImage: theme === 'dark'
        ? 'linear-gradient(90deg, #60a5fa, #a78bfa)'
        : 'linear-gradient(90deg, #8B5CF6, #EC4899)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      backgroundClip: 'text',
      color: 'transparent'
    },
    subtitle: {
      fontSize: '1.125rem',
      color: theme === 'dark' ? '#a3a3a3' : '#64748b',
      maxWidth: 600
    },
    section: {
      marginBottom: '3rem'
    },
    sectionTitle: {
      fontSize: '1.5rem',
      fontWeight: 600,
      marginBottom: '1.5rem',
      color: theme === 'dark' ? '#e5e7eb' : '#1e293b'
    },
    sharePlatforms: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))',
      gap: '1.25rem',
      marginTop: '1rem'
    },
    platformItem: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      padding: '1.5rem 1rem',
      border: `2px solid ${theme === 'dark' ? '#2b3240' : '#E2E8F0'}`,
      borderRadius: 12,
      cursor: 'pointer',
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      backgroundColor: theme === 'dark' ? '#1f2a3a' : 'white',
      boxShadow: theme === 'dark'
        ? '0 4px 6px -1px rgba(0, 0, 0, 0.3)'
        : '0 2px 4px 0 rgba(0, 0, 0, 0.05)',
      position: 'relative',
      overflow: 'hidden',
      transform: 'translateY(0)'
    },
    platformItemActive: {
      border: `2px solid ${theme === 'dark' ? '#60a5fa' : '#8B5CF6'}`,
      backgroundColor: theme === 'dark' ? '#1e293b' : '#F3E8FF',
      boxShadow: theme === 'dark' 
        ? '0 8px 16px -4px rgba(96, 165, 250, 0.2)' 
        : '0 4px 12px -2px rgba(139, 92, 246, 0.2)'
    },
    platformItemHover: {
      transform: 'translateY(-4px)',
      boxShadow: theme === 'dark' 
        ? '0 10px 25px -5px rgba(96, 165, 250, 0.25)' 
        : '0 8px 24px -4px rgba(139, 92, 246, 0.25)'
    },
    platformIcon: {
      fontSize: '2.5rem',
      marginBottom: '0.75rem',
      transition: 'transform 0.3s ease'
    },
    platformIconActive: {
      transform: 'scale(1.1)'
    },
    platformName: {
      fontSize: '0.95rem',
      fontWeight: 500,
      color: theme === 'dark' ? '#e5e7eb' : '#475569',
      textAlign: 'center'
    },
    platformNameActive: {
      color: theme === 'dark' ? '#60a5fa' : '#8B5CF6',
      fontWeight: 600
    },
    card: {
      marginTop: '2rem',
      padding: '2rem',
      border: `1px solid ${theme === 'dark' ? '#2b3240' : '#E2E8F0'}`,
      borderRadius: 16,
      backgroundColor: theme === 'dark' ? '#1f2a3a' : 'white',
      boxShadow: theme === 'dark' 
        ? '0 8px 16px -4px rgba(0, 0, 0, 0.4)' 
        : '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
      transition: 'all 0.3s ease'
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
      transition: 'all 0.2s ease',
      outline: 'none'
    },
    inputFocus: {
      borderColor: theme === 'dark' ? '#60a5fa' : '#8b5cf6',
      backgroundColor: theme === 'dark' ? 'rgba(96,165,250,0.1)' : 'rgba(139,92,246,0.08)',
      boxShadow: theme === 'dark' 
        ? '0 0 0 3px rgba(96, 165, 250, 0.15)' 
        : '0 0 0 3px rgba(139, 92, 246, 0.15)'
    },
    textarea: {
      width: '100%',
      padding: '0.875rem 1rem',
      borderRadius: 12,
      border: `1px solid ${theme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)'}`,
      backgroundColor: theme === 'dark' ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)',
      color: theme === 'dark' ? '#ffffff' : '#1e293b',
      fontSize: '1rem',
      fontWeight: 500,
      resize: 'vertical',
      minHeight: 100,
      transition: 'all 0.2s ease',
      outline: 'none'
    },
    checkboxContainer: {
      marginTop: '1rem',
      display: 'flex',
      alignItems: 'center',
      gap: '0.75rem'
    },
    checkbox: {
      width: 18,
      height: 18,
      cursor: 'pointer',
      accentColor: theme === 'dark' ? '#60a5fa' : '#8B5CF6'
    },
    checkboxLabel: {
      fontSize: '0.95rem',
      color: theme === 'dark' ? '#e5e7eb' : '#475569',
      cursor: 'pointer'
    },
    button: {
      padding: '1rem 2rem',
      borderRadius: 8,
      border: 'none',
      backgroundColor: theme === 'dark' ? '#60a5fa' : '#8B5CF6',
      color: 'white',
      cursor: 'pointer',
      fontSize: '1rem',
      fontWeight: 600,
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      boxShadow: theme === 'dark'
        ? '0 4px 12px -2px rgba(96, 165, 250, 0.3)'
        : '0 4px 12px -2px rgba(139, 92, 246, 0.3)',
      marginTop: '1.5rem',
      position: 'relative',
      overflow: 'hidden',
      transform: 'translateY(0)'
    },
    buttonHover: {
      transform: 'translateY(-2px)',
      boxShadow: theme === 'dark' 
        ? '0 8px 24px -4px rgba(96, 165, 250, 0.4)' 
        : '0 8px 24px -4px rgba(139, 92, 246, 0.4)',
      backgroundColor: theme === 'dark' ? '#3b82f6' : '#7c3aed'
    },
    buttonActive: {
      transform: 'translateY(0)',
      boxShadow: theme === 'dark' 
        ? '0 2px 6px -1px rgba(96, 165, 250, 0.3)' 
        : '0 2px 6px -1px rgba(139, 92, 246, 0.3)'
    },
    previewContainer: {
      display: 'flex',
      gap: '2rem',
      alignItems: 'center',
      justifyContent: 'center',
      flexWrap: 'wrap',
      marginTop: '1.5rem',
      padding: '1.5rem',
      border: `1px solid ${theme === 'dark' ? '#2b3240' : '#E2E8F0'}`,
      borderRadius: 12,
      backgroundColor: theme === 'dark' ? '#141b2a' : '#f8fafc'
    },
    previewImage: {
      width: 220,
      height: 280,
      borderRadius: 12,
      backgroundColor: theme === 'dark' ? '#2b3240' : '#E2E8F0',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      boxShadow: theme === 'dark' 
        ? '0 4px 12px -2px rgba(0, 0, 0, 0.3)' 
        : '0 2px 8px -1px rgba(0, 0, 0, 0.1)',
      overflow: 'hidden',
      position: 'relative'
    },
    previewImageContent: {
      fontSize: '3rem',
      opacity: 0.7
    },
    previewContent: {
      flex: '1 1 350px',
      maxWidth: 500
    },
    previewText: {
      fontSize: '1.125rem',
      lineHeight: '1.6',
      color: theme === 'dark' ? '#e5e7eb' : '#1e293b',
      marginBottom: '1rem'
    },
    previewCredit: {
      fontSize: '0.9rem',
      color: theme === 'dark' ? '#a3a3a3' : '#94A3B8',
      fontStyle: 'italic'
    },
    successMessage: {
      position: 'fixed',
      top: '2rem',
      right: '2rem',
      padding: '1rem 1.5rem',
      backgroundColor: theme === 'dark' ? '#10b981' : '#10b981',
      color: 'white',
      borderRadius: 8,
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
      zIndex: 1000
    }
  };

const platforms = [
  { name: '微信', icon: '💬', url: 'weixin://' },
  { name: '小红书', icon: '📖', url: 'xiaohongshu://' },
  { name: 'Instagram', icon: '📷', url: 'instagram://' },
  { name: '微博', icon: '📱', url: 'sinaweibo://' },
  { name: '复制链接', icon: '🔗', action: 'copy' },
  { name: '下载图片', icon: '💾', action: 'download' }
];

  const onSelectPlatform = (platform: string) => {
    setSelectedPlatform(platform);
  };

  const onShare = () => {
    const platform = platforms.find(p => p.name === selectedPlatform);
    if (!platform) return;

    if (platform.action === 'copy') {
      // 复制链接到剪贴板
      navigator.clipboard.writeText(window.location.href)
        .then(() => {
          setShowSuccess(true);
          setTimeout(() => setShowSuccess(false), 3000);
        })
        .catch(err => {
          console.error('复制失败:', err);
          alert('复制失败，请手动复制链接');
        });
    } else if (platform.action === 'download') {
      // 下载图片
      const link = document.createElement('a');
      link.href = imageUrl;
      link.download = `ai-outfit-${Date.now()}.jpg`;
      link.click();
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    } else if (platform.url) {
      // 打开对应平台的分享
      window.open(platform.url, '_blank');
    }
  };

  return (
    <div style={styles.container}>
      {/* 成功消息 */}
      {showSuccess && (
        <div style={styles.successMessage}>
          操作成功完成！
        </div>
      )}

      {/* 页面标题 */}
      <div style={styles.header}>
        <h1 style={styles.title}>社交分享</h1>
        <p style={styles.subtitle}>分享生成的穿搭效果图到社交平台，或下载到本地，让更多人看到你的创意搭配。</p>
      </div>
      
      {/* 平台选择部分 */}
      <section style={styles.section}>
        <h2 style={styles.sectionTitle}>选择分享平台</h2>
        <div style={styles.sharePlatforms}>
          {platforms.map((platform, idx) => {
            const isActive = selectedPlatform === platform.name;
            return (
              <div
                key={idx}
                onClick={() => onSelectPlatform(platform.name)}
                style={{
                  ...styles.platformItem,
                  ...(isActive ? styles.platformItemActive : {})
                }}
                onMouseEnter={(e) => {
                  const target = e.currentTarget as HTMLElement;
                  Object.entries(styles.platformItemHover).forEach(([key, value]) => {
                    (target.style as any)[key] = value;
                  });
                }}
                onMouseLeave={(e) => {
                  const target = e.currentTarget as HTMLElement;
                  Object.entries({
                    ...styles.platformItem,
                    ...(isActive ? styles.platformItemActive : {})
                  }).forEach(([key, value]) => {
                    (target.style as any)[key] = value;
                  });
                }}
              >
                <div style={{
                  ...styles.platformIcon,
                  ...(isActive ? styles.platformIconActive : {})
                }}>{platform.icon}</div>
                <span style={{
                  ...styles.platformName,
                  ...(isActive ? styles.platformNameActive : {})
                }}>{platform.name}</span>
              </div>
            );
          })}
        </div>
      </section>
      
      {/* 分享内容部分 */}
      <section style={styles.card}>
        <h2 style={styles.sectionTitle}>分享内容</h2>
        <div style={styles.formGroup}>
          <label htmlFor="shareText" style={styles.label}>分享文案</label>
          <textarea
            id="shareText"
            value={shareText}
            onChange={(e) => setShareText(e.target.value)}
            style={styles.textarea}
            placeholder="输入分享文案，让你的分享更有吸引力..."
          />
        </div>
        <div style={styles.formGroup}>
          <label htmlFor="imageUrl" style={styles.label}>图片链接</label>
          <input
            id="imageUrl"
            type="text"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            style={styles.input}
            placeholder="输入图片链接"
          />
        </div>
        <div style={styles.checkboxContainer}>
          <input 
            type="checkbox" 
            id="addWatermark" 
            style={styles.checkbox} 
          />
          <label htmlFor="addWatermark" style={styles.checkboxLabel}>添加水印</label>
        </div>
        <div style={{ textAlign: 'center', marginTop: '2rem' }}>
          <button
            onClick={onShare}
            style={styles.button}
            onMouseEnter={(e) => {
              const target = e.currentTarget as HTMLButtonElement;
              Object.entries(styles.buttonHover).forEach(([key, value]) => {
                (target.style as any)[key] = value;
              });
            }}
            onMouseLeave={(e) => {
              const target = e.currentTarget as HTMLButtonElement;
              Object.entries(styles.button).forEach(([key, value]) => {
                (target.style as any)[key] = value;
              });
            }}
            onMouseDown={(e) => {
              const target = e.currentTarget as HTMLButtonElement;
              Object.entries(styles.buttonActive).forEach(([key, value]) => {
                (target.style as any)[key] = value;
              });
            }}
            onMouseUp={(e) => {
              const target = e.currentTarget as HTMLButtonElement;
              Object.entries(styles.buttonHover).forEach(([key, value]) => {
                (target.style as any)[key] = value;
              });
            }}
          >
            分享到 {selectedPlatform}
          </button>
        </div>
      </section>
      
      {/* 分享预览部分 */}
      <section style={styles.card}>
        <h2 style={styles.sectionTitle}>分享预览</h2>
        <div style={styles.previewContainer}>
          <div style={styles.previewImage}>
            <div style={styles.previewImageContent}>📸</div>
          </div>
          <div style={styles.previewContent}>
            <p style={styles.previewText}>{shareText}</p>
            <p style={styles.previewCredit}>通过 AI 服装模特生成工具创建</p>
          </div>
        </div>
      </section>
    </div>
  );
}

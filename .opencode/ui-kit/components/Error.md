# Error 错误状态组件

## 设计概述

**设计哲学**：友好的错误提示，引导用户解决问题

**核心特征**：
- 清晰的错误类型图标
- 详细的错误说明
- 可操作的建议
- 优雅的视觉呈现

## 视觉效果

### 基础样式

```jsx
const Error = ({ 
  type = 'default', // 'default' | '404' | '403' | '500' | 'network' | 'empty'
  title,
  description,
  image,
  actions,
  size = 'default' // 'small' | 'default' | 'large'
}) => {
  const errorConfig = {
    default: {
      icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><circle cx="12" cy="12" r="10"/><path d="M12 8v4m0 4h.01"/></svg>,
      color: '#EF4444',
      defaultTitle: '出错了',
      defaultDesc: '抱歉，发生了一些错误'
    },
    404: {
      icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>,
      color: '#6B7280',
      defaultTitle: '404',
      defaultDesc: '抱歉，您访问的页面不存在'
    },
    403: {
      icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>,
      color: '#F59E0B',
      defaultTitle: '403',
      defaultDesc: '抱歉，您没有权限访问此页面'
    },
    500: {
      icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>,
      color: '#EF4444',
      defaultTitle: '500',
      defaultDesc: '服务器内部错误，请稍后重试'
    },
    network: {
      icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><line x1="1" y1="1" x2="23" y2="23"/><path d="M16.72 11.06A10.94 10.94 0 0119 12.55M5 12.55a10.94 10.94 0 015.17-2.39M10.71 5.05A16 16 0 0122.58 9M1.42 9a15.91 15.91 0 014.7-2.88M8.53 16.11a6 6 0 016.95 0M12 20h.01"/></svg>,
      color: '#6B7280',
      defaultTitle: '网络错误',
      defaultDesc: '无法连接到服务器，请检查网络'
    },
    empty: {
      icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"/></svg>,
      color: '#9CA3AF',
      defaultTitle: '暂无数据',
      defaultDesc: '这里还没有内容'
    }
  };
  
  const config = errorConfig[type];
  
  return (
    <div className={`error-state error-${type} error-${size}`}>
      <div className="error-icon-wrapper" style={{ color: config.color }}>
        {image || <div className="error-icon">{config.icon}</div>}
      </div>
      <h3 className="error-title">{title || config.defaultTitle}</h3>
      <p className="error-description">{description || config.defaultDesc}</p>
      {actions && (
        <div className="error-actions">
          {actions}
        </div>
      )}
    </div>
  );
};
```

### CSS样式

```css
/* ===== 基础变量 ===== */
.error-state {
  --error-padding: 48px 24px;
  --error-icon-size: 64px;
  --error-title-size: 20px;
  --error-desc-size: 14px;
  --error-title-color: #111827;
  --error-desc-color: #6B7280;
}

/* ===== 容器 ===== */
.error-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: var(--error-padding);
  max-width: 500px;
  margin: 0 auto;
}

/* ===== 图标 ===== */
.error-icon-wrapper {
  margin-bottom: 24px;
}

.error-icon {
  width: var(--error-icon-size);
  height: var(--error-icon-size);
}

.error-icon svg {
  width: 100%;
  height: 100%;
  stroke-width: 1.5;
}

/* ===== 标题 ===== */
.error-title {
  font-size: var(--error-title-size);
  font-weight: 600;
  color: var(--error-title-color);
  margin: 0 0 8px 0;
  line-height: 1.4;
}

/* ===== 描述 ===== */
.error-description {
  font-size: var(--error-desc-size);
  color: var(--error-desc-color);
  margin: 0 0 24px 0;
  line-height: 1.6;
}

/* ===== 操作按钮 ===== */
.error-actions {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  justify-content: center;
}

.error-actions button {
  padding: 10px 20px;
  font-size: 14px;
  font-weight: 500;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.error-actions button.primary {
  background-color: #3B82F6;
  color: white;
  border: none;
}

.error-actions button.primary:hover {
  background-color: #2563EB;
}

.error-actions button.secondary {
  background-color: transparent;
  color: #374151;
  border: 1px solid #D1D5DB;
}

.error-actions button.secondary:hover {
  background-color: #F9FAFB;
  border-color: #9CA3AF;
}

/* ===== 尺寸变体 ===== */
.error-small {
  --error-padding: 24px;
  --error-icon-size: 40px;
  --error-title-size: 16px;
  --error-desc-size: 13px;
}

.error-small .error-icon-wrapper {
  margin-bottom: 16px;
}

.error-large {
  --error-padding: 64px 32px;
  --error-icon-size: 120px;
  --error-title-size: 28px;
  --error-desc-size: 16px;
}

.error-large .error-icon-wrapper {
  margin-bottom: 32px;
}

/* ===== 特定类型样式 ===== */
.error-404 .error-title {
  font-size: 72px;
  font-weight: 700;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  line-height: 1;
  margin-bottom: 16px;
}

.error-403 .error-title,
.error-500 .error-title {
  font-size: 72px;
  font-weight: 700;
  color: var(--error-title-color);
  line-height: 1;
  margin-bottom: 16px;
}

/* ===== 暗色模式 ===== */
@media (prefers-color-scheme: dark) {
  .error-state {
    --error-title-color: #F9FAFB;
    --error-desc-color: #9CA3AF;
  }
  
  .error-actions button.secondary {
    color: #E5E7EB;
    border-color: #4B5563;
  }
  
  .error-actions button.secondary:hover {
    background-color: #374151;
    border-color: #6B7280;
  }
}
```

## 设计亮点

1. **丰富的错误类型**：404/403/500/网络/空状态全覆盖
2. **SVG图标**：每种错误类型有独特的图标设计
3. **渐变标题**：404使用渐变色，增强视觉吸引力
4. **操作引导**：提供明确的操作按钮，帮助用户解决问题
5. **多种尺寸**：small/default/large适应不同场景

## 使用示例

### 基础错误

```jsx
<Error 
  type="default"
  title="操作失败"
  description="无法保存您的更改，请稍后重试"
  actions={[
    <button className="primary" onClick={retry}>重试</button>,
    <button className="secondary" onClick={cancel}>取消</button>
  ]}
/>
```

### 404页面

```jsx
<Error 
  type="404"
  description="您访问的页面可能已经删除或不存在"
  actions={[
    <button className="primary" onClick={() => router.push('/')}>返回首页</button>
  ]}
  size="large"
/>
```

### 网络错误

```jsx
<Error 
  type="network"
  description="请检查您的网络连接是否正常"
  actions={[
    <button className="primary" onClick={refresh}>刷新页面</button>
  ]}
/>
```

### 空状态

```jsx
<Error 
  type="empty"
  title="暂无订单"
  description="您还没有任何订单，快去选购吧"
  actions={[
    <button className="primary" onClick={() => router.push('/products')}>去购物</button>
  ]}
/>
```

## 最佳实践

- 提供具体的错误描述，避免"系统错误"等模糊信息
- 总是提供可操作的建议或按钮
- 区分用户错误和系统错误
- 空状态使用温和的颜色，避免给用户压力

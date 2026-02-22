# StatCard 统计卡片组件

## 设计概述

**设计哲学**：数据可视化与美学的完美结合，突出关键指标

**核心特征**：
- 清晰的数据层级
- 趋势指示器
- 精致的图标设计
- 悬停交互反馈

## 视觉效果

### 基础样式

```jsx
const StatCard = ({ 
  title,
  value,
  prefix,
  suffix,
  trend,
  trendValue,
  icon,
  color = 'blue', // 'blue' | 'green' | 'red' | 'yellow' | 'purple'
  size = 'default', // 'small' | 'default' | 'large'
  loading = false,
  onClick
}) => {
  const colorMap = {
    blue: { bg: '#EFF6FF', icon: '#3B82F6', text: '#1E40AF' },
    green: { bg: '#ECFDF5', icon: '#10B981', text: '#065F46' },
    red: { bg: '#FEF2F2', icon: '#EF4444', text: '#991B1B' },
    yellow: { bg: '#FFFBEB', icon: '#F59E0B', text: '#92400E' },
    purple: { bg: '#F5F3FF', icon: '#8B5CF6', text: '#5B21B6' }
  };
  
  const theme = colorMap[color];
  
  return (
    <div 
      className={`stat-card stat-card-${size} ${onClick ? 'is-clickable' : ''} ${loading ? 'is-loading' : ''}`}
      onClick={onClick}
    >
      <div className="stat-card-header">
        <span className="stat-card-title">{title}</span>
        {icon && (
          <div className="stat-card-icon" style={{ backgroundColor: theme.bg, color: theme.icon }}>
            {icon}
          </div>
        )}
      </div>
      
      <div className="stat-card-body">
        {loading ? (
          <div className="stat-card-skeleton">
            <div className="skeleton-value"></div>
            <div className="skeleton-trend"></div>
          </div>
        ) : (
          <>
            <div className="stat-card-value" style={{ color: theme.text }}>
              {prefix && <span className="stat-card-prefix">{prefix}</span>}
              <span className="stat-card-number">{value}</span>
              {suffix && <span className="stat-card-suffix">{suffix}</span>}
            </div>
            
            {trend && (
              <div className={`stat-card-trend stat-card-trend-${trend}`}>
                <svg className="trend-icon" viewBox="0 0 20 20" fill="currentColor">
                  {trend === 'up' ? (
                    <path fillRule="evenodd" d="M12 7l-5-5-5 5h10z" clipRule="evenodd" transform="rotate(0 10 10)"/>
                  ) : (
                    <path fillRule="evenodd" d="M12 13l-5 5-5-5h10z" clipRule="evenodd" transform="rotate(0 10 10)"/>
                  )}
                </svg>
                <span>{trendValue}</span>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};
```

### CSS样式

```css
/* ===== 基础变量 ===== */
.stat-card {
  --stat-card-bg: #FFFFFF;
  --stat-card-border: #E5E7EB;
  --stat-card-radius: 12px;
  --stat-card-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
  --stat-card-shadow-hover: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
  --stat-card-transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

/* ===== 容器 ===== */
.stat-card {
  background-color: var(--stat-card-bg);
  border: 1px solid var(--stat-card-border);
  border-radius: var(--stat-card-radius);
  box-shadow: var(--stat-card-shadow);
  padding: 20px;
  transition: var(--stat-card-transition);
  position: relative;
  overflow: hidden;
}

.stat-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: linear-gradient(90deg, transparent, rgba(59, 130, 246, 0.3), transparent);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.stat-card:hover {
  box-shadow: var(--stat-card-shadow-hover);
  transform: translateY(-2px);
}

.stat-card:hover::before {
  opacity: 1;
}

.stat-card.is-clickable {
  cursor: pointer;
}

/* ===== 头部 ===== */
.stat-card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 12px;
}

.stat-card-title {
  font-size: 13px;
  font-weight: 500;
  color: #6B7280;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

/* ===== 图标 ===== */
.stat-card-icon {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  flex-shrink: 0;
}

/* ===== 数据主体 ===== */
.stat-card-body {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

/* ===== 数值 ===== */
.stat-card-value {
  display: flex;
  align-items: baseline;
  gap: 4px;
  font-weight: 700;
}

.stat-card-prefix,
.stat-card-suffix {
  font-size: 18px;
  font-weight: 600;
  opacity: 0.8;
}

.stat-card-number {
  font-size: 28px;
  line-height: 1.2;
}

/* ===== 趋势 ===== */
.stat-card-trend {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 13px;
  font-weight: 500;
  padding: 4px 8px;
  border-radius: 6px;
  width: fit-content;
}

.stat-card-trend-up {
  color: #059669;
  background-color: #D1FAE5;
}

.stat-card-trend-down {
  color: #DC2626;
  background-color: #FEE2E2;
}

.trend-icon {
  width: 14px;
  height: 14px;
}

/* ===== 尺寸变体 ===== */
.stat-card-small {
  padding: 16px;
}

.stat-card-small .stat-card-icon {
  width: 32px;
  height: 32px;
  font-size: 16px;
}

.stat-card-small .stat-card-number {
  font-size: 22px;
}

.stat-card-large {
  padding: 24px;
}

.stat-card-large .stat-card-icon {
  width: 48px;
  height: 48px;
  font-size: 24px;
}

.stat-card-large .stat-card-number {
  font-size: 36px;
}

/* ===== 加载状态 ===== */
.stat-card.is-loading {
  pointer-events: none;
}

.stat-card-skeleton {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.skeleton-value {
  height: 32px;
  background: linear-gradient(90deg, #F3F4F6 25%, #E5E7EB 50%, #F3F4F6 75%);
  background-size: 200% 100%;
  border-radius: 6px;
  animation: skeleton-loading 1.5s ease-in-out infinite;
}

.skeleton-trend {
  height: 24px;
  width: 80px;
  background: linear-gradient(90deg, #F3F4F6 25%, #E5E7EB 50%, #F3F4F6 75%);
  background-size: 200% 100%;
  border-radius: 6px;
  animation: skeleton-loading 1.5s ease-in-out infinite;
  animation-delay: 0.2s;
}

@keyframes skeleton-loading {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}

/* ===== 暗色模式 ===== */
@media (prefers-color-scheme: dark) {
  .stat-card {
    --stat-card-bg: #1F2937;
    --stat-card-border: #374151;
    --stat-card-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.3);
  }
  
  .stat-card-title {
    color: #9CA3AF;
  }
  
  .skeleton-value,
  .skeleton-trend {
    background: linear-gradient(90deg, #374151 25%, #4B5563 50%, #374151 75%);
    background-size: 200% 100%;
  }
}
```

## 设计亮点

1. **渐变顶部装饰线**：悬停时出现，增加质感
2. **悬停上浮效果**：提升交互体验
3. **色彩主题系统**：5种预设主题，灵活适配
4. **加载骨架屏**：优雅的数据加载状态
5. **清晰的趋势指示**：上升绿色/下降红色，一目了然

## 使用示例

### 基础使用

```jsx
<StatCard
  title="总收入"
  value="¥128,450"
  trend="up"
  trendValue="+12.5%"
  icon={<DollarIcon />}
  color="green"
/>
```

### 带点击事件

```jsx
<StatCard
  title="活跃用户"
  value="2,847"
  trend="up"
  trendValue="+5.2%"
  icon={<UsersIcon />}
  color="blue"
  onClick={() => router.push('/users')}
/>
```

### 加载状态

```jsx
<StatCard
  title="订单数"
  loading
/>
```

### 不同尺寸

```jsx
<StatCard size="small" title="小尺寸" value="100" />
<StatCard size="default" title="默认" value="1,000" />
<StatCard size="large" title="大尺寸" value="10,000" />
```

## 最佳实践

- 使用简洁的标题文字
- 数字格式化（千分位、货币符号等）
- 趋势值显示百分比变化
- 相关数据使用相同颜色主题

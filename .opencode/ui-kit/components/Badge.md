# Badge 标签组件

## 设计概述

**设计哲学**：小巧精致，信息一目了然

**核心特征**：
- 多种预设颜色主题
- 支持点和文字两种模式
- 动态计数显示
- 精致的圆角和阴影

## 视觉效果

### 基础样式

```jsx
const Badge = ({ 
  children,
  count,
  dot = false,
  status, // 'success' | 'processing' | 'default' | 'error' | 'warning'
  color = 'blue', // 'blue' | 'green' | 'red' | 'yellow' | 'purple' | 'gray'
  text,
  offset,
  showZero = false,
  overflowCount = 99
}) => {
  const displayCount = count > overflowCount ? `${overflowCount}+` : count;
  const showBadge = dot || (count !== undefined && (count > 0 || showZero));
  
  return (
    <span className="badge-wrapper">
      {children}
      {showBadge && (
        <span 
          className={`badge badge-${color} ${dot ? 'badge-dot' : 'badge-count'} ${status ? `badge-status-${status}` : ''}`}
          style={offset ? { top: offset[0], right: offset[1] } : {}}
        >
          {!dot && displayCount}
          {status && !dot && !count && <span className="badge-status-dot"></span>}
        </span>
      )}
      {text && !children && (
        <span className={`badge badge-${color} badge-text`}>
          {text}
        </span>
      )}
    </span>
  );
};
```

### CSS样式

```css
/* ===== 基础变量 ===== */
.badge-wrapper {
  position: relative;
  display: inline-flex;
  vertical-align: middle;
}

/* ===== 基础标签 ===== */
.badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 600;
  line-height: 1;
  white-space: nowrap;
  vertical-align: middle;
  transition: all 0.2s ease;
}

/* ===== 数字徽章 ===== */
.badge-count {
  min-width: 20px;
  height: 20px;
  padding: 0 6px;
  border-radius: 10px;
  color: white;
  box-shadow: 0 0 0 2px #FFFFFF;
}

/* ===== 点状徽章 ===== */
.badge-dot {
  position: absolute;
  top: 0;
  right: 0;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  box-shadow: 0 0 0 2px #FFFFFF;
  transform: translate(50%, -50%);
}

/* ===== 文字标签 ===== */
.badge-text {
  height: 22px;
  padding: 0 10px;
  border-radius: 4px;
  font-weight: 500;
}

/* ===== 颜色主题 ===== */
.badge-blue {
  background-color: #3B82F6;
}

.badge-blue.badge-text {
  color: #1E40AF;
  background-color: #DBEAFE;
}

.badge-green {
  background-color: #10B981;
}

.badge-green.badge-text {
  color: #065F46;
  background-color: #D1FAE5;
}

.badge-red {
  background-color: #EF4444;
}

.badge-red.badge-text {
  color: #991B1B;
  background-color: #FEE2E2;
}

.badge-yellow {
  background-color: #F59E0B;
}

.badge-yellow.badge-text {
  color: #92400E;
  background-color: #FEF3C7;
}

.badge-purple {
  background-color: #8B5CF6;
}

.badge-purple.badge-text {
  color: #5B21B6;
  background-color: #EDE9FE;
}

.badge-gray {
  background-color: #6B7280;
}

.badge-gray.badge-text {
  color: #374151;
  background-color: #F3F4F6;
}

/* ===== 状态徽章 ===== */
.badge-status-success {
  background-color: #10B981;
}

.badge-status-processing {
  background-color: #3B82F6;
  animation: badge-processing 1s infinite;
}

.badge-status-default {
  background-color: #6B7280;
}

.badge-status-error {
  background-color: #EF4444;
}

.badge-status-warning {
  background-color: #F59E0B;
}

@keyframes badge-processing {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.6;
  }
}

/* ===== 状态指示点 ===== */
.badge-status-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  margin-right: 6px;
}

.badge-status-success .badge-status-dot {
  background-color: #10B981;
}

.badge-status-processing .badge-status-dot {
  background-color: #3B82F6;
}

.badge-status-error .badge-status-dot {
  background-color: #EF4444;
}

.badge-status-warning .badge-status-dot {
  background-color: #F59E0B;
}

.badge-status-default .badge-status-dot {
  background-color: #6B7280;
}

/* ===== 独立使用 ===== */
.badge-wrapper > .badge:not(.badge-dot) {
  position: relative;
  transform: none;
}

/* ===== 暗色模式 ===== */
@media (prefers-color-scheme: dark) {
  .badge-count,
  .badge-dot {
    box-shadow: 0 0 0 2px #1F2937;
  }
  
  .badge-blue.badge-text {
    color: #93C5FD;
    background-color: rgba(59, 130, 246, 0.2);
  }
  
  .badge-green.badge-text {
    color: #6EE7B7;
    background-color: rgba(16, 185, 129, 0.2);
  }
  
  .badge-red.badge-text {
    color: #FCA5A5;
    background-color: rgba(239, 68, 68, 0.2);
  }
}
```

## 设计亮点

1. **精致的阴影效果**：数字徽章带2px白色边框阴影，与背景分离
2. **动态处理**：超过99显示"99+"，节省空间
3. **状态动画**：processing状态带呼吸灯效果
4. **灵活的布局**：支持包裹子元素或独立使用
5. **双重模式**：填充色用于数字，浅色用于文字标签

## 使用示例

### 基础使用

```jsx
<Badge count={5}>
  <BellIcon />
</Badge>
```

### 点状提示

```jsx
<Badge dot>
  <MailIcon />
</Badge>
```

### 文字标签

```jsx
<Badge text="新功能" color="green" />
<Badge text="热门" color="red" />
<Badge text="测试版" color="yellow" />
```

### 状态指示

```jsx
<Badge status="success" text="运行中" />
<Badge status="processing" text="处理中" />
<Badge status="error" text="错误" />
```

### 自定义偏移

```jsx
<Badge count={8} offset={[5, 5]}>
  <Avatar src={user.avatar} />
</Badge>
```

## 最佳实践

- 数字建议不超过3位数，超出使用"99+"
- 重要状态使用红色徽章
- 新功能/更新使用绿色或蓝色徽章
- 点状徽章用于未读提示

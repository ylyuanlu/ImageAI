# Loading 加载组件

## 设计概述

**设计哲学**：优雅的等待体验，减少用户焦虑

**核心特征**：
- 多种加载动画类型
- 支持全屏和局部加载
- 加载文案提示
- 骨架屏预加载

## 视觉效果

### 基础样式

```jsx
const Loading = ({ 
  size = 'default', // 'small' | 'default' | 'large'
  type = 'spinner', // 'spinner' | 'dots' | 'pulse' | 'skeleton'
  text,
  fullscreen = false,
  mask = false,
  delay = 0
}) => {
  const [show, setShow] = useState(delay === 0);
  
  useEffect(() => {
    if (delay > 0) {
      const timer = setTimeout(() => setShow(true), delay);
      return () => clearTimeout(timer);
    }
  }, [delay]);
  
  if (!show) return null;
  
  const content = (
    <div className={`loading loading-${type} loading-${size} ${fullscreen ? 'is-fullscreen' : ''}`}>
      {type === 'spinner' && (
        <div className="loading-spinner">
          <svg viewBox="0 0 50 50">
            <circle cx="25" cy="25" r="20" fill="none" strokeWidth="4"></circle>
          </svg>
        </div>
      )}
      
      {type === 'dots' && (
        <div className="loading-dots">
          <span></span>
          <span></span>
          <span></span>
        </div>
      )}
      
      {type === 'pulse' && (
        <div className="loading-pulse">
          <div className="pulse-ring"></div>
          <div className="pulse-ring"></div>
          <div className="pulse-ring"></div>
        </div>
      )}
      
      {text && <span className="loading-text">{text}</span>}
    </div>
  );
  
  if (mask || fullscreen) {
    return (
      <div className={`loading-mask ${fullscreen ? 'is-fullscreen' : ''}`}>
        {content}
      </div>
    );
  }
  
  return content;
};
```

### CSS样式

```css
/* ===== 基础变量 ===== */
.loading {
  --loading-color: #3B82F6;
  --loading-text: #6B7280;
  --loading-size-sm: 24px;
  --loading-size-default: 32px;
  --loading-size-lg: 48px;
}

/* ===== 容器 ===== */
.loading {
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
}

/* ===== 转圈加载 ===== */
.loading-spinner {
  position: relative;
  width: var(--loading-size-default);
  height: var(--loading-size-default);
}

.loading-spinner svg {
  animation: loading-rotate 1s linear infinite;
  width: 100%;
  height: 100%;
}

.loading-spinner circle {
  stroke: var(--loading-color);
  stroke-linecap: round;
  animation: loading-dash 1.5s ease-in-out infinite;
  stroke-dasharray: 80, 200;
  stroke-dashoffset: 0;
}

@keyframes loading-rotate {
  100% {
    transform: rotate(360deg);
  }
}

@keyframes loading-dash {
  0% {
    stroke-dasharray: 1, 200;
    stroke-dashoffset: 0;
  }
  50% {
    stroke-dasharray: 89, 200;
    stroke-dashoffset: -35px;
  }
  100% {
    stroke-dasharray: 89, 200;
    stroke-dashoffset: -124px;
  }
}

/* ===== 点状加载 ===== */
.loading-dots {
  display: flex;
  gap: 6px;
}

.loading-dots span {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: var(--loading-color);
  animation: loading-dots 1.4s ease-in-out infinite both;
}

.loading-dots span:nth-child(1) {
  animation-delay: -0.32s;
}

.loading-dots span:nth-child(2) {
  animation-delay: -0.16s;
}

@keyframes loading-dots {
  0%, 80%, 100% {
    transform: scale(0);
    opacity: 0.5;
  }
  40% {
    transform: scale(1);
    opacity: 1;
  }
}

/* ===== 脉冲加载 ===== */
.loading-pulse {
  position: relative;
  width: var(--loading-size-default);
  height: var(--loading-size-default);
}

.pulse-ring {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 100%;
  height: 100%;
  border-radius: 50%;
  border: 2px solid var(--loading-color);
  opacity: 0;
  animation: loading-pulse 1.5s cubic-bezier(0, 0.2, 0.8, 1) infinite;
}

.pulse-ring:nth-child(2) {
  animation-delay: -0.5s;
}

.pulse-ring:nth-child(3) {
  animation-delay: -1s;
}

@keyframes loading-pulse {
  0% {
    transform: translate(-50%, -50%) scale(0.5);
    opacity: 1;
  }
  100% {
    transform: translate(-50%, -50%) scale(1.2);
    opacity: 0;
  }
}

/* ===== 加载文字 ===== */
.loading-text {
  font-size: 14px;
  color: var(--loading-text);
  animation: loading-text-pulse 1.5s ease-in-out infinite;
}

@keyframes loading-text-pulse {
  0%, 100% {
    opacity: 0.6;
  }
  50% {
    opacity: 1;
  }
}

/* ===== 尺寸变体 ===== */
.loading-small .loading-spinner,
.loading-small .loading-pulse {
  width: var(--loading-size-sm);
  height: var(--loading-size-sm);
}

.loading-small .loading-dots span {
  width: 6px;
  height: 6px;
}

.loading-large .loading-spinner,
.loading-large .loading-pulse {
  width: var(--loading-size-lg);
  height: var(--loading-size-lg);
}

.loading-large .loading-dots span {
  width: 12px;
  height: 12px;
}

/* ===== 遮罩层 ===== */
.loading-mask {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(255, 255, 255, 0.9);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  backdrop-filter: blur(2px);
}

.loading-mask.is-fullscreen {
  position: fixed;
  background-color: rgba(255, 255, 255, 0.95);
}

/* ===== 骨架屏 ===== */
.loading-skeleton {
  background: linear-gradient(90deg, #F3F4F6 25%, #E5E7EB 50%, #F3F4F6 75%);
  background-size: 200% 100%;
  animation: skeleton-loading 1.5s ease-in-out infinite;
  border-radius: 4px;
}

@keyframes skeleton-loading {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}

/* ===== 暗色模式 ===== */
@media (prefers-color-scheme: dark) {
  .loading {
    --loading-text: #9CA3AF;
  }
  
  .loading-mask {
    background-color: rgba(31, 41, 55, 0.9);
  }
  
  .loading-mask.is-fullscreen {
    background-color: rgba(31, 41, 55, 0.95);
  }
  
  .loading-skeleton {
    background: linear-gradient(90deg, #374151 25%, #4B5563 50%, #374151 75%);
    background-size: 200% 100%;
  }
}
```

## 设计亮点

1. **平滑的SVG动画**：转圈使用stroke-dasharray实现流畅动画
2. **多种加载类型**：spinner适合通用场景，dots适合小空间，pulse适合强调
3. **延迟显示**：避免快速操作时的闪烁
4. **文字呼吸效果**：减少等待焦虑
5. **毛玻璃遮罩**：modern backdrop-filter效果

## 使用示例

### 基础使用

```jsx
<Loading />
<Loading text="加载中..." />
<Loading type="dots" />
<Loading type="pulse" size="large" />
```

### 带遮罩

```jsx
<div style={{ position: 'relative' }}>
  <DataTable data={data} />
  {loading && <Loading mask text="数据加载中..." />}
</div>
```

### 全屏加载

```jsx
<Loading fullscreen text="系统初始化中..." />
```

### 骨架屏

```jsx
<div className="skeleton-card">
  <div className="loading-skeleton" style={{ height: 20, width: '60%' }}></div>
  <div className="loading-skeleton" style={{ height: 14, width: '100%', marginTop: 12 }}></div>
  <div className="loading-skeleton" style={{ height: 14, width: '80%', marginTop: 8 }}></div>
</div>
```

## 最佳实践

- 加载时间超过300ms才显示，避免闪烁
- 长时间加载提供进度提示或取消按钮
- 数据加载使用骨架屏，提升感知性能
- 全屏加载用于页面初始化或关键操作

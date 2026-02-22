# Checkbox 复选框组件

## 设计概述

**设计理念**：清晰、现代、富有反馈感

**核心特征**：
- 精致的选中动画
- 清晰的选中状态指示
- 良好的触控区域
- 优雅的过渡效果

## 视觉效果

### 基础样式

```jsx
const Checkbox = ({ 
  label,
  checked,
  onChange,
  disabled = false,
  indeterminate = false,
  size = 'default', // 'small' | 'default' | 'large'
  error
}) => {
  return (
    <label className={`checkbox-wrapper ${disabled ? 'is-disabled' : ''} ${error ? 'has-error' : ''}`}>
      <div className="checkbox-input-wrapper">
        <input
          type="checkbox"
          checked={checked}
          onChange={onChange}
          disabled={disabled}
          className={`checkbox-input checkbox-${size}`}
          ref={el => {
            if (el) el.indeterminate = indeterminate;
          }}
        />
        <div className="checkbox-custom">
          <svg className="checkbox-icon" viewBox="0 0 24 24" fill="none">
            <path 
              className="checkbox-checkmark" 
              d="M5 13l4 4L19 7" 
              stroke="currentColor" 
              strokeWidth="2.5" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </div>
      {label && (
        <span className="checkbox-label">{label}</span>
      )}
    </label>
  );
};
```

### CSS样式

```css
/* ===== 基础变量 ===== */
.checkbox-wrapper {
  --checkbox-size-sm: 16px;
  --checkbox-size-default: 20px;
  --checkbox-size-lg: 24px;
  --checkbox-color: #3B82F6;
  --checkbox-color-hover: #2563EB;
  --checkbox-border: #D1D5DB;
  --checkbox-border-hover: #9CA3AF;
  --checkbox-bg: #FFFFFF;
  --checkbox-bg-checked: #3B82F6;
  --checkbox-radius: 5px;
  --checkbox-transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  --checkbox-shadow-focus: 0 0 0 3px rgba(59, 130, 246, 0.15);
}

/* ===== 容器 ===== */
.checkbox-wrapper {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  user-select: none;
  position: relative;
}

.checkbox-wrapper.is-disabled {
  cursor: not-allowed;
  opacity: 0.6;
}

/* ===== 原生输入框（隐藏但可访问） ===== */
.checkbox-input {
  position: absolute;
  opacity: 0;
  width: 0;
  height: 0;
  pointer-events: none;
}

/* ===== 自定义复选框 ===== */
.checkbox-input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}

.checkbox-custom {
  width: var(--checkbox-size-default);
  height: var(--checkbox-size-default);
  border: 2px solid var(--checkbox-border);
  border-radius: var(--checkbox-radius);
  background-color: var(--checkbox-bg);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: var(--checkbox-transition);
  position: relative;
  overflow: hidden;
}

/* 选中状态的背景动画 */
.checkbox-custom::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 0;
  height: 0;
  background-color: var(--checkbox-bg-checked);
  border-radius: 50%;
  transform: translate(-50%, -50%);
  transition: width 0.2s ease, height 0.2s ease;
}

/* ===== 勾选图标 ===== */
.checkbox-icon {
  width: 14px;
  height: 14px;
  color: white;
  position: relative;
  z-index: 1;
  opacity: 0;
  transform: scale(0.5);
  transition: all 0.15s cubic-bezier(0.4, 0, 0.2, 1);
}

.checkbox-checkmark {
  stroke-dasharray: 20;
  stroke-dashoffset: 20;
  transition: stroke-dashoffset 0.2s ease 0.1s;
}

/* ===== 选中状态 ===== */
.checkbox-input:checked + .checkbox-custom {
  border-color: var(--checkbox-color);
}

.checkbox-input:checked + .checkbox-custom::before {
  width: 150%;
  height: 150%;
}

.checkbox-input:checked + .checkbox-custom .checkbox-icon {
  opacity: 1;
  transform: scale(1);
}

.checkbox-input:checked + .checkbox-custom .checkbox-checkmark {
  stroke-dashoffset: 0;
}

/* ===== 不确定状态 ===== */
.checkbox-input:indeterminate + .checkbox-custom {
  border-color: var(--checkbox-color);
  background-color: var(--checkbox-bg-checked);
}

.checkbox-input:indeterminate + .checkbox-custom::after {
  content: '';
  width: 10px;
  height: 2px;
  background-color: white;
  border-radius: 1px;
}

/* ===== 悬停状态 ===== */
.checkbox-wrapper:not(.is-disabled):hover .checkbox-custom {
  border-color: var(--checkbox-border-hover);
}

.checkbox-wrapper:not(.is-disabled):hover .checkbox-input:checked + .checkbox-custom {
  border-color: var(--checkbox-color-hover);
  background-color: var(--checkbox-color-hover);
}

.checkbox-wrapper:not(.is-disabled):hover .checkbox-input:checked + .checkbox-custom::before {
  background-color: var(--checkbox-color-hover);
}

/* ===== 聚焦状态 ===== */
.checkbox-input:focus + .checkbox-custom {
  box-shadow: var(--checkbox-shadow-focus);
  border-color: var(--checkbox-color);
}

/* ===== 禁用状态 ===== */
.checkbox-wrapper.is-disabled .checkbox-custom {
  background-color: #F3F4F6;
  border-color: #E5E7EB;
}

.checkbox-wrapper.is-disabled .checkbox-input:checked + .checkbox-custom {
  background-color: #9CA3AF;
  border-color: #9CA3AF;
}

.checkbox-wrapper.is-disabled .checkbox-input:checked + .checkbox-custom::before {
  background-color: #9CA3AF;
}

/* ===== 尺寸变体 ===== */
.checkbox-small .checkbox-custom {
  width: var(--checkbox-size-sm);
  height: var(--checkbox-size-sm);
  border-radius: 4px;
}

.checkbox-small .checkbox-icon {
  width: 11px;
  height: 11px;
}

.checkbox-large .checkbox-custom {
  width: var(--checkbox-size-lg);
  height: var(--checkbox-size-lg);
  border-radius: 6px;
}

.checkbox-large .checkbox-icon {
  width: 16px;
  height: 16px;
}

/* ===== 标签 ===== */
.checkbox-label {
  font-size: 14px;
  color: #374151;
  line-height: 1.5;
  transition: color 0.2s ease;
}

.checkbox-wrapper:hover:not(.is-disabled) .checkbox-label {
  color: #111827;
}

.checkbox-wrapper.is-disabled .checkbox-label {
  color: #9CA3AF;
}

/* ===== 错误状态 ===== */
.checkbox-wrapper.has-error .checkbox-custom {
  border-color: #EF4444;
}

.checkbox-wrapper.has-error .checkbox-input:checked + .checkbox-custom {
  background-color: #EF4444;
  border-color: #EF4444;
}

.checkbox-wrapper.has-error .checkbox-input:focus + .checkbox-custom {
  box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.15);
}

/* ===== 组样式 ===== */
.checkbox-group {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.checkbox-group-horizontal {
  flex-direction: row;
  flex-wrap: wrap;
  gap: 16px;
}

/* ===== 暗色模式 ===== */
@media (prefers-color-scheme: dark) {
  .checkbox-wrapper {
    --checkbox-border: #4B5563;
    --checkbox-border-hover: #6B7280;
    --checkbox-bg: #1F2937;
    --checkbox-bg-checked: #3B82F6;
  }
  
  .checkbox-label {
    color: #E5E7EB;
  }
  
  .checkbox-wrapper:hover:not(.is-disabled) .checkbox-label {
    color: #F9FAFB;
  }
}
```

## 设计亮点

1. **精致的动画效果**：背景从中心扩散，勾选线逐帧绘制
2. **无障碍设计**：原生input保留，支持键盘导航和屏幕阅读器
3. **明确的视觉反馈**：悬停、聚焦、选中状态清晰可辨
4. **不确定状态支持**：适合全选/部分选中的场景
5. **优雅的过渡**：200ms的缓动函数，交互流畅自然

## 使用示例

### 基础使用

```jsx
<Checkbox 
  label="我已阅读并同意服务条款"
  checked={agreed}
  onChange={(e) => setAgreed(e.target.checked)}
/>
```

### 组使用

```jsx
<div className="checkbox-group">
  <Checkbox 
    label="全选"
    checked={allSelected}
    indeterminate={someSelected}
    onChange={handleSelectAll}
  />
  {items.map(item => (
    <Checkbox 
      key={item.id}
      label={item.name}
      checked={item.selected}
      onChange={() => toggleItem(item.id)}
    />
  ))}
</div>
```

### 不同尺寸

```jsx
<Checkbox size="small" label="小尺寸" checked={checked} onChange={onChange} />
<Checkbox size="default" label="默认尺寸" checked={checked} onChange={onChange} />
<Checkbox size="large" label="大尺寸" checked={checked} onChange={onChange} />
```

## 最佳实践

- 使用清晰的标签文字说明选项含义
- 相关选项使用Checkbox Group组织
- 不确定状态时显示横线而非对勾
- 保持足够的点击区域（44x44px）

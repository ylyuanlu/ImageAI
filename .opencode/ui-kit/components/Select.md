# Select 下拉选择组件

## 设计概述

**设计哲学**：现代简约风格，注重用户体验和视觉层次

**适用场景**：
- 表单中的选项选择
- 筛选条件选择
- 设置项选择

## 视觉效果

### 基础样式

```jsx
const Select = ({ 
  label,
  options,
  value,
  onChange,
  placeholder = '请选择',
  disabled = false,
  error,
  size = 'default', // 'small' | 'default' | 'large'
  variant = 'default' // 'default' | 'outlined' | 'filled'
}) => {
  return (
    <div className="select-wrapper">
      {label && (
        <label className="select-label">
          {label}
        </label>
      )}
      <div className={`select-container ${error ? 'has-error' : ''} ${disabled ? 'is-disabled' : ''}`}>
        <select 
          value={value} 
          onChange={onChange}
          disabled={disabled}
          className={`select-input select-${size} select-${variant}`}
        >
          <option value="" disabled>{placeholder}</option>
          {options.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <div className="select-arrow">
          <svg viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </div>
      </div>
      {error && (
        <span className="select-error">{error}</span>
      )}
    </div>
  );
};
```

### CSS样式

```css
/* ===== 基础变量 ===== */
.select-wrapper {
  --select-height-sm: 32px;
  --select-height-default: 40px;
  --select-height-lg: 48px;
  --select-radius: 8px;
  --select-border: #E5E7EB;
  --select-border-focus: #3B82F6;
  --select-bg: #FFFFFF;
  --select-bg-hover: #F9FAFB;
  --select-text: #111827;
  --select-text-placeholder: #9CA3AF;
  --select-error: #EF4444;
  --select-shadow-focus: 0 0 0 3px rgba(59, 130, 246, 0.1);
  --select-transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

/* ===== 容器 ===== */
.select-wrapper {
  display: flex;
  flex-direction: column;
  gap: 6px;
  width: 100%;
}

/* ===== 标签 ===== */
.select-label {
  font-size: 14px;
  font-weight: 500;
  color: #374151;
  line-height: 1.5;
}

/* ===== 选择器容器 ===== */
.select-container {
  position: relative;
  display: flex;
  align-items: center;
}

/* ===== 选择器输入框 ===== */
.select-input {
  width: 100%;
  height: var(--select-height-default);
  padding: 0 40px 0 14px;
  font-size: 14px;
  font-weight: 400;
  color: var(--select-text);
  background-color: var(--select-bg);
  border: 1.5px solid var(--select-border);
  border-radius: var(--select-radius);
  cursor: pointer;
  appearance: none;
  -webkit-appearance: none;
  transition: var(--select-transition);
  outline: none;
}

/* 占位符样式 */
.select-input option:first-child {
  color: var(--select-text-placeholder);
}

/* 悬停状态 */
.select-input:hover:not(:disabled) {
  border-color: #D1D5DB;
  background-color: var(--select-bg-hover);
}

/* 聚焦状态 */
.select-input:focus {
  border-color: var(--select-border-focus);
  box-shadow: var(--select-shadow-focus);
}

/* 禁用状态 */
.select-input:disabled {
  background-color: #F3F4F6;
  color: #9CA3AF;
  cursor: not-allowed;
}

/* ===== 尺寸变体 ===== */
.select-small {
  height: var(--select-height-sm);
  padding: 0 36px 0 10px;
  font-size: 13px;
}

.select-large {
  height: var(--select-height-lg);
  padding: 0 44px 0 16px;
  font-size: 15px;
}

/* ===== 风格变体 ===== */
.select-outlined {
  background-color: transparent;
  border-width: 2px;
}

.select-filled {
  background-color: #F3F4F6;
  border-color: transparent;
}

.select-filled:hover:not(:disabled) {
  background-color: #E5E7EB;
}

/* ===== 下拉箭头 ===== */
.select-arrow {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  width: 20px;
  height: 20px;
  color: #6B7280;
  pointer-events: none;
  transition: var(--select-transition);
}

.select-input:focus ~ .select-arrow {
  color: var(--select-border-focus);
}

.select-container.is-disabled .select-arrow {
  color: #D1D5DB;
}

/* ===== 错误状态 ===== */
.select-container.has-error .select-input {
  border-color: var(--select-error);
}

.select-container.has-error .select-input:focus {
  box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
}

.select-error {
  font-size: 12px;
  color: var(--select-error);
  margin-top: 4px;
}

/* ===== 暗色模式 ===== */
@media (prefers-color-scheme: dark) {
  .select-wrapper {
    --select-border: #374151;
    --select-bg: #1F2937;
    --select-bg-hover: #374151;
    --select-text: #F9FAFB;
    --select-text-placeholder: #6B7280;
  }
  
  .select-input:disabled {
    background-color: #374151;
  }
}
```

## 交互设计

### 状态流转

```
默认 → 悬停 → 聚焦 → 选中
  ↓      ↓       ↓       ↓
默认边框  深边框   主题色   主题色+阴影
```

### 动效设计

```css
/* 聚焦时的平滑过渡 */
.select-input {
  transition: border-color 0.2s ease, box-shadow 0.2s ease, background-color 0.2s ease;
}

/* 下拉箭头旋转（如果使用自定义下拉） */
.select-arrow {
  transition: transform 0.2s ease;
}

.select-input:focus ~ .select-arrow {
  transform: translateY(-50%) rotate(180deg);
}
```

## 使用示例

### 基础使用

```jsx
<Select
  label="选择分类"
  placeholder="请选择商品分类"
  value={category}
  onChange={(e) => setCategory(e.target.value)}
  options={[
    { value: 'electronics', label: '数码电子' },
    { value: 'clothing', label: '服装配饰' },
    { value: 'food', label: '食品饮料' },
    { value: 'home', label: '家居生活' }
  ]}
/>
```

### 带错误状态

```jsx
<Select
  label="配送地址"
  value={address}
  onChange={handleAddressChange}
  options={addressOptions}
  error={errors.address}
/>
```

### 不同尺寸

```jsx
<Select size="small" placeholder="小尺寸" options={options} />
<Select size="default" placeholder="默认尺寸" options={options} />
<Select size="large" placeholder="大尺寸" options={options} />
```

### 禁用状态

```jsx
<Select disabled value="fixed" options={[{ value: 'fixed', label: '固定值' }]} />
```

## 设计亮点

1. **高质感边框**：1.5px边框，聚焦时呈现主题色光晕
2. **清晰的视觉层次**：标签、输入框、错误提示层次分明
3. **精致的箭头图标**：使用Heroicons风格，与整体设计统一
4. **平滑的过渡动效**：200ms过渡，提升交互质感
5. **完善的错误反馈**：红色边框+文字提示，符合无障碍标准
6. **暗色模式支持**：自动适配系统主题

## 最佳实践

- 始终提供`placeholder`提示
- 选项超过10个时考虑使用搜索功能
- 使用清晰的`label`标签说明
- 禁用状态明确标示原因

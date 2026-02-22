# Radio 单选框组件

## 设计概述

**设计哲学**：简洁优雅，一目了然的选择体验

**核心特征**：
- 圆形设计符合单选语义
- 选中状态有明显的视觉变化
- 平滑的过渡动画
- 清晰的选中指示

## 视觉效果

### 基础样式

```jsx
const Radio = ({ 
  label,
  name,
  value,
  checked,
  onChange,
  disabled = false,
  size = 'default',
  error
}) => {
  return (
    <label className={`radio-wrapper ${disabled ? 'is-disabled' : ''} ${error ? 'has-error' : ''}`}>
      <div className="radio-input-wrapper">
        <input
          type="radio"
          name={name}
          value={value}
          checked={checked}
          onChange={onChange}
          disabled={disabled}
          className={`radio-input radio-${size}`}
        />
        <div className="radio-custom">
          <div className="radio-inner"></div>
        </div>
      </div>
      {label && (
        <span className="radio-label">{label}</span>
      )}
    </label>
  );
};
```

### CSS样式

```css
/* ===== 基础变量 ===== */
.radio-wrapper {
  --radio-size-sm: 16px;
  --radio-size-default: 20px;
  --radio-size-lg: 24px;
  --radio-color: #3B82F6;
  --radio-color-hover: #2563EB;
  --radio-border: #D1D5DB;
  --radio-border-hover: #9CA3AF;
  --radio-bg: #FFFFFF;
  --radio-inner-color: #3B82F6;
  --radio-transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  --radio-shadow-focus: 0 0 0 3px rgba(59, 130, 246, 0.15);
}

/* ===== 容器 ===== */
.radio-wrapper {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  user-select: none;
  position: relative;
}

.radio-wrapper.is-disabled {
  cursor: not-allowed;
  opacity: 0.6;
}

/* ===== 原生输入框 ===== */
.radio-input {
  position: absolute;
  opacity: 0;
  width: 0;
  height: 0;
  pointer-events: none;
}

/* ===== 自定义单选框 ===== */
.radio-input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}

.radio-custom {
  width: var(--radio-size-default);
  height: var(--radio-size-default);
  border: 2px solid var(--radio-border);
  border-radius: 50%;
  background-color: var(--radio-bg);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: var(--radio-transition);
  position: relative;
}

/* 内部圆点 */
.radio-inner {
  width: 0;
  height: 0;
  background-color: var(--radio-inner-color);
  border-radius: 50%;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  transform: scale(0);
}

/* ===== 选中状态 ===== */
.radio-input:checked + .radio-custom {
  border-color: var(--radio-color);
}

.radio-input:checked + .radio-custom .radio-inner {
  width: 50%;
  height: 50%;
  transform: scale(1);
}

/* ===== 悬停状态 ===== */
.radio-wrapper:not(.is-disabled):hover .radio-custom {
  border-color: var(--radio-border-hover);
}

.radio-wrapper:not(.is-disabled):hover .radio-input:checked + .radio-custom {
  border-color: var(--radio-color-hover);
}

.radio-wrapper:not(.is-disabled):hover .radio-input:checked + .radio-custom .radio-inner {
  background-color: var(--radio-color-hover);
}

/* ===== 聚焦状态 ===== */
.radio-input:focus + .radio-custom {
  box-shadow: var(--radio-shadow-focus);
  border-color: var(--radio-color);
}

/* ===== 禁用状态 ===== */
.radio-wrapper.is-disabled .radio-custom {
  background-color: #F3F4F6;
  border-color: #E5E7EB;
}

.radio-wrapper.is-disabled .radio-input:checked + .radio-custom {
  border-color: #9CA3AF;
}

.radio-wrapper.is-disabled .radio-inner {
  background-color: #9CA3AF;
}

/* ===== 尺寸变体 ===== */
.radio-small .radio-custom {
  width: var(--radio-size-sm);
  height: var(--radio-size-sm);
}

.radio-small .radio-input:checked + .radio-custom .radio-inner {
  width: 6px;
  height: 6px;
}

.radio-large .radio-custom {
  width: var(--radio-size-lg);
  height: var(--radio-size-lg);
}

.radio-large .radio-input:checked + .radio-custom .radio-inner {
  width: 10px;
  height: 10px;
}

/* ===== 标签 ===== */
.radio-label {
  font-size: 14px;
  color: #374151;
  line-height: 1.5;
  transition: color 0.2s ease;
}

.radio-wrapper:hover:not(.is-disabled) .radio-label {
  color: #111827;
}

.radio-wrapper.is-disabled .radio-label {
  color: #9CA3AF;
}

/* ===== 错误状态 ===== */
.radio-wrapper.has-error .radio-custom {
  border-color: #EF4444;
}

.radio-wrapper.has-error .radio-input:checked + .radio-custom {
  border-color: #EF4444;
}

.radio-wrapper.has-error .radio-input:checked + .radio-custom .radio-inner {
  background-color: #EF4444;
}

.radio-wrapper.has-error .radio-input:focus + .radio-custom {
  box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.15);
}

/* ===== 组样式 ===== */
.radio-group {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.radio-group-horizontal {
  flex-direction: row;
  flex-wrap: wrap;
  gap: 20px;
}

/* ===== 卡片样式变体 ===== */
.radio-card {
  padding: 16px;
  border: 1.5px solid #E5E7EB;
  border-radius: 10px;
  background-color: #FFFFFF;
  transition: all 0.2s ease;
}

.radio-card:hover {
  border-color: #D1D5DB;
}

.radio-card.selected {
  border-color: #3B82F6;
  background-color: #EFF6FF;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

/* ===== 暗色模式 ===== */
@media (prefers-color-scheme: dark) {
  .radio-wrapper {
    --radio-border: #4B5563;
    --radio-border-hover: #6B7280;
    --radio-bg: #1F2937;
  }
  
  .radio-label {
    color: #E5E7EB;
  }
  
  .radio-wrapper:hover:not(.is-disabled) .radio-label {
    color: #F9FAFB;
  }
  
  .radio-card {
    background-color: #1F2937;
    border-color: #374151;
  }
  
  .radio-card.selected {
    background-color: rgba(59, 130, 246, 0.1);
  }
}
```

## 设计亮点

1. **圆形语义明确**：符合用户对单选的认知
2. **弹性内圆动画**：从0缩放到50%，视觉反馈清晰
3. **卡片变体**：适合复杂选项的展示
4. **组内互斥**：同name自动实现单选逻辑
5. **平滑过渡**：200ms缓动，交互自然

## 使用示例

### 基础使用

```jsx
<RadioGroup name="payment" value={payment} onChange={setPayment}>
  <Radio label="支付宝" value="alipay" />
  <Radio label="微信支付" value="wechat" />
  <Radio label="银行卡" value="card" />
</RadioGroup>
```

### 卡片样式

```jsx
<div className="radio-group">
  {plans.map(plan => (
    <label 
      key={plan.id}
      className={`radio-card ${selectedPlan === plan.id ? 'selected' : ''}`}
    >
      <Radio 
        name="plan"
        value={plan.id}
        checked={selectedPlan === plan.id}
        onChange={() => setSelectedPlan(plan.id)}
      />
      <div className="plan-content">
        <h4>{plan.name}</h4>
        <p>{plan.description}</p>
        <span className="price">{plan.price}</span>
      </div>
    </label>
  ))}
</div>
```

## 最佳实践

- 选项不超过5个使用标准样式，超过5个考虑使用Select
- 复杂选项使用卡片样式，展示更多信息
- 保持选项标签简洁明了
- 必要时添加选项说明文字

# Textarea 多行文本组件

## 设计概述

**设计哲学**：简洁优雅的文本输入体验，适合长文本编辑

**核心特征**：
- 动态调整高度（auto-resize）
- 字符计数显示
- 清晰的焦点状态
- 优雅的滚动条样式

## 视觉效果

### 基础样式

```jsx
const Textarea = ({ 
  label,
  placeholder,
  value,
  onChange,
  rows = 4,
  maxLength,
  showCount = false,
  disabled = false,
  error,
  autoResize = false,
  size = 'default'
}) => {
  const textareaRef = useRef(null);
  
  useEffect(() => {
    if (autoResize && textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
    }
  }, [value, autoResize]);
  
  return (
    <div className={`textarea-wrapper ${error ? 'has-error' : ''} ${disabled ? 'is-disabled' : ''}`}>
      {(label || (showCount && maxLength)) && (
        <div className="textarea-header">
          {label && <label className="textarea-label">{label}</label>}
          {showCount && maxLength && (
            <span className={`textarea-count ${value?.length >= maxLength ? 'is-limit' : ''}`}>
              {value?.length || 0}/{maxLength}
            </span>
          )}
        </div>
      )}
      <textarea
        ref={textareaRef}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        rows={autoResize ? 1 : rows}
        maxLength={maxLength}
        className={`textarea-input textarea-${size}`}
      />
      {error && <span className="textarea-error">{error}</span>}
    </div>
  );
};
```

### CSS样式

```css
/* ===== 基础变量 ===== */
.textarea-wrapper {
  --textarea-min-height: 80px;
  --textarea-radius: 8px;
  --textarea-border: #E5E7EB;
  --textarea-border-hover: #D1D5DB;
  --textarea-border-focus: #3B82F6;
  --textarea-bg: #FFFFFF;
  --textarea-bg-disabled: #F9FAFB;
  --textarea-text: #111827;
  --textarea-text-placeholder: #9CA3AF;
  --textarea-error: #EF4444;
  --textarea-shadow-focus: 0 0 0 3px rgba(59, 130, 246, 0.1);
  --textarea-transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

/* ===== 容器 ===== */
.textarea-wrapper {
  display: flex;
  flex-direction: column;
  gap: 6px;
  width: 100%;
}

/* ===== 头部（标签+计数） ===== */
.textarea-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

/* ===== 标签 ===== */
.textarea-label {
  font-size: 14px;
  font-weight: 500;
  color: #374151;
  line-height: 1.5;
}

/* ===== 字符计数 ===== */
.textarea-count {
  font-size: 12px;
  color: #6B7280;
  transition: color 0.2s ease;
}

.textarea-count.is-limit {
  color: var(--textarea-error);
  font-weight: 500;
}

/* ===== 文本域输入框 ===== */
.textarea-input {
  width: 100%;
  min-height: var(--textarea-min-height);
  padding: 12px 14px;
  font-size: 14px;
  line-height: 1.6;
  color: var(--textarea-text);
  background-color: var(--textarea-bg);
  border: 1.5px solid var(--textarea-border);
  border-radius: var(--textarea-radius);
  resize: vertical;
  font-family: inherit;
  transition: var(--textarea-transition);
  outline: none;
}

/* 占位符样式 */
.textarea-input::placeholder {
  color: var(--textarea-text-placeholder);
}

/* 悬停状态 */
.textarea-input:hover:not(:disabled) {
  border-color: var(--textarea-border-hover);
}

/* 聚焦状态 */
.textarea-input:focus {
  border-color: var(--textarea-border-focus);
  box-shadow: var(--textarea-shadow-focus);
}

/* 禁用状态 */
.textarea-input:disabled {
  background-color: var(--textarea-bg-disabled);
  color: #9CA3AF;
  cursor: not-allowed;
  resize: none;
}

/* ===== 尺寸变体 ===== */
.textarea-small {
  padding: 8px 12px;
  font-size: 13px;
  min-height: 60px;
}

.textarea-large {
  padding: 16px 18px;
  font-size: 15px;
  min-height: 100px;
}

/* ===== 错误状态 ===== */
.textarea-wrapper.has-error .textarea-input {
  border-color: var(--textarea-error);
}

.textarea-wrapper.has-error .textarea-input:focus {
  box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
}

.textarea-error {
  font-size: 12px;
  color: var(--textarea-error);
  margin-top: 4px;
}

/* ===== 自定义滚动条 ===== */
.textarea-input::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

.textarea-input::-webkit-scrollbar-track {
  background: #F3F4F6;
  border-radius: 4px;
}

.textarea-input::-webkit-scrollbar-thumb {
  background: #D1D5DB;
  border-radius: 4px;
  border: 2px solid #F3F4F6;
}

.textarea-input::-webkit-scrollbar-thumb:hover {
  background: #9CA3AF;
}

/* ===== 暗色模式 ===== */
@media (prefers-color-scheme: dark) {
  .textarea-wrapper {
    --textarea-border: #374151;
    --textarea-border-hover: #4B5563;
    --textarea-bg: #1F2937;
    --textarea-bg-disabled: #374151;
    --textarea-text: #F9FAFB;
    --textarea-text-placeholder: #6B7280;
  }
  
  .textarea-input::-webkit-scrollbar-track {
    background: #374151;
  }
  
  .textarea-input::-webkit-scrollbar-thumb {
    background: #4B5563;
    border-color: #374151;
  }
  
  .textarea-input::-webkit-scrollbar-thumb:hover {
    background: #6B7280;
  }
}
```

## 设计亮点

1. **优雅的滚动条**：自定义样式，与整体设计协调
2. **字符计数**：实时显示，超限提示
3. **自动高度调整**：根据内容自适应
4. **清晰的焦点环**：聚焦时有光晕效果
5. **多尺寸支持**：small/default/large适应不同场景

## 使用示例

### 基础使用

```jsx
<Textarea
  label="备注"
  placeholder="请输入备注信息..."
  value={note}
  onChange={(e) => setNote(e.target.value)}
  rows={4}
/>
```

### 带字符限制

```jsx
<Textarea
  label="个人简介"
  placeholder="介绍一下你自己..."
  value={bio}
  onChange={(e) => setBio(e.target.value)}
  maxLength={200}
  showCount
  autoResize
/>
```

### 错误状态

```jsx
<Textarea
  label="反馈意见"
  value={feedback}
  onChange={(e) => setFeedback(e.target.value)}
  error={errors.feedback}
/>
```

## 最佳实践

- 预估文本长度设置合适的初始行数
- 需要限制长度时显示字符计数
- 使用autoResize提升长文本编辑体验
- 提供清晰的placeholder提示

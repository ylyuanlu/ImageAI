# Divider 分隔线组件

## 设计概述

**设计哲学**：优雅的内容分隔，提升视觉层次

**核心特征**：
- 水平、垂直两种方向
- 支持文字标签
- 多种样式变体
- 可自定义间距

## 视觉效果

### 基础样式

```jsx
const Divider = ({ 
  children,
  orientation = 'horizontal', // 'horizontal' | 'vertical'
  type = 'solid', // 'solid' | 'dashed' | 'dotted'
  variant = 'fullWidth', // 'fullWidth' | 'inset' | 'middle'
  textPosition = 'center', // 'left' | 'center' | 'right'
  className
}) => {
  const classes = [
    'divider',
    `divider-${orientation}`,
    `divider-${type}`,
    `divider-${variant}`,
    children && 'divider-with-text',
    children && `divider-text-${textPosition}`,
    className
  ].filter(Boolean).join(' ');
  
  if (children) {
    return (
      <div className={classes}>
        <span className="divider-line divider-line-before"></span>
        <span className="divider-text">{children}</span>
        <span className="divider-line divider-line-after"></span>
      </div>
    );
  }
  
  return <div className={classes} />;
};
```

### CSS样式

```css
/* ===== 基础变量 ===== */
.divider {
  --divider-color: #E5E7EB;
  --divider-text-color: #6B7280;
  --divider-thickness: 1px;
  --divider-margin: 24px 0;
  --divider-margin-inset: 16px 72px;
  --divider-margin-middle: 16px 72px;
  --divider-text-padding: 0 16px;
  --divider-text-size: 14px;
}

/* ===== 水平分隔线 ===== */
.divider-horizontal {
  display: flex;
  clear: both;
  width: 100%;
  min-width: 100%;
  margin: var(--divider-margin);
  border-top: var(--divider-thickness) solid var(--divider-color);
}

/* ===== 垂直分隔线 ===== */
.divider-vertical {
  display: inline-block;
  height: 1em;
  margin: 0 12px;
  vertical-align: middle;
  border-left: var(--divider-thickness) solid var(--divider-color);
}

/* ===== 样式类型 ===== */
.divider-solid {
  border-style: solid;
}

.divider-dashed {
  border-style: dashed;
}

.divider-dotted {
  border-style: dotted;
}

/* ===== 变体 ===== */
.divider-inset {
  margin: var(--divider-margin-inset);
  width: calc(100% - 144px);
}

.divider-middle {
  margin: var(--divider-margin-middle);
  width: calc(100% - 144px);
}

/* ===== 带文字的分隔线 ===== */
.divider-with-text {
  display: flex;
  align-items: center;
  margin: var(--divider-margin);
  border: none;
  white-space: nowrap;
  text-align: center;
  font-size: var(--divider-text-size);
  color: var(--divider-text-color);
}

.divider-line {
  position: relative;
  top: 50%;
  width: 50%;
  border-top: var(--divider-thickness) solid var(--divider-color);
  transform: translateY(50%);
}

.divider-line-before {
  width: 50%;
}

.divider-line-after {
  width: 50%;
}

.divider-text {
  display: inline-block;
  padding: var(--divider-text-padding);
  font-size: var(--divider-text-size);
  font-weight: 500;
  color: var(--divider-text-color);
}

/* 文字位置 */
.divider-text-left .divider-line-before {
  width: 5%;
}

.divider-text-left .divider-line-after {
  width: 95%;
}

.divider-text-right .divider-line-before {
  width: 95%;
}

.divider-text-right .divider-line-after {
  width: 5%;
}

/* ===== 暗色模式 ===== */
@media (prefers-color-scheme: dark) {
  .divider {
    --divider-color: #374151;
    --divider-text-color: #9CA3AF;
  }
}
```

## 设计亮点

1. **三种样式**：solid实线、dashed虚线、dotted点线
2. **文字支持**：可在分隔线中间或两侧添加文字
3. **灵活变体**：fullWidth全宽、inset缩进、middle中间对齐
4. **双方向**：水平和垂直两种方向
5. **优雅的间距**：合理的margin确保视觉呼吸感

## 使用示例

### 基础分隔线

```jsx
<p>第一段内容</p>
<Divider />
<p>第二段内容</p>
```

### 带文字

```jsx
<Divider>或</Divider>
<Divider textPosition="left">左侧文字</Divider>
<Divider textPosition="right">右侧文字</Divider>
```

### 不同样式

```jsx
<Divider type="dashed" />
<Divider type="dotted" />
```

### 垂直分隔线

```jsx
<span>文字1</span>
<Divider orientation="vertical" />
<span>文字2</span>
<Divider orientation="vertical" />
<span>文字3</span>
```

### 缩进变体

```jsx
<Divider variant="inset" />
<Divider variant="middle">中间对齐</Divider>
```

## 最佳实践

- 相关内容使用分隔线区分
- 带文字的分隔线用于"或"、"以及"等连接场景
- 表单中使用inset变体减少视觉重量
- 垂直分隔线用于内联元素分隔

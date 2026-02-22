# Container 容器组件

## 设计概述

**设计哲学**：智能的内容边界管理，适配各种屏幕尺寸

**核心特征**：
- 响应式最大宽度
- 可选的内边距
- 居中对齐
- 支持全宽模式

## 视觉效果

### 基础样式

```jsx
const Container = ({ 
  children,
  maxWidth = 'lg', // 'xs' | 'sm' | 'md' | 'lg' | 'xl' | false
  disableGutters = false,
  fixed = false,
  className
}) => {
  const classes = [
    'container',
    maxWidth && `container-${maxWidth}`,
    fixed && 'container-fixed',
    disableGutters && 'container-disable-gutters',
    className
  ].filter(Boolean).join(' ');
  
  return (
    <div className={classes}>
      {children}
    </div>
  );
};
```

### CSS样式

```css
/* ===== 基础变量 ===== */
.container {
  --container-xs: 444px;
  --container-sm: 600px;
  --container-md: 900px;
  --container-lg: 1200px;
  --container-xl: 1536px;
  --container-padding: 24px;
  --container-padding-mobile: 16px;
}

/* ===== 基础容器 ===== */
.container {
  width: 100%;
  margin-left: auto;
  margin-right: auto;
  padding-left: var(--container-padding-mobile);
  padding-right: var(--container-padding-mobile);
  box-sizing: border-box;
}

@media (min-width: 600px) {
  .container {
    padding-left: var(--container-padding);
    padding-right: var(--container-padding);
  }
}

/* ===== 最大宽度限制 ===== */
.container-xs {
  max-width: var(--container-xs);
}

.container-sm {
  max-width: var(--container-sm);
}

.container-md {
  max-width: var(--container-md);
}

.container-lg {
  max-width: var(--container-lg);
}

.container-xl {
  max-width: var(--container-xl);
}

/* ===== 固定宽度（居中） ===== */
.container-fixed {
  max-width: var(--container-lg);
}

@media (min-width: 600px) {
  .container-fixed {
    max-width: var(--container-sm);
  }
}

@media (min-width: 900px) {
  .container-fixed {
    max-width: var(--container-md);
  }
}

@media (min-width: 1200px) {
  .container-fixed {
    max-width: var(--container-lg);
  }
}

@media (min-width: 1536px) {
  .container-fixed {
    max-width: var(--container-xl);
  }
}

/* ===== 无边距模式 ===== */
.container-disable-gutters {
  padding-left: 0;
  padding-right: 0;
}

/* ===== 全宽容器（默认） ===== */
.container:not([class*="container-"]):not(.container-fixed) {
  max-width: none;
}

/* ===== 暗色模式支持 ===== */
@media (prefers-color-scheme: dark) {
  .container {
    /* 容器本身无背景色，跟随父元素 */
  }
}
```

## 设计亮点

1. **渐进式最大宽度**：从移动端到桌面端逐步放宽
2. **合理的内边距**：移动端16px，桌面端24px
3. **固定宽度模式**：fixed属性实现断点式宽度变化
4. **可选无边距**：disableGutters满足全宽设计需求
5. **响应式友好**：适配从手机到大屏幕的所有设备

## 使用示例

### 默认容器

```jsx
<Container>
  <h1>页面内容</h1>
  <p>会自动居中并限制最大宽度</p>
</Container>
```

### 指定最大宽度

```jsx
<Container maxWidth="md">
  <ArticleContent />
</Container>

<Container maxWidth="sm">
  <LoginForm />
</Container>
```

### 固定宽度（响应式）

```jsx
<Container fixed>
  <AppContent />
</Container>
```

### 无边距容器

```jsx
<Container disableGutters>
  <FullWidthBanner />
</Container>
```

### 全宽容器

```jsx
<Container maxWidth={false}>
  <Dashboard />
</Container>
```

## 最佳实践

- 页面主内容使用`Container`包裹
- 表单、文章使用较小的maxWidth（sm/md）
- 后台管理界面使用较大的maxWidth（lg/xl）
- 避免嵌套多个Container
- 需要全宽元素时使用disableGutters

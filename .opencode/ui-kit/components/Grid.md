# Grid 网格系统组件

## 设计概述

**设计哲学**：灵活、响应式、易用的网格布局系统

**核心特征**：
- 12列网格系统
- 响应式断点支持
- 灵活的间距控制
- 对齐方式多样化

## 视觉效果

### 基础样式

```jsx
const Row = ({ 
  children,
  gutter = 16,
  align = 'top', // 'top' | 'middle' | 'bottom' | 'stretch'
  justify = 'start', // 'start' | 'end' | 'center' | 'space-between' | 'space-around'
  wrap = true
}) => {
  return (
    <div 
      className="row"
      style={{
        marginLeft: -gutter / 2,
        marginRight: -gutter / 2,
        alignItems: align,
        justifyContent: justify,
        flexWrap: wrap ? 'wrap' : 'nowrap'
      }}
    >
      {children}
    </div>
  );
};

const Col = ({ 
  children,
  span,
  offset,
  xs, // <576px
  sm, // ≥576px
  md, // ≥768px
  lg, // ≥992px
  xl, // ≥1200px
  xxl, // ≥1600px
  order,
  flex
}) => {
  const generateClasses = () => {
    const classes = ['col'];
    if (span) classes.push(`col-${span}`);
    if (offset) classes.push(`col-offset-${offset}`);
    if (xs) classes.push(`col-xs-${xs}`);
    if (sm) classes.push(`col-sm-${sm}`);
    if (md) classes.push(`col-md-${md}`);
    if (lg) classes.push(`col-lg-${lg}`);
    if (xl) classes.push(`col-xl-${xl}`);
    if (xxl) classes.push(`col-xxl-${xxl}`);
    if (order !== undefined) classes.push(`col-order-${order}`);
    return classes.join(' ');
  };
  
  return (
    <div 
      className={generateClasses()}
      style={{ 
        flex: flex,
        paddingLeft: 8,
        paddingRight: 8
      }}
    >
      {children}
    </div>
  );
};
```

### CSS样式

```css
/* ===== 基础变量 ===== */
:root {
  --grid-columns: 12;
  --grid-gutter: 16px;
  
  /* 断点 */
  --screen-xs: 480px;
  --screen-sm: 576px;
  --screen-md: 768px;
  --screen-lg: 992px;
  --screen-xl: 1200px;
  --screen-xxl: 1600px;
}

/* ===== 行容器 ===== */
.row {
  display: flex;
  flex-flow: row wrap;
  min-width: 0;
}

.row::before,
.row::after {
  display: flex;
}

/* ===== 列基础 ===== */
.col {
  position: relative;
  max-width: 100%;
  min-height: 1px;
}

/* ===== 12列网格系统 ===== */
.col-1 { flex: 0 0 8.33333333%; max-width: 8.33333333%; }
.col-2 { flex: 0 0 16.66666667%; max-width: 16.66666667%; }
.col-3 { flex: 0 0 25%; max-width: 25%; }
.col-4 { flex: 0 0 33.33333333%; max-width: 33.33333333%; }
.col-5 { flex: 0 0 41.66666667%; max-width: 41.66666667%; }
.col-6 { flex: 0 0 50%; max-width: 50%; }
.col-7 { flex: 0 0 58.33333333%; max-width: 58.33333333%; }
.col-8 { flex: 0 0 66.66666667%; max-width: 66.66666667%; }
.col-9 { flex: 0 0 75%; max-width: 75%; }
.col-10 { flex: 0 0 83.33333333%; max-width: 83.33333333%; }
.col-11 { flex: 0 0 91.66666667%; max-width: 91.66666667%; }
.col-12 { flex: 0 0 100%; max-width: 100%; }

/* ===== 偏移量 ===== */
.col-offset-0 { margin-left: 0; }
.col-offset-1 { margin-left: 8.33333333%; }
.col-offset-2 { margin-left: 16.66666667%; }
.col-offset-3 { margin-left: 25%; }
.col-offset-4 { margin-left: 33.33333333%; }
.col-offset-5 { margin-left: 41.66666667%; }
.col-offset-6 { margin-left: 50%; }
.col-offset-7 { margin-left: 58.33333333%; }
.col-offset-8 { margin-left: 66.66666667%; }
.col-offset-9 { margin-left: 75%; }
.col-offset-10 { margin-left: 83.33333333%; }
.col-offset-11 { margin-left: 91.66666667%; }

/* ===== 排序 ===== */
.col-order-first { order: -1; }
.col-order-last { order: 13; }
.col-order-0 { order: 0; }
.col-order-1 { order: 1; }
.col-order-2 { order: 2; }
.col-order-3 { order: 3; }
.col-order-4 { order: 4; }
.col-order-5 { order: 5; }

/* ===== 对齐方式 ===== */
.row-top { align-items: flex-start; }
.row-middle { align-items: center; }
.row-bottom { align-items: flex-end; }
.row-stretch { align-items: stretch; }

.row-start { justify-content: flex-start; }
.row-end { justify-content: flex-end; }
.row-center { justify-content: center; }
.row-space-between { justify-content: space-between; }
.row-space-around { justify-content: space-around; }

/* ===== 响应式断点 xs (<576px) ===== */
@media (max-width: 575px) {
  .col-xs-1 { flex: 0 0 8.33333333%; max-width: 8.33333333%; }
  .col-xs-2 { flex: 0 0 16.66666667%; max-width: 16.66666667%; }
  .col-xs-3 { flex: 0 0 25%; max-width: 25%; }
  .col-xs-4 { flex: 0 0 33.33333333%; max-width: 33.33333333%; }
  .col-xs-5 { flex: 0 0 41.66666667%; max-width: 41.66666667%; }
  .col-xs-6 { flex: 0 0 50%; max-width: 50%; }
  .col-xs-7 { flex: 0 0 58.33333333%; max-width: 58.33333333%; }
  .col-xs-8 { flex: 0 0 66.66666667%; max-width: 66.66666667%; }
  .col-xs-9 { flex: 0 0 75%; max-width: 75%; }
  .col-xs-10 { flex: 0 0 83.33333333%; max-width: 83.33333333%; }
  .col-xs-11 { flex: 0 0 91.66666667%; max-width: 91.66666667%; }
  .col-xs-12 { flex: 0 0 100%; max-width: 100%; }
}

/* ===== 响应式断点 sm (≥576px) ===== */
@media (min-width: 576px) {
  .col-sm-1 { flex: 0 0 8.33333333%; max-width: 8.33333333%; }
  .col-sm-2 { flex: 0 0 16.66666667%; max-width: 16.66666667%; }
  .col-sm-3 { flex: 0 0 25%; max-width: 25%; }
  .col-sm-4 { flex: 0 0 33.33333333%; max-width: 33.33333333%; }
  .col-sm-5 { flex: 0 0 41.66666667%; max-width: 41.66666667%; }
  .col-sm-6 { flex: 0 0 50%; max-width: 50%; }
  .col-sm-7 { flex: 0 0 58.33333333%; max-width: 58.33333333%; }
  .col-sm-8 { flex: 0 0 66.66666667%; max-width: 66.66666667%; }
  .col-sm-9 { flex: 0 0 75%; max-width: 75%; }
  .col-sm-10 { flex: 0 0 83.33333333%; max-width: 83.33333333%; }
  .col-sm-11 { flex: 0 0 91.66666667%; max-width: 91.66666667%; }
  .col-sm-12 { flex: 0 0 100%; max-width: 100%; }
}

/* ===== 响应式断点 md (≥768px) ===== */
@media (min-width: 768px) {
  .col-md-1 { flex: 0 0 8.33333333%; max-width: 8.33333333%; }
  .col-md-2 { flex: 0 0 16.66666667%; max-width: 16.66666667%; }
  .col-md-3 { flex: 0 0 25%; max-width: 25%; }
  .col-md-4 { flex: 0 0 33.33333333%; max-width: 33.33333333%; }
  .col-md-5 { flex: 0 0 41.66666667%; max-width: 41.66666667%; }
  .col-md-6 { flex: 0 0 50%; max-width: 50%; }
  .col-md-7 { flex: 0 0 58.33333333%; max-width: 58.33333333%; }
  .col-md-8 { flex: 0 0 66.66666667%; max-width: 66.66666667%; }
  .col-md-9 { flex: 0 0 75%; max-width: 75%; }
  .col-md-10 { flex: 0 0 83.33333333%; max-width: 83.33333333%; }
  .col-md-11 { flex: 0 0 91.66666667%; max-width: 91.66666667%; }
  .col-md-12 { flex: 0 0 100%; max-width: 100%; }
}

/* ===== 响应式断点 lg (≥992px) ===== */
@media (min-width: 992px) {
  .col-lg-1 { flex: 0 0 8.33333333%; max-width: 8.33333333%; }
  .col-lg-2 { flex: 0 0 16.66666667%; max-width: 16.66666667%; }
  .col-lg-3 { flex: 0 0 25%; max-width: 25%; }
  .col-lg-4 { flex: 0 0 33.33333333%; max-width: 33.33333333%; }
  .col-lg-5 { flex: 0 0 41.66666667%; max-width: 41.66666667%; }
  .col-lg-6 { flex: 0 0 50%; max-width: 50%; }
  .col-lg-7 { flex: 0 0 58.33333333%; max-width: 58.33333333%; }
  .col-lg-8 { flex: 0 0 66.66666667%; max-width: 66.66666667%; }
  .col-lg-9 { flex: 0 0 75%; max-width: 75%; }
  .col-lg-10 { flex: 0 0 83.33333333%; max-width: 83.33333333%; }
  .col-lg-11 { flex: 0 0 91.66666667%; max-width: 91.66666667%; }
  .col-lg-12 { flex: 0 0 100%; max-width: 100%; }
}

/* ===== 响应式断点 xl (≥1200px) ===== */
@media (min-width: 1200px) {
  .col-xl-1 { flex: 0 0 8.33333333%; max-width: 8.33333333%; }
  .col-xl-2 { flex: 0 0 16.66666667%; max-width: 16.66666667%; }
  .col-xl-3 { flex: 0 0 25%; max-width: 25%; }
  .col-xl-4 { flex: 0 0 33.33333333%; max-width: 33.33333333%; }
  .col-xl-5 { flex: 0 0 41.66666667%; max-width: 41.66666667%; }
  .col-xl-6 { flex: 0 0 50%; max-width: 50%; }
  .col-xl-7 { flex: 0 0 58.33333333%; max-width: 58.33333333%; }
  .col-xl-8 { flex: 0 0 66.66666667%; max-width: 66.66666667%; }
  .col-xl-9 { flex: 0 0 75%; max-width: 75%; }
  .col-xl-10 { flex: 0 0 83.33333333%; max-width: 83.33333333%; }
  .col-xl-11 { flex: 0 0 91.66666667%; max-width: 91.66666667%; }
  .col-xl-12 { flex: 0 0 100%; max-width: 100%; }
}

/* ===== 响应式断点 xxl (≥1600px) ===== */
@media (min-width: 1600px) {
  .col-xxl-1 { flex: 0 0 8.33333333%; max-width: 8.33333333%; }
  .col-xxl-2 { flex: 0 0 16.66666667%; max-width: 16.66666667%; }
  .col-xxl-3 { flex: 0 0 25%; max-width: 25%; }
  .col-xxl-4 { flex: 0 0 33.33333333%; max-width: 33.33333333%; }
  .col-xxl-5 { flex: 0 0 41.66666667%; max-width: 41.66666667%; }
  .col-xxl-6 { flex: 0 0 50%; max-width: 50%; }
  .col-xxl-7 { flex: 0 0 58.33333333%; max-width: 58.33333333%; }
  .col-xxl-8 { flex: 0 0 66.66666667%; max-width: 66.66666667%; }
  .col-xxl-9 { flex: 0 0 75%; max-width: 75%; }
  .col-xxl-10 { flex: 0 0 83.33333333%; max-width: 83.33333333%; }
  .col-xxl-11 { flex: 0 0 91.66666667%; max-width: 91.66666667%; }
  .col-xxl-12 { flex: 0 0 100%; max-width: 100%; }
}
```

## 设计亮点

1. **标准12列系统**：灵活且易于理解
2. **6个响应式断点**：从xs到xxl全覆盖
3. **偏移和排序**：支持复杂布局需求
4. **Flexbox实现**：现代且性能优异
5. **无依赖**：纯CSS，轻量高效

## 使用示例

### 基础使用

```jsx
<Row>
  <Col span={12}>col-12</Col>
  <Col span={12}>col-12</Col>
</Row>

<Row>
  <Col span={8}>col-8</Col>
  <Col span={8}>col-8</Col>
  <Col span={8}>col-8</Col>
</Row>
```

### 响应式布局

```jsx
<Row>
  <Col xs={24} sm={12} md={8} lg={6}>
    响应式列
  </Col>
  <Col xs={24} sm={12} md={8} lg={6}>
    响应式列
  </Col>
  <Col xs={24} sm={12} md={8} lg={6}>
    响应式列
  </Col>
  <Col xs={24} sm={12} md={8} lg={6}>
    响应式列
  </Col>
</Row>
```

### 对齐方式

```jsx
<Row justify="center" align="middle">
  <Col span={6}>居中</Col>
</Row>

<Row justify="space-between">
  <Col span={6}>左侧</Col>
  <Col span={6}>右侧</Col>
</Row>
```

### 偏移和排序

```jsx
<Row>
  <Col span={6} offset={6}>偏移6列</Col>
  <Col span={6} order={-1}>第一个</Col>
</Row>
```

## 最佳实践

- 移动端优先：先定义xs，再定义更大的断点
- 使用gutter控制列间距
- 复杂布局使用offset和order
- 保持列的总和不超过12

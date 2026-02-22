# Card 卡片组件

## 用途
用于包裹相关内容，提供视觉分组。

## 变体

### 1. 基础卡片（Default）
通用信息容器。

```jsx
<div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
  <h3 className="text-lg font-semibold text-gray-900 mb-2">标题</h3>
  <p className="text-gray-600">内容描述</p>
</div>
```

### 2. 图片卡片（With Image）
包含图片的卡片。

```jsx
<div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
  <img src="/image.jpg" alt="描述" className="w-full h-48 object-cover" />
  <div className="p-6">
    <h3 className="text-lg font-semibold text-gray-900 mb-2">标题</h3>
    <p className="text-gray-600">内容描述</p>
  </div>
</div>
```

### 3. 统计卡片（Stat）
展示关键数据。

```jsx
<div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
  <p className="text-sm text-gray-500 mb-1">总用户数</p>
  <p className="text-3xl font-bold text-gray-900">1,234</p>
  <p className="text-sm text-green-600 mt-2">↗ +12%</p>
</div>
```

### 4. 操作卡片（Action）
带操作按钮的卡片。

```jsx
<div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
  <div className="flex justify-between items-start mb-4">
    <h3 className="text-lg font-semibold text-gray-900">任务名称</h3>
    <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded">
      进行中
    </span>
  </div>
  <p className="text-gray-600 mb-4">任务描述...</p>
  <div className="flex gap-2">
    <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
      编辑
    </button>
    <button className="text-red-600 hover:text-red-800 text-sm font-medium">
      删除
    </button>
  </div>
</div>
```

## 使用场景

| 场景 | 推荐变体 |
|------|---------|
| 信息展示 | Default |
| 产品/作品展示 | With Image |
| 数据仪表盘 | Stat |
| 列表项详情 | Action |

## 布局建议

### 单列布局
```
┌─────────────────────┐
│     Card 1          │
├─────────────────────┤
│     Card 2          │
└─────────────────────┘
```

### 网格布局
```
┌─────────┐ ┌─────────┐
│ Card 1  │ │ Card 2  │
└─────────┘ └─────────┘
┌─────────┐ ┌─────────┐
│ Card 3  │ │ Card 4  │
└─────────┘ └─────────┘
```

## 代码示例

### React

```tsx
interface CardProps {
  title?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
}

export function Card({ title, children, footer, className = '' }: CardProps) {
  return (
    <div className={`bg-white rounded-lg shadow-sm border border-gray-200 ${className}`}>
      {title && (
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        </div>
      )}
      <div className="p-6">{children}</div>
      {footer && (
        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 rounded-b-lg">
          {footer}
        </div>
      )}
    </div>
  );
}
```

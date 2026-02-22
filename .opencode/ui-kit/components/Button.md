# Button 按钮组件

## 用途
触发操作或提交表单。

## 变体

### 1. 主要按钮（Primary）
用于主要操作，一个页面通常只有一个。

```jsx
// React + Tailwind
<button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium transition-colors">
  确认
</button>
```

### 2. 次要按钮（Secondary）
用于次要操作。

```jsx
<button className="bg-gray-200 hover:bg-gray-300 text-gray-900 px-4 py-2 rounded-md font-medium transition-colors">
  取消
</button>
```

### 3. 危险按钮（Danger）
用于删除等危险操作。

```jsx
<button className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md font-medium transition-colors">
  删除
</button>
```

### 4. 幽灵按钮（Ghost）
用于低优先级操作或图标按钮。

```jsx
<button className="hover:bg-gray-100 text-gray-700 px-4 py-2 rounded-md font-medium transition-colors border border-gray-300">
  更多
</button>
```

### 5. 链接按钮（Link）
看起来像链接的按钮。

```jsx
<button className="text-blue-600 hover:text-blue-800 font-medium underline">
  查看详情
</button>
```

## 尺寸

- **Small**: 紧凑，用于表格内操作
- **Medium**（默认）: 标准尺寸
- **Large**: 突出显示

## 状态

- **Default**: 默认状态
- **Hover**: 鼠标悬停
- **Active**: 按下状态
- **Disabled**: 禁用状态
- **Loading**: 加载中状态

## 使用场景

| 场景 | 推荐变体 | 示例 |
|------|---------|------|
| 表单提交 | Primary | "保存" |
| 取消操作 | Secondary | "取消" |
| 删除数据 | Danger | "删除" |
| 筛选/过滤 | Ghost | "筛选" |
| 导航链接 | Link | "返回列表" |

## 无障碍要求

- 必须可通过键盘访问（Tab键聚焦，Enter/Space触发）
- 必须有明确的焦点样式
- 加载状态必须提供 `aria-label="加载中"`
- 禁用状态必须设置 `disabled` 属性

## 代码示例

### React

```tsx
interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost' | 'link';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  onClick?: () => void;
  children: React.ReactNode;
}

export function Button({ 
  variant = 'primary', 
  size = 'md',
  disabled = false,
  loading = false,
  onClick,
  children 
}: ButtonProps) {
  const baseClasses = 'font-medium rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500';
  
  const variantClasses = {
    primary: 'bg-blue-600 hover:bg-blue-700 text-white disabled:bg-blue-300',
    secondary: 'bg-gray-200 hover:bg-gray-300 text-gray-900 disabled:bg-gray-100',
    danger: 'bg-red-600 hover:bg-red-700 text-white disabled:bg-red-300',
    ghost: 'hover:bg-gray-100 text-gray-700 border border-gray-300 disabled:opacity-50',
    link: 'text-blue-600 hover:text-blue-800 underline disabled:text-gray-400'
  };
  
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base'
  };
  
  return (
    <button
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]}`}
      disabled={disabled || loading}
      onClick={onClick}
      aria-label={loading ? '加载中' : undefined}
    >
      {loading ? '加载中...' : children}
    </button>
  );
}
```

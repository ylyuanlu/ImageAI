# Empty 空状态组件

## 用途
当列表或页面没有数据时显示友好的提示，引导用户操作。

## 基础结构

```jsx
<div className="text-center py-12 px-4">
  {/* 图标 */}
  <div className="text-6xl mb-4">📭</div>
  
  {/* 标题 */}
  <h3 className="text-lg font-medium text-gray-900 mb-2">
    暂无数据
  </h3>
  
  {/* 描述 */}
  <p className="text-gray-500 mb-6 max-w-sm mx-auto">
    还没有任何记录，点击下方按钮创建第一条数据
  </p>
  
  {/* 操作按钮 */}
  <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
    创建记录
  </button>
}
```

## 变体

### 1. 列表空状态

```jsx
<div className="text-center py-16 px-4 bg-white rounded-lg border border-gray-200">
  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl">
    📋
  </div>
  <h3 className="text-lg font-medium text-gray-900 mb-2">列表为空</h3>
  <p className="text-gray-500 mb-6">开始添加您的第一条记录</p>
  <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
    添加记录
  </button>
</div>
```

### 2. 搜索结果空状态

```jsx
<div className="text-center py-16 px-4">
  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl">
    🔍
  </div>
  <h3 className="text-lg font-medium text-gray-900 mb-2">未找到结果</h3>
  <p className="text-gray-500 mb-4">没有找到匹配 "{searchQuery}" 的内容</p>
  <div className="flex gap-3 justify-center">
    <button className="text-blue-600 hover:text-blue-800 font-medium">
      清除搜索
    </button>
    <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
      创建新记录
    </button>
  </div>
</div>
```

### 3. 无权限状态

```jsx
<div className="text-center py-16 px-4">
  <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl">
    🚫
  </div>
  <h3 className="text-lg font-medium text-gray-900 mb-2">无访问权限</h3>
  <p className="text-gray-500 mb-6">您没有权限查看此内容</p>
  <button className="text-blue-600 hover:text-blue-800 font-medium">
    返回首页
  </button>
</div>
```

### 4. 加载失败状态

```jsx
<div className="text-center py-16 px-4">
  <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl">
    ⚠️
  </div>
  <h3 className="text-lg font-medium text-gray-900 mb-2">加载失败</h3>
  <p className="text-gray-500 mb-6">网络连接失败，请检查网络后重试</p>
  <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
    重试
  </button>
</div>
```

### 5. 成功完成状态

```jsx
<div className="text-center py-16 px-4">
  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl">
    ✓
  </div>
  <h3 className="text-lg font-medium text-gray-900 mb-2">全部完成</h3>
  <p className="text-gray-500 mb-6">您已完成所有任务</p>
  <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
    创建新任务
  </button>
</div>
```

## 图标映射

| 场景 | 图标 | 含义 |
|------|------|------|
| 列表为空 | 📋 | 清单 |
| 搜索结果为空 | 🔍 | 搜索 |
| 消息为空 | ✉️ | 邮件 |
| 通知为空 | 🔔 | 通知 |
| 购物车为空 | 🛒 | 购物车 |
| 收藏为空 | ⭐ | 收藏 |
| 无权限 | 🚫 | 禁止 |
| 加载失败 | ⚠️ | 警告 |
| 完成 | ✓ | 成功 |
| 404错误 | 🔧 | 工具 |

## 使用场景

### 数据表格空状态

```jsx
{data.length === 0 ? (
  <EmptyState 
    icon="📋"
    title="暂无数据"
    description="列表中还没有任何记录"
    action={{ label: '添加记录', onClick: () => openModal() }}
  />
) : (
  <DataTable data={data} />
)}
```

### 搜索结果空状态

```jsx
{searchResults.length === 0 && searchQuery ? (
  <EmptyState 
    icon="🔍"
    title={`未找到 "${searchQuery}" 的结果`}
    description="尝试使用不同的关键词搜索"
    actions={[
      { label: '清除搜索', onClick: clearSearch, variant: 'ghost' },
      { label: '查看全部', onClick: showAll, variant: 'primary' }
    ]}
  />
) : null}
```

### 页面级空状态

```jsx
<div className="min-h-screen flex items-center justify-center bg-gray-50">
  <EmptyState 
    icon="🚫"
    title="404"
    description="页面不存在或已被删除"
    action={{ label: '返回首页', onClick: () => router.push('/') }}
  />
</div>
```

## 代码示例

### React 组件

```tsx
interface EmptyStateProps {
  icon?: string;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
    variant?: 'primary' | 'secondary' | 'ghost';
  };
  actions?: Array<{
    label: string;
    onClick: () => void;
    variant?: 'primary' | 'secondary' | 'ghost';
  }>;
  className?: string;
}

export function EmptyState({ 
  icon = '📋',
  title,
  description,
  action,
  actions,
  className = '' 
}: EmptyStateProps) {
  const buttonClasses = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700',
    secondary: 'bg-gray-200 text-gray-900 hover:bg-gray-300',
    ghost: 'text-blue-600 hover:text-blue-800'
  };
  
  return (
    <div className={`text-center py-12 px-4 ${className}`}>
      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl">
        {icon}
      </div>
      <h3 className="text-lg font-medium text-gray-900 mb-2">{title}</h3>
      {description && (
        <p className="text-gray-500 mb-6 max-w-sm mx-auto">{description}</p>
      )}
      
      {action && (
        <button 
          onClick={action.onClick}
          className={`px-4 py-2 rounded-md font-medium transition-colors ${buttonClasses[action.variant || 'primary']}`}
        >
          {action.label}
        </button>
      )}
      
      {actions && actions.length > 0 && (
        <div className="flex gap-3 justify-center">
          {actions.map((act, index) => (
            <button 
              key={index}
              onClick={act.onClick}
              className={`px-4 py-2 rounded-md font-medium transition-colors ${buttonClasses[act.variant || 'primary']}`}
            >
              {act.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
```

## 最佳实践

1. **提供明确的引导**：告诉用户为什么为空，以及可以做什么
2. **提供操作入口**：总是提供至少一个按钮引导用户操作
3. **使用相关图标**：图标应与场景相关，增强理解
4. **保持简洁**：标题简短有力，描述清晰明确
5. **考虑上下文**：在页面中使用合适的padding和背景

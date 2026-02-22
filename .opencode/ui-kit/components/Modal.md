# Modal 模态框组件

## 用途
在当前页面之上显示重要信息或需要用户决策的内容。

## 基础结构

```jsx
<div className="fixed inset-0 z-50 overflow-y-auto">
  {/* 遮罩层 */}
  <div className="fixed inset-0 bg-black/50 transition-opacity"></div>
  
  {/* 模态框容器 */}
  <div className="flex min-h-full items-center justify-center p-4">
    <div className="relative bg-white rounded-lg shadow-xl max-w-lg w-full">
      {/* 关闭按钮 */}
      <button className="absolute right-4 top-4 text-gray-400 hover:text-gray-600">
        ✕
      </button>
      
      {/* 头部 */}
      <div className="px-6 py-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">标题</h3>
      </div>
      
      {/* 内容 */}
      <div className="px-6 py-4">
        <p className="text-gray-600">模态框内容...</p>
      </div>
      
      {/* 底部操作 */}
      <div className="px-6 py-4 border-t border-gray-200 flex justify-end gap-3">
        <button className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md">
          取消
        </button>
        <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
          确认
        </button>
      </div>
    </div>
  </div>
</div>
```

## 变体

### 1. 确认对话框

```jsx
<div className="fixed inset-0 z-50 overflow-y-auto">
  <div className="fixed inset-0 bg-black/50"></div>
  <div className="flex min-h-full items-center justify-center p-4">
    <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full">
      <div className="p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center text-red-600">
            ⚠️
          </div>
          <h3 className="text-lg font-semibold text-gray-900">确认删除</h3>
        </div>
        <p className="text-gray-600 mb-6">
          确定要删除这条记录吗？此操作不可撤销。
        </p>
        <div className="flex justify-end gap-3">
          <button className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md">
            取消
          </button>
          <button className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700">
            删除
          </button>
        </div>
      </div>
    </div>
  </div>
</div>
```

### 2. 表单对话框

```jsx
<div className="fixed inset-0 z-50 overflow-y-auto">
  <div className="fixed inset-0 bg-black/50"></div>
  <div className="flex min-h-full items-center justify-center p-4">
    <div className="relative bg-white rounded-lg shadow-xl max-w-lg w-full">
      <div className="px-6 py-4 border-b">
        <h3 className="text-lg font-semibold text-gray-900">编辑信息</h3>
      </div>
      <div className="px-6 py-4">
        <form className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">名称</label>
            <input type="text" className="w-full px-3 py-2 border rounded-md" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">描述</label>
            <textarea rows={3} className="w-full px-3 py-2 border rounded-md"></textarea>
          </div>
        </form>
      </div>
      <div className="px-6 py-4 border-t flex justify-end gap-3">
        <button className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md">取消</button>
        <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">保存</button>
      </div>
    </div>
  </div>
</div>
```

### 3. 详情展示

```jsx
<div className="fixed inset-0 z-50 overflow-y-auto">
  <div className="fixed inset-0 bg-black/50"></div>
  <div className="flex min-h-full items-center justify-center p-4">
    <div className="relative bg-white rounded-lg shadow-xl max-w-2xl w-full">
      <button className="absolute right-4 top-4 text-gray-400 hover:text-gray-600">✕</button>
      <div className="p-6">
        <div className="flex items-start gap-4 mb-6">
          <div className="w-16 h-16 bg-gray-200 rounded-lg"></div>
          <div>
            <h3 className="text-xl font-semibold text-gray-900">标题</h3>
            <p className="text-gray-500">副标题信息</p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-gray-500">字段1:</span>
            <span className="ml-2 text-gray-900">值1</span>
          </div>
          <div>
            <span className="text-gray-500">字段2:</span>
            <span className="ml-2 text-gray-900">值2</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
```

## 尺寸

- **Small** (max-w-sm): 提示信息、简单确认
- **Medium** (max-w-md, 默认): 表单、确认操作
- **Large** (max-w-lg): 复杂表单、详情展示
- **Extra Large** (max-w-2xl): 全功能编辑
- **Full Screen**: 复杂流程、全屏操作

## 交互规范

### 打开/关闭动画

```jsx
// 使用 CSS transition
<div className={`
  fixed inset-0 z-50 overflow-y-auto
  ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}
  transition-opacity duration-300
`}>
  <div className={`
    fixed inset-0 bg-black/50
    ${isOpen ? 'opacity-100' : 'opacity-0'}
    transition-opacity duration-300
  `}></div>
  <div className="flex min-h-full items-center justify-center p-4">
    <div className={`
      relative bg-white rounded-lg shadow-xl max-w-lg w-full
      ${isOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}
      transition-all duration-300
    `}>
      {/* 内容 */}
    </div>
  </div>
</div>
```

### 关闭方式

1. **点击遮罩层关闭**：适合非重要对话框
2. **点击关闭按钮**：始终可用
3. **按ESC键关闭**：提升键盘可访问性
4. **点击确认按钮**：执行操作后关闭

```jsx
useEffect(() => {
  const handleEscape = (e: KeyboardEvent) => {
    if (e.key === 'Escape') onClose();
  };
  if (isOpen) {
    document.addEventListener('keydown', handleEscape);
    document.body.style.overflow = 'hidden'; // 禁止背景滚动
  }
  return () => {
    document.removeEventListener('keydown', handleEscape);
    document.body.style.overflow = 'unset';
  };
}, [isOpen]);
```

## 无障碍要求

- 必须可通过键盘操作（Tab导航、ESC关闭）
- 焦点应锁定在模态框内
- 打开时背景内容应不可交互
- 关闭后焦点应返回触发元素

## 代码示例

### React Hook

```tsx
import { useState, useEffect } from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}

export function Modal({ isOpen, onClose, title, children, footer }: ModalProps) {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    
    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }
    
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);
  
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div 
        className="fixed inset-0 bg-black/50 transition-opacity"
        onClick={onClose}
      ></div>
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative bg-white rounded-lg shadow-xl max-w-lg w-full">
          <button 
            onClick={onClose}
            className="absolute right-4 top-4 text-gray-400 hover:text-gray-600"
            aria-label="关闭"
          >
            ✕
          </button>
          
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          </div>
          
          <div className="px-6 py-4">{children}</div>
          
          {footer && (
            <div className="px-6 py-4 border-t border-gray-200">{footer}</div>
          )}
        </div>
      </div>
    </div>
  );
}
```

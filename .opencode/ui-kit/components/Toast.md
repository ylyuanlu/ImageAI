# Toast 通知组件

## 用途
显示操作反馈、成功提示、错误警告等轻量级通知。

## 基础结构

```jsx
<div className="fixed top-4 right-4 z-50 space-y-2">
  <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-4 flex items-center gap-3 min-w-[300px] max-w-[400px]">
    {/* 图标 */}
    <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center text-green-600 flex-shrink-0">
      ✓
    </div>
    
    {/* 内容 */}
    <div className="flex-1">
      <p className="text-sm font-medium text-gray-900">操作成功</p>
      <p className="text-xs text-gray-500">记录已成功保存</p>
    </div>
    
    {/* 关闭按钮 */}
    <button className="text-gray-400 hover:text-gray-600 flex-shrink-0">✕</button>
  </div>
</div>
```

## 变体

### 1. 成功提示

```jsx
<div className="bg-white rounded-lg shadow-lg border-l-4 border-green-500 p-4 flex items-center gap-3">
  <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center text-green-600">
    ✓
  </div>
  <div className="flex-1">
    <p className="text-sm font-medium text-gray-900">保存成功</p>
    <p className="text-xs text-gray-500">数据已更新</p>
  </div>
</div>
```

### 2. 错误提示

```jsx
<div className="bg-white rounded-lg shadow-lg border-l-4 border-red-500 p-4 flex items-center gap-3">
  <div className="w-5 h-5 rounded-full bg-red-100 flex items-center justify-center text-red-600">
    ✕
  </div>
  <div className="flex-1">
    <p className="text-sm font-medium text-gray-900">操作失败</p>
    <p className="text-xs text-gray-500">请检查网络连接</p>
  </div>
</div>
```

### 3. 警告提示

```jsx
<div className="bg-white rounded-lg shadow-lg border-l-4 border-yellow-500 p-4 flex items-center gap-3">
  <div className="w-5 h-5 rounded-full bg-yellow-100 flex items-center justify-center text-yellow-600">
    ⚠️
  </div>
  <div className="flex-1">
    <p className="text-sm font-medium text-gray-900">注意事项</p>
    <p className="text-xs text-gray-500">此操作不可撤销</p>
  </div>
</div>
```

### 4. 信息提示

```jsx
<div className="bg-white rounded-lg shadow-lg border-l-4 border-blue-500 p-4 flex items-center gap-3">
  <div className="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
    ℹ️
  </div>
  <div className="flex-1">
    <p className="text-sm font-medium text-gray-900">新功能</p>
    <p className="text-xs text-gray-500">点击查看详情</p>
  </div>
</div>
```

## 位置

### 右上角（默认）
```jsx
<div className="fixed top-4 right-4 z-50 space-y-2">
  {/* Toast items */}
</div>
```

### 顶部居中
```jsx
<div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 space-y-2">
  {/* Toast items */}
</div>
```

### 左上角
```jsx
<div className="fixed top-4 left-4 z-50 space-y-2">
  {/* Toast items */}
</div>
```

## 动画效果

```jsx
// 进入动画
@keyframes slideIn {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

// 退出动画
@keyframes slideOut {
  from {
    transform: translateX(0);
    opacity: 1;
  }
  to {
    transform: translateX(100%);
    opacity: 0;
  }
}

.toast-enter {
  animation: slideIn 0.3s ease-out;
}

.toast-exit {
  animation: slideOut 0.3s ease-in;
}
```

## 自动关闭

```jsx
useEffect(() => {
  if (duration > 0) {
    const timer = setTimeout(() => {
      onClose();
    }, duration);
    return () => clearTimeout(timer);
  }
}, [duration, onClose]);
```

## 使用场景

| 场景 | 类型 | 持续时间 |
|------|------|----------|
| 保存成功 | success | 3000ms |
| 删除成功 | success | 3000ms |
| 操作失败 | error | 5000ms（需手动关闭） |
| 网络错误 | error | 5000ms |
| 确认提示 | warning | 4000ms |
| 新功能提示 | info | 4000ms |

## 代码示例

### React Hook

```tsx
import { useState, useCallback } from 'react';

interface Toast {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message?: string;
  duration?: number;
}

export function useToast() {
  const [toasts, setToasts] = useState<Toast[]>([]);
  
  const addToast = useCallback((toast: Omit<Toast, 'id'>) => {
    const id = Math.random().toString(36).substr(2, 9);
    setToasts(prev => [...prev, { ...toast, id }]);
    
    if (toast.duration !== 0) {
      setTimeout(() => {
        removeToast(id);
      }, toast.duration || 3000);
    }
  }, []);
  
  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);
  
  const success = useCallback((title: string, message?: string) => {
    addToast({ type: 'success', title, message, duration: 3000 });
  }, [addToast]);
  
  const error = useCallback((title: string, message?: string) => {
    addToast({ type: 'error', title, message, duration: 5000 });
  }, [addToast]);
  
  const warning = useCallback((title: string, message?: string) => {
    addToast({ type: 'warning', title, message, duration: 4000 });
  }, [addToast]);
  
  const info = useCallback((title: string, message?: string) => {
    addToast({ type: 'info', title, message, duration: 4000 });
  }, [addToast]);
  
  return { toasts, success, error, warning, info, removeToast };
}
```

### Toast 组件

```tsx
interface ToastProps {
  toast: Toast;
  onClose: () => void;
}

export function ToastItem({ toast, onClose }: ToastProps) {
  const icons = {
    success: '✓',
    error: '✕',
    warning: '⚠️',
    info: 'ℹ️'
  };
  
  const colors = {
    success: 'border-green-500 bg-green-100 text-green-600',
    error: 'border-red-500 bg-red-100 text-red-600',
    warning: 'border-yellow-500 bg-yellow-100 text-yellow-600',
    info: 'border-blue-500 bg-blue-100 text-blue-600'
  };
  
  return (
    <div className={`bg-white rounded-lg shadow-lg border-l-4 ${colors[toast.type]} p-4 flex items-center gap-3 min-w-[300px] max-w-[400px] animate-slideIn`}>
      <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 ${colors[toast.type]}`}>
        {icons[toast.type]}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-900">{toast.title}</p>
        {toast.message && (
          <p className="text-xs text-gray-500 truncate">{toast.message}</p>
        )}
      </div>
      <button 
        onClick={onClose}
        className="text-gray-400 hover:text-gray-600 flex-shrink-0"
        aria-label="关闭"
      >
        ✕
      </button>
    </div>
  );
}
```

### Toast 容器

```tsx
export function ToastContainer({ toasts, removeToast }: { toasts: Toast[], removeToast: (id: string) => void }) {
  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {toasts.map(toast => (
        <ToastItem 
          key={toast.id} 
          toast={toast} 
          onClose={() => removeToast(toast.id)} 
        />
      ))}
    </div>
  );
}
```

## 使用示例

```tsx
function App() {
  const { toasts, success, error, removeToast } = useToast();
  
  const handleSave = async () => {
    try {
      await saveData();
      success('保存成功', '数据已更新');
    } catch (err) {
      error('保存失败', err.message);
    }
  };
  
  return (
    <>
      <button onClick={handleSave}>保存</button>
      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </>
  );
}
```

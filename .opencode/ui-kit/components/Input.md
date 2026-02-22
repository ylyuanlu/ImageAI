# Input 输入框组件

## 用途
接收用户的文本输入。

## 基础样式

```jsx
<input 
  type="text"
  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm
             text-gray-900 placeholder-gray-400
             focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
             disabled:bg-gray-100 disabled:text-gray-500 disabled:cursor-not-allowed
             transition-colors"
/>
```

## 变体

### 1. 带标签

```jsx
<div className="space-y-1">
  <label className="block text-sm font-medium text-gray-700">
    用户名
  </label>
  <input 
    type="text"
    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm
               focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
    placeholder="请输入用户名"
  />
</div>
```

### 2. 带图标

```jsx
<div className="relative">
  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
    <span className="text-gray-400">@</span>
  </div>
  <input 
    type="text"
    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm
               focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
  />
</div>
```

### 3. 带清除按钮

```jsx
<div className="relative">
  <input 
    type="text"
    value={value}
    onChange={onChange}
    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm pr-10"
  />
  {value && (
    <button 
      onClick={() => onChange('')}
      className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
    >
      ✕
    </button>
  )}
</div>
```

### 4. 带前缀/后缀

```jsx
<div className="relative rounded-md shadow-sm">
  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
    <span className="text-gray-500 sm:text-sm">$</span>
  </div>
  <input
    type="text"
    className="w-full pl-7 pr-12 py-2 border border-gray-300 rounded-md"
    placeholder="0.00"
  />
  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
    <span className="text-gray-500 sm:text-sm">USD</span>
  </div>
</div>
```

## 类型

### 文本输入
```jsx
<input type="text" />
```

### 密码输入
```jsx
<div className="relative">
  <input type={showPassword ? 'text' : 'password'} />
  <button onClick={() => setShowPassword(!showPassword)}>
    {showPassword ? '🙈' : '👁️'}
  </button>
</div>
```

### 数字输入
```jsx
<input type="number" min={0} max={100} step={1} />
```

### 邮箱输入
```jsx
<input type="email" placeholder="example@email.com" />
```

### 搜索输入
```jsx
<div className="relative">
  <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
    🔍
  </div>
  <input 
    type="search"
    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-full"
    placeholder="搜索..."
  />
</div>
```

## 状态

### 错误状态
```jsx
<input 
  type="text"
  className="w-full px-3 py-2 border border-red-300 rounded-md shadow-sm
             text-red-900 placeholder-red-300
             focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
/>
<p className="mt-1 text-sm text-red-600">错误提示信息</p>
```

### 成功状态
```jsx
<div className="relative">
  <input 
    type="text"
    className="w-full px-3 py-2 border border-green-300 rounded-md shadow-sm pr-10"
  />
  <div className="absolute inset-y-0 right-0 pr-3 flex items-center text-green-500">
    ✓
  </div>
</div>
```

### 禁用状态
```jsx
<input 
  type="text"
  disabled
  value="禁用内容"
  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm
             bg-gray-100 text-gray-500 cursor-not-allowed"
/>
```

### 只读状态
```jsx
<input 
  type="text"
  readOnly
  value="只读内容"
  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm
             bg-gray-50 text-gray-700"
/>
```

## 尺寸

- **Small**: py-1.5 text-sm
- **Medium**（默认）: py-2 text-sm  
- **Large**: py-3 text-base

## 完整示例

```tsx
interface InputProps {
  label?: string;
  type?: 'text' | 'password' | 'email' | 'number' | 'search';
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  disabled?: boolean;
  required?: boolean;
  icon?: React.ReactNode;
}

export function Input({
  label,
  type = 'text',
  placeholder,
  value,
  onChange,
  error,
  disabled,
  required,
  icon
}: InputProps) {
  return (
    <div className="space-y-1">
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <div className="relative">
        {icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
            {icon}
          </div>
        )}
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          disabled={disabled}
          className={`
            w-full px-3 py-2 border rounded-md shadow-sm
            ${icon ? 'pl-10' : ''}
            ${error 
              ? 'border-red-300 text-red-900 placeholder-red-300 focus:ring-red-500 focus:border-red-500' 
              : 'border-gray-300 text-gray-900 placeholder-gray-400 focus:ring-blue-500 focus:border-blue-500'
            }
            ${disabled ? 'bg-gray-100 text-gray-500 cursor-not-allowed' : ''}
            focus:outline-none focus:ring-2
            transition-colors
          `}
        />
        {value && !disabled && (
          <button
            onClick={() => onChange('')}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
          >
            ✕
          </button>
        )}
      </div>
      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  );
}
```

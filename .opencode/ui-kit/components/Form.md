# Form 表单组件

## 用途
收集用户输入的标准表单布局。

## 基础结构

```jsx
<form className="space-y-6">
  {/* 表单分组 */}
  <div className="space-y-4">
    <h3 className="text-lg font-medium text-gray-900">基本信息</h3>
    
    {/* 输入项 */}
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        用户名 <span className="text-red-500">*</span>
      </label>
      <input 
        type="text" 
        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        placeholder="请输入用户名"
      />
      <p className="mt-1 text-sm text-gray-500">用于登录和显示</p>
    </div>
    
    {/* 更多输入项 */}
  </div>
  
  {/* 操作按钮 */}
  <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
    <button type="button" className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md">
      取消
    </button>
    <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
      保存
    </button>
  </div>
</form>
```

## 表单布局模式

### 1. 垂直布局（默认）
标签在输入框上方。

```jsx
<div className="space-y-4">
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">字段名</label>
    <input className="w-full ..." />
  </div>
</div>
```

### 2. 水平布局
标签在输入框左侧。

```jsx
<div className="grid grid-cols-[120px_1fr] gap-4 items-center">
  <label className="text-sm font-medium text-gray-700">字段名</label>
  <input className="w-full ..." />
</div>
```

### 3. 网格布局
多列并排。

```jsx
<div className="grid grid-cols-2 gap-4">
  <div>
    <label className="...">姓</label>
    <input className="..." />
  </div>
  <div>
    <label className="...">名</label>
    <input className="..." />
  </div>
</div>
```

## 输入组件样式

### 文本输入

```jsx
<input 
  type="text"
  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm
             focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
             disabled:bg-gray-100 disabled:text-gray-500"
/>
```

### 下拉选择

```jsx
<select className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm
                   focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                   bg-white">
  <option value="">请选择</option>
  <option value="1">选项1</option>
  <option value="2">选项2</option>
</select>
```

### 文本域

```jsx
<textarea 
  rows={4}
  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm
             focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
             resize-y"
/>
```

### 复选框

```jsx
<div className="flex items-center">
  <input 
    type="checkbox"
    className="h-4 w-4 text-blue-600 border-gray-300 rounded
               focus:ring-blue-500"
  />
  <label className="ml-2 text-sm text-gray-700">同意条款</label>
</div>
```

### 单选框

```jsx
<div className="flex items-center space-x-4">
  <label className="flex items-center">
    <input type="radio" name="type" value="1" className="h-4 w-4 text-blue-600" />
    <span className="ml-2 text-sm text-gray-700">选项1</span>
  </label>
  <label className="flex items-center">
    <input type="radio" name="type" value="2" className="h-4 w-4 text-blue-600" />
    <span className="ml-2 text-sm text-gray-700">选项2</span>
  </label>
</div>
```

## 验证状态

### 错误状态

```jsx
<div>
  <label className="block text-sm font-medium text-gray-700 mb-1">
    邮箱
  </label>
  <input 
    type="email"
    className="w-full px-3 py-2 border border-red-300 rounded-md shadow-sm
               focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
  />
  <p className="mt-1 text-sm text-red-600">请输入有效的邮箱地址</p>
</div>
```

### 成功状态

```jsx
<div className="relative">
  <input 
    type="text"
    className="w-full px-3 py-2 border border-green-300 rounded-md shadow-sm pr-10
               focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
  />
  <div className="absolute right-3 top-2.5 text-green-500">✓</div>
</div>
```

## 完整示例

```jsx
function UserForm({ onSubmit }) {
  return (
    <form className="space-y-6" onSubmit={onSubmit}>
      {/* 基本信息 */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-gray-900 border-b pb-2">基本信息</h3>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              姓 <span className="text-red-500">*</span>
            </label>
            <input 
              type="text"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="请输入姓"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              名 <span className="text-red-500">*</span>
            </label>
            <input 
              type="text"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="请输入名"
            />
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            邮箱 <span className="text-red-500">*</span>
          </label>
          <input 
            type="email"
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="example@email.com"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">角色</label>
          <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 bg-white">
            <option value="">请选择角色</option>
            <option value="admin">管理员</option>
            <option value="editor">编辑</option>
            <option value="viewer">访客</option>
          </select>
        </div>
      </div>
      
      {/* 操作按钮 */}
      <div className="flex items-center justify-end gap-3 pt-4 border-t">
        <button type="button" className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md transition-colors">
          取消
        </button>
        <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
          保存
        </button>
      </div>
    </form>
  );
}
```

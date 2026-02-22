# DataTable 数据表格组件

## 用途
展示结构化数据，支持排序、筛选、分页。

## 基础结构

```jsx
<div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
  {/* 表头 */}
  <div className="overflow-x-auto">
    <table className="min-w-full divide-y divide-gray-200">
      <thead className="bg-gray-50">
        <tr>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            列标题
          </th>
          {/* 更多列 */}
        </tr>
      </thead>
      <tbody className="bg-white divide-y divide-gray-200">
        <tr>
          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
            数据内容
          </td>
          {/* 更多数据 */}
        </tr>
      </tbody>
    </table>
  </div>
</div>
```

## 功能特性

### 1. 排序
点击表头排序：
```jsx
<th 
  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
  onClick={() => handleSort('columnName')}
>
  <div className="flex items-center gap-1">
    列标题
    <span className="text-gray-400">↕</span>
  </div>
</th>
```

### 2. 行操作
每行末尾的操作按钮：
```jsx
<td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
  <button className="text-blue-600 hover:text-blue-900 mr-3">编辑</button>
  <button className="text-red-600 hover:text-red-900">删除</button>
</td>
```

### 3. 选择行
复选框选择：
```jsx
<td className="px-6 py-4 whitespace-nowrap">
  <input type="checkbox" className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
</td>
```

### 4. 状态标签
数据状态可视化：
```jsx
<span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
  已完成
</span>
<span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
  进行中
</span>
<span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
  失败
</span>
```

## 分页

```jsx
<div className="bg-white px-4 py-3 border-t border-gray-200 flex items-center justify-between">
  <div className="text-sm text-gray-700">
    显示 <span className="font-medium">1</span> 到 <span className="font-medium">10</span> 条，共 <span className="font-medium">97</span> 条
  </div>
  <div className="flex gap-1">
    <button className="px-3 py-1 border border-gray-300 rounded text-sm hover:bg-gray-50 disabled:opacity-50">
      上一页
    </button>
    <button className="px-3 py-1 bg-blue-600 text-white rounded text-sm">1</button>
    <button className="px-3 py-1 border border-gray-300 rounded text-sm hover:bg-gray-50">2</button>
    <button className="px-3 py-1 border border-gray-300 rounded text-sm hover:bg-gray-50">3</button>
    <button className="px-3 py-1 border border-gray-300 rounded text-sm hover:bg-gray-50 disabled:opacity-50">
      下一页
    </button>
  </div>
</div>
```

## 空状态

```jsx
<div className="text-center py-12">
  <div className="text-gray-400 text-5xl mb-4">📊</div>
  <h3 className="text-lg font-medium text-gray-900 mb-1">暂无数据</h3>
  <p className="text-gray-500 mb-4">开始添加第一条记录</p>
  <button className="bg-blue-600 text-white px-4 py-2 rounded-md">添加数据</button>
</div>
```

## 使用场景

- 后台数据管理（用户列表、订单列表）
- 报表展示
- 资源管理
- 任务列表

## 代码示例

### React

```tsx
interface DataTableProps<T> {
  data: T[];
  columns: {
    key: keyof T;
    title: string;
    render?: (value: T[keyof T], record: T) => React.ReactNode;
  }[];
  onEdit?: (record: T) => void;
  onDelete?: (record: T) => void;
}

export function DataTable<T extends { id: string | number }>({
  data,
  columns,
  onEdit,
  onDelete
}: DataTableProps<T>) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {columns.map(col => (
                <th 
                  key={String(col.key)}
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  {col.title}
                </th>
              ))}
              {(onEdit || onDelete) && (
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  操作
                </th>
              )}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {data.map(record => (
              <tr key={record.id} className="hover:bg-gray-50">
                {columns.map(col => (
                  <td key={String(col.key)} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {col.render ? col.render(record[col.key], record) : String(record[col.key])}
                  </td>
                ))}
                {(onEdit || onDelete) && (
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    {onEdit && (
                      <button 
                        onClick={() => onEdit(record)}
                        className="text-blue-600 hover:text-blue-900 mr-3"
                      >
                        编辑
                      </button>
                    )}
                    {onDelete && (
                      <button 
                        onClick={() => onDelete(record)}
                        className="text-red-600 hover:text-red-900"
                      >
                        删除
                      </button>
                    )}
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
```

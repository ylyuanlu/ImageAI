# Layout 布局组件

## 用途
提供标准的后台管理系统页面结构。

## 布局结构

```
┌────────────────────────────────────────────┐
│                   Header                   │
├──────────────┬─────────────────────────────┤
│              │                             │
│   Sidebar    │          Content            │
│              │                             │
│              │                             │
│              │                             │
└──────────────┴─────────────────────────────┘
```

## 组件实现

### Header 顶部导航

```jsx
<header className="bg-white shadow-sm border-b border-gray-200 fixed top-0 left-0 right-0 z-50 h-16">
  <div className="flex items-center justify-between px-6 h-full">
    {/* Logo */}
    <div className="flex items-center gap-3">
      <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">
        App
      </div>
      <span className="text-xl font-semibold text-gray-900">应用名称</span>
    </div>
    
    {/* 右侧操作区 */}
    <div className="flex items-center gap-4">
      {/* 通知 */}
      <button className="relative p-2 text-gray-500 hover:text-gray-700">
        <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
        🔔
      </button>
      
      {/* 用户菜单 */}
      <div className="flex items-center gap-2 cursor-pointer">
        <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
        <span className="text-sm text-gray-700">用户名</span>
      </div>
    </div>
  </div>
</header>
```

### Sidebar 侧边导航

```jsx
<aside className="w-64 bg-white shadow-sm border-r border-gray-200 fixed left-0 top-16 bottom-0 overflow-y-auto">
  <nav className="p-4">
    {/* 导航菜单 */}
    <ul className="space-y-1">
      <li>
        <a href="/dashboard" className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-blue-600 bg-blue-50 rounded-md">
          <span>📊</span>
          仪表盘
        </a>
      </li>
      <li>
        <a href="/users" className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-md">
          <span>👥</span>
          用户管理
        </a>
      </li>
      <li>
        <a href="/tasks" className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-md">
          <span>✓</span>
          任务管理
        </a>
      </li>
      <li>
        <a href="/settings" className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-md">
          <span>⚙️</span>
          系统设置
        </a>
      </li>
    </ul>
    
    {/* 分割线 */}
    <div className="my-4 border-t border-gray-200"></div>
    
    {/* 次级菜单 */}
    <ul className="space-y-1">
      <li>
        <a href="/help" className="flex items-center gap-3 px-4 py-2 text-sm text-gray-500 hover:text-gray-700">
          <span>❓</span>
          帮助中心
        </a>
      </li>
    </ul>
  </nav>
</aside>
```

### Content 内容区域

```jsx
<main className="ml-64 mt-16 p-6 min-h-screen bg-gray-50">
  {/* 页面标题区 */}
  <div className="mb-6">
    <h1 className="text-2xl font-bold text-gray-900">页面标题</h1>
    <p className="mt-1 text-sm text-gray-500">页面描述信息</p>
  </div>
  
  {/* 面包屑 */}
  <nav className="mb-6 text-sm text-gray-500">
    <ol className="flex items-center gap-2">
      <li><a href="/" className="hover:text-gray-900">首页</a></li>
      <li>/</li>
      <li><a href="/users" className="hover:text-gray-900">用户</a></li>
      <li>/</li>
      <li className="text-gray-900">详情</li>
    </ol>
  </nav>
  
  {/* 页面内容 */}
  <div className="space-y-6">
    {/* 内容卡片 */}
  </div>
</main>
```

### 完整布局组件

```jsx
export function Layout({ children, title, breadcrumbs = [] }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <Sidebar />
      <main className="ml-64 mt-16 p-6">
        {/* 页面标题 */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
          {breadcrumbs.length > 0 && (
            <nav className="mt-2 text-sm text-gray-500">
              <ol className="flex items-center gap-2">
                {breadcrumbs.map((crumb, index) => (
                  <li key={index} className="flex items-center gap-2">
                    {index > 0 && <span>/</span>}
                    {crumb.href ? (
                      <a href={crumb.href} className="hover:text-gray-900">{crumb.label}</a>
                    ) : (
                      <span className="text-gray-900">{crumb.label}</span>
                    )}
                  </li>
                ))}
              </ol>
            </nav>
          )}
        </div>
        
        {/* 页面内容 */}
        <div className="space-y-6">{children}</div>
      </main>
    </div>
  );
}
```

## 响应式设计

### 移动端适配

```jsx
// 移动端：侧边栏收起为汉堡菜单
function MobileLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* 移动端Header */}
      <header className="bg-white shadow-sm fixed top-0 left-0 right-0 z-50 h-16 flex items-center justify-between px-4">
        <button onClick={() => setSidebarOpen(true)} className="p-2">
          ☰
        </button>
        <span className="font-semibold">应用名称</span>
        <div className="w-8"></div>
      </header>
      
      {/* 移动端侧边栏（抽屉） */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/50" onClick={() => setSidebarOpen(false)}></div>
          <aside className="absolute left-0 top-0 bottom-0 w-64 bg-white shadow-xl">
            {/* 侧边栏内容 */}
          </aside>
        </div>
      )}
      
      {/* 主内容 */}
      <main className="mt-16 p-4">
        {children}
      </main>
    </div>
  );
}
```

## 使用示例

```jsx
function Dashboard() {
  return (
    <Layout 
      title="仪表盘"
      breadcrumbs={[{ label: '首页', href: '/' }, { label: '仪表盘' }]}
    >
      {/* 统计卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard title="总用户" value="1,234" trend="+12%" />
        <StatCard title="今日访问" value="856" trend="+5%" />
        <StatCard title="转化率" value="3.2%" trend="-2%" negative />
      </div>
      
      {/* 数据表格 */}
      <Card title="最近活动">
        <DataTable data={activities} columns={columns} />
      </Card>
    </Layout>
  );
}
```

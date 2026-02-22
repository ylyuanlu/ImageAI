# 默认UI组件库 - 快速参考

## 快速开始

当使用 `/do` 一键模式时，AI会自动：
1. 检测项目复杂度
2. 如为简单项目，跳过UI设计阶段
3. 使用本组件库生成高质量界面

## 组件速查表

### 基础组件
| 组件 | 用途 | 关键类名 | 文件 |
|------|------|---------|------|
| Button | 触发操作 | `btn btn-primary` | [Button.md](./components/Button.md) |
| Input | 文本输入 | `input` | [Input.md](./components/Input.md) |
| Select | 下拉选择 | `input` (select) | [Form.md](./components/Form.md) |
| Card | 内容容器 | `card` | [Card.md](./components/Card.md) |

### 数据展示
| 组件 | 用途 | 关键类名 | 文件 |
|------|------|---------|------|
| DataTable | 数据表格 | `table-container` | [DataTable.md](./components/DataTable.md) |
| StatCard | 统计卡片 | `card` | [Card.md](./components/Card.md) |
| Badge | 状态标签 | `badge badge-green` | [Card.md](./components/Card.md) |

### 反馈组件
| 组件 | 用途 | 关键类名 | 文件 |
|------|------|---------|------|
| Modal | 对话框 | 固定定位 | [Modal.md](./components/Modal.md) |
| Toast | 通知提示 | 固定定位右上角 | [Toast.md](./components/Toast.md) |
| Empty | 空状态 | 居中布局 | [Empty.md](./components/Empty.md) |

### 布局组件
| 组件 | 用途 | 关键类名 | 文件 |
|------|------|---------|------|
| Layout | 页面结构 | `layout-sidebar` `layout-content` | [Layout.md](./components/Layout.md) |
| Form | 表单布局 | `space-y-4` | [Form.md](./components/Form.md) |

## 设计规范速查

### 配色方案
```css
/* 主色 */
--color-primary: #3B82F6;
--color-primary-hover: #2563EB;

/* 中性色 */
--color-text-primary: #111827;     /* 标题 */
--color-text-secondary: #374151;   /* 正文 */
--color-text-muted: #6B7280;       /* 提示 */
--color-border: #D1D5DB;           /* 边框 */
--color-bg: #F9FAFB;               /* 背景 */

/* 功能色 */
--color-success: #10B981;
--color-warning: #F59E0B;
--color-error: #EF4444;
```

### 间距系统
```css
--space-1: 4px;    /* 紧凑 */
--space-2: 8px;    /* 默认间距 */
--space-3: 12px;   /* 章节内 */
--space-4: 16px;   /* 卡片内边距 */
--space-6: 24px;   /* 区块间距 */
```

### 圆角规范
```css
--radius-sm: 4px;   /* 输入框、标签 */
--radius-md: 6px;   /* 按钮、卡片 */
--radius-lg: 8px;   /* 模态框 */
```

## 典型页面模板

### 1. 列表页

```jsx
<Layout title="用户管理">
  {/* 操作栏 */}
  <div className="flex justify-between items-center mb-6">
    <div className="flex gap-4">
      <Input placeholder="搜索用户..." icon="🔍" />
      <Select>
        <option>全部角色</option>
        <option>管理员</option>
        <option>编辑</option>
      </Select>
    </div>
    <Button variant="primary">添加用户</Button>
  </div>
  
  {/* 数据表格 */}
  {data.length > 0 ? (
    <DataTable data={data} columns={columns} onEdit={handleEdit} onDelete={handleDelete} />
  ) : (
    <Empty icon="👥" title="暂无用户" description="开始添加第一个用户" action={{ label: '添加用户', onClick: openModal }} />
  )}
</Layout>
```

### 2. 表单页

```jsx
<Layout title="创建任务" breadcrumbs={[{ label: '任务', href: '/tasks' }, { label: '创建' }]}>
  <Card>
    <Form onSubmit={handleSubmit}>
      <div className="grid grid-cols-2 gap-4">
        <Input label="任务名称" required />
        <Select label="优先级" options={['高', '中', '低']} />
      </div>
      <Textarea label="描述" rows={4} />
      <DatePicker label="截止日期" />
      
      <div className="flex justify-end gap-3 pt-4 border-t">
        <Button variant="ghost" onClick={goBack}>取消</Button>
        <Button variant="primary" type="submit">保存</Button>
      </div>
    </Form>
  </Card>
</Layout>
```

### 3. 仪表盘

```jsx
<Layout title="仪表盘">
  {/* 统计卡片 */}
  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
    <StatCard title="总用户" value="1,234" trend="+12%" icon="👥" />
    <StatCard title="今日访问" value="856" trend="+5%" icon="👀" />
    <StatCard title="转化率" value="3.2%" trend="-2%" negative icon="📈" />
  </div>
  
  {/* 图表区域 */}
  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
    <Card title="访问趋势">
      {/* 图表组件 */}
    </Card>
    <Card title="最近活动">
      <DataTable data={activities} columns={activityColumns} />
    </Card>
  </div>
</Layout>
```

## 使用场景决策

### 何时使用默认组件库？

✅ **推荐使用**（跳过UI设计阶段）：
- 后台管理系统（CRUD操作）
- 数据展示面板
- 内部工具
- MVP验证产品
- 功能型应用
- 简单项目（功能点 < 3）

❌ **建议完整UI设计**（保留 /ui /art 阶段）：
- 电商前台（需要品牌感）
- 营销展示网站（需要视觉冲击力）
- 创意作品（需要独特设计）
- 复杂交互（需要精细UX设计）

### 在 Product-Spec.md 中指定设计要求

```markdown
## 视觉要求（可选）
- 风格：Modern Minimalist（或 Glassmorphism/Neumorphism）
- 主色：#10B981（自定义品牌色，默认使用蓝色 #3B82F6）
- 暗色模式：支持（默认使用亮色）
- 组件库：使用默认组件库（或自定义）
```

## 自定义配置

### 1. 覆盖配色
在 `tailwind.config.js` 中修改：
```javascript
colors: {
  primary: {
    DEFAULT: '#你的品牌色',
    // ...
  }
}
```

### 2. 添加自定义组件
在 `styles/globals.css` 中添加：
```css
@layer components {
  .my-custom-component {
    @apply /* Tailwind类名 */;
  }
}
```

### 3. 修改布局尺寸
在 `tailwind.config.js` 中：
```javascript
theme: {
  extend: {
    spacing: {
      'sidebar': '280px',  // 修改侧边栏宽度
    }
  }
}
```

## 质量保障检查清单

使用本组件库生成的界面会自动保证：

- [x] **视觉一致性**：统一的设计语言
- [x] **响应式设计**：适配桌面/平板/手机
- [x] **无障碍访问**：支持键盘导航
- [x] **性能优化**：轻量级，无需额外依赖
- [x] **专业外观**：符合现代Web设计标准
- [x] **交互反馈**：悬停、焦点、禁用状态

## 相关文件

- [README.md](./README.md) - 完整设计规范
- [tailwind.config.js](./styles/tailwind.config.js) - 样式配置
- [globals.css](./styles/globals.css) - 全局样式
- `../components/` - 组件详细文档

## 版本信息

- **版本**：v1.0.0
- **更新日期**：2026-02-04
- **适用场景**：AI开发工作流 /do 一键模式
- **技术栈**：React + Tailwind CSS / Vue 3 + Tailwind CSS

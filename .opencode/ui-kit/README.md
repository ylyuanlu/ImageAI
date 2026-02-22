# 默认UI组件库 (Default UI Kit)

## 设计哲学

这是一个为AI自动生成的前端代码提供**质量保底**的组件库。当跳过UI设计阶段时，使用这些预置的、经过优化的组件，确保生成的界面既专业又实用。

## 设计规范

### 视觉风格：Modern Minimalist Professional
- **简洁**：去除多余装饰，聚焦内容
- **专业**：适合后台系统、工具类产品
- **中性**：不抢内容风头，支持多种场景

### 配色方案
```css
/* 主色调 - 专业蓝 */
--color-primary: #3B82F6;
--color-primary-hover: #2563EB;
--color-primary-light: #EFF6FF;

/* 中性色 - 灰度 */
--color-gray-900: #111827;  /* 主文字 */
--color-gray-700: #374151;  /* 次要文字 */
--color-gray-500: #6B7280;  /* 提示文字 */
--color-gray-300: #D1D5DB;  /* 边框 */
--color-gray-100: #F3F4F6;  /* 背景 */
--color-gray-50: #F9FAFB;   /* 浅色背景 */

/* 功能色 */
--color-success: #10B981;
--color-warning: #F59E0B;
--color-error: #EF4444;
--color-info: #3B82F6;
```

### 字体规范
- **主字体**：system-ui, -apple-system, sans-serif
- **标题**：font-weight: 600
- **正文**：font-weight: 400, font-size: 14px
- **小号文字**：font-size: 12px, color: gray-500

### 间距系统（4px基础网格）
```css
--space-1: 4px;   /* 极紧凑 */
--space-2: 8px;   /* 紧凑 */
--space-3: 12px;  /* 默认 */
--space-4: 16px;  /* 舒适 */
--space-5: 20px;  /* 宽松 */
--space-6: 24px;  /* 章节 */
--space-8: 32px;  /* 大间距 */
--space-10: 40px; /* 区块 */
```

### 圆角系统
```css
--radius-sm: 4px;   /* 输入框、标签 */
--radius-md: 6px;   /* 按钮、卡片 */
--radius-lg: 8px;   /* 模态框、面板 */
--radius-xl: 12px;  /* 大卡片、图片 */
```

### 阴影系统
```css
--shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
--shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
--shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
```

## 组件清单

### 基础组件
- [Button](./components/Button.md) - 按钮（主要/次要/危险/幽灵）
- [Input](./components/Input.md) - 输入框（文本/密码/数字）
- [Select](./components/Select.md) - 下拉选择
- [Checkbox](./components/Checkbox.md) - 复选框
- [Radio](./components/Radio.md) - 单选框
- [Textarea](./components/Textarea.md) - 多行文本
- [DatePicker](./components/DatePicker.md) - 日期选择

### 数据展示
- [Card](./components/Card.md) - 信息卡片
- [DataTable](./components/DataTable.md) - 数据表格（排序/筛选/分页）
- [StatCard](./components/StatCard.md) - 统计卡片
- [List](./components/List.md) - 列表
- [Badge](./components/Badge.md) - 标签
- [Avatar](./components/Avatar.md) - 头像

### 反馈组件
- [Modal](./components/Modal.md) - 模态对话框
- [Toast](./components/Toast.md) - 通知提示
- [Loading](./components/Loading.md) - 加载状态
- [Empty](./components/Empty.md) - 空状态
- [Error](./components/Error.md) - 错误状态

### 布局组件
- [Layout](./components/Layout.md) - 页面布局（Header/Sidebar/Content）
- [Grid](./components/Grid.md) - 网格系统
- [Container](./components/Container.md) - 容器
- [Divider](./components/Divider.md) - 分隔线

### 导航组件
- [Breadcrumb](./components/Breadcrumb.md) - 面包屑
- [Tabs](./components/Tabs.md) - 标签页
- [Menu](./components/Menu.md) - 导航菜单
- [Pagination](./components/Pagination.md) - 分页

## 使用指南

### 何时使用默认组件库？

✅ **推荐使用场景**：
- 后台管理系统（CRUD操作）
- 数据展示面板
- 内部工具
- MVP验证产品
- 功能型应用（非展示型）

❌ **建议完整UI设计场景**：
- 电商前台
- 营销展示网站
- 创意作品
- 品牌产品
- 复杂交互应用

### 在代码中引用

当使用 `/do` 一键模式时，AI会自动：
1. 检测项目类型和复杂度
2. 如为简单项目，跳过UI设计阶段
3. 使用本组件库生成界面
4. 基于 Product-Spec.md 推断合适的组件组合

### 质量保障

即使跳过UI设计阶段，使用本组件库也能保证：
- ✓ **视觉一致性**：统一的设计语言
- ✓ **响应式设计**：适配桌面/平板/手机
- ✓ **无障碍访问**：支持键盘导航和屏幕阅读器
- ✓ **性能优化**：轻量级，无需额外依赖
- ✓ **专业外观**：符合现代Web设计标准

## 技术栈适配

本组件库提供以下技术栈的实现模板：

- **React + Tailwind CSS**（推荐）
- **Vue 3 + Tailwind CSS**
- **HTML + Tailwind CSS**
- **React + CSS Modules**
- **Vue 3 + Scoped CSS**

## 自定义配置

如需调整默认样式，可在 `Product-Spec.md` 中指定：

```markdown
## 视觉要求
- 主色：#10B981（自定义品牌色，默认使用蓝色）
- 风格：Minimalist（或 Glassmorphism/Neumorphism）
- 暗色模式：支持（默认使用亮色）
```

## 版本信息

- **版本**：v1.0.0
- **更新日期**：2026-02-04
- **适用**：AI开发工作流 /do 一键模式

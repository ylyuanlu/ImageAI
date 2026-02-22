---
name: design-generator
description: "设计稿生成器。支持多种生成策略：优先使用高质量方案（frontend-design/ui-ux-pro-max），降级到HTML原型生成，最终兜底使用默认组件库。统一处理/art指令的设计稿生成需求。"
---

# Design Generator - 统一设计稿生成器

## 定位

`/art` 指令的统一设计稿生成器，整合多种生成策略，自动选择最佳方案。

## 生成策略（按优先级）

```
用户执行 /art
    ↓
检测可用能力（按优先级）
    ↓
├─ frontend-design 全局技能可用？
│   └─ ✅ 使用 frontend-design → 高质量设计代码
│
├─ ui-ux-pro-max 全局技能可用？
│   └─ ✅ 使用 ui-ux-pro-max → 专业设计规范
│
├─ MCP图像生成服务可用？
│   └─ ✅ 使用MCP服务 → PNG/PDF设计图
│
└─ 使用本地HTML原型生成（保底方案）
    ├─ 读取 UI-Prompts.md 获取设计规范
    ├─ 基于风格选择模板
    └─ 生成 design-assets/*.html
```

## 输入

- `UI-Prompts.md`：设计规范、视觉风格、配色方案
- `.opencode/ui-kit/`：默认组件库（兜底时使用）

## 输出

- `design-assets/*.html`：HTML原型文件
- `design-assets/README.md`：设计说明

## 支持的设计风格

| 风格 | 模板文件 | 适用场景 |
|------|----------|----------|
| Modern Minimalist | `templates/modern-minimalist.html` | 通用型应用 |
| Glassmorphism | `templates/glassmorphism.html` | 时尚科技类 |
| Dark Mode | `templates/dark-mode.html` | 夜间使用为主 |
| Bento Grid | `templates/bento-grid.html` | 仪表盘工具类 |

## 工作流程

### Step 1: 检测最佳生成方案

按优先级检测可用能力，选择最佳方案。

### Step 2: 生成设计稿

**方案A：高质量方案**
- 使用 frontend-design/ui-ux-pro-max 生成

**方案B：HTML原型（保底）**
1. 读取 UI-Prompts.md
2. 根据视觉风格选择模板
3. 使用默认组件库组装页面
4. 生成完整HTML文件

### Step 3: 输出与提示

```
✅ 设计稿生成完成！

生成方式：HTML原型（保底方案）
质量等级：⭐⭐⭐ (70分) - 基础可用

输出文件：
- design-assets/index.html
- design-assets/home.html
- design-assets/upload.html

💡 提示：这是保底方案，如需更高质量设计：
   1. 安装 frontend-design 全局技能
   2. 或使用 /ui 优化设计提示词

继续下一步：/confirm 确认设计
```

## 降级策略

当高级方案不可用时，自动降级到HTML原型生成，确保流程不中断。

## 相关技能

- `ui-prompt-generator`：生成UI提示词（前置）
- `design-confirmer`：设计确认（后置，已内嵌到AGENTS.md）

## 使用方式

```bash
# 自动调用，无需手动执行
# 执行 /art 时自动触发
```

# 快速开始指南

## 第一步：开始需求收集

输入 `/prd` 开始。

产品经理会通过追问了解你的需求，包括：
- 项目概述
- 目标用户
- 核心功能
- 功能优先级

完成后会生成 `Product-Spec.md`。

## 第二步：生成 UI 提示词

确保已有 `Product-Spec.md`，然后输入 `/ui`。

UI 设计师会生成 UI-Prompts.md，包含：
- 视觉风格建议
- 配色方案
- 界面元素描述

## 第三步：生成设计稿

确保已有 `UI-Prompts.md`，然后输入 `/art`。

系统会询问使用哪种方式生成设计稿：
1. **canvas-design** - 快速生成
2. **MCP 服务** - 需要配置（如 Nano Banana）

生成的设计稿会保存在 `design-assets/` 目录。

## 第四步：确认设计

确保已有 `design-assets/` 目录，然后输入 `/confirm`。

展示设计稿，引导你确认设计方向。如果需要修改，可以重新生成。

## 第五步：开始开发

确保已有 `Product-Spec.md`，然后输入 `/dev`。

开发工程师会根据产品文档实现代码。

## 第六步：验证和测试

1. **运行项目**：输入 `/run` 启动项目，验证功能
2. **执行测试**：输入 `/test` 运行单元测试

## 第七步：代码审查

确保测试通过后，输入 `/review` 进行代码审查。

## 第八步：部署上线

确保审查通过后，输入 `/deploy` 部署到生产环境。

## 第九步：完整度检查

部署完成后，输入 `/check` 检查功能完整性。

## 完整流程图

```
开始
  ↓
/prd - 需求收集 → Product-Spec.md
  ↓
/ui - UI 提示词 → UI-Prompts.md
  ↓
/art - 设计稿 → design-assets/
  ↓
/confirm - 设计确认 → Design-Confirmation.md
  ↓
/dev - 代码开发 → src/
  ↓
/run - 本地运行 → 验证功能
  ↓
/test - 单元测试 → test-report.md
  ↓
/review - 代码审查 → code-review-report.md
  ↓
/deploy - 部署 → deployment-report.md
  ↓
/check - 完整度检查 → 功能验证
  ↓
完成
```

## 遇到问题？

- 输入 `/help` 查看帮助
- 输入 `/status` 查看当前状态
- 查看常见问题：`faq.md`

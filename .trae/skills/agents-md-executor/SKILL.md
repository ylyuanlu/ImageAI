---
name: "agents-md-executor"
description: "AGENTS.md 指令执行器。解析和执行 AGENTS.md 中定义的工作流。当用户输入以 '/' 开头的指令（如 /help, /do, /dev）时自动触发。"
---

# AGENTS.md 指令执行器

## 触发条件

**自动触发**：当用户输入以 `/` 开头的任何指令时
**手动触发**：用户明确说"执行 AGENTS.md 指令"

## 功能

此技能让 Trae 能够像 OpenCode 一样自动读取、解析和执行 `AGENTS.md` 文件中定义的指令工作流。

## 支持的指令

根据 AGENTS.md 定义，支持以下核心指令：

### 🚀 核心工作流指令
- `/do` - 一键智能执行（需求→开发→验证）
- `/prd` - 需求收集
- `/ui` - UI设计
- `/art` - 设计稿生成
- `/confirm` - 设计确认
- `/dev` - 代码开发
- `/run` - 本地运行
- `/fix` - 快速修复
- `/check` - 完整度检查
- `/deploy` - 部署上线

### 🛠️ 开发工具指令
- `/test` - 测试验证
- `/review` - 代码审查
- `/commit` - 智能提交

### ⚙️ 项目管理指令
- `/help` - 帮助与引导
- `/status` - 查看状态
- `/save` - 保存检查点
- `/load` - 加载检查点

## 执行流程

### 1. 读取 AGENTS.md
- 读取项目根目录的 `AGENTS.md` 文件
- 解析指令定义和工作流

### 2. 检测项目状态
- 检查 `Project-Memory.md` 是否存在
- 检查 `Product-Spec.md` 是否存在
- 检查 `design-assets/` 目录
- 确定当前阶段

### 3. 执行对应工作流
根据指令类型执行 AGENTS.md 中定义的工作流：

#### /help 工作流
```
1. 检测当前项目状态
2. 显示智能精简菜单
3. 根据项目状态显示推荐指令
4. 提供交互选项（数字/more/pro/H）
```

#### /do 工作流
```
1. 检测项目状态 + 读取自治配置
2. 计算置信度
3. 根据置信度选择自治模式或辅助模式
4. 执行完整工作流（需求→开发→验证）
5. 更新 Project-Memory.md
```

#### /dev 工作流
```
1. 检测 Product-Spec.md
2. 检测现有项目类型和技术栈
3. 调用 dev-builder 实现功能代码
4. 即时验证代码可运行
```

## 与 OpenCode 的兼容性

此执行器完全兼容 OpenCode 的 AGENTS.md 格式：

- ✅ 支持所有标准指令
- ✅ 支持指令参数（如 `--force`, `--mvp`）
- ✅ 支持工作流嵌套调用
- ✅ 支持 Project-Memory.md 自动更新
- ✅ 支持技能包调用（通过 opencode-skills-bridge）

## 示例

### 示例 1：执行 /help

```
用户: /help

AI: 
## 📋 /help - 帮助菜单

### 🔍 项目状态检测
```
✅ Project-Memory.md 存在
✅ Product-Spec.md 存在
✅ 当前阶段: 开发中
```

### 🚀 核心工作流指令
| 序号 | 指令 | 功能 |
|:---:|:---|:---|
| 1 | `/do` | 一键智能执行 |
| 2 | `/dev` | 代码开发 |
| ... | ... | ... |

💡 推荐下一步: /dev - 继续开发
```

### 示例 2：执行 /do

```
用户: /do 添加用户登录功能

AI: [检测项目状态]
    [计算置信度: 0.85]
    [进入自治执行模式]
    
    ✓ 分析需求
    ✓ 更新 Product-Spec.md
    ✓ 开发代码
    ✓ 运行验证
    
    功能已完成！
```

## 依赖

- `opencode-skills-bridge` - 用于访问 OpenCode 技能包
- `project-memory` - 用于读写 Project-Memory.md

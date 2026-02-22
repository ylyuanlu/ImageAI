---
name: opencode-skills-bridge
description: "OpenCode 技能桥接器。允许 Trae 访问 OpenCode 的全局技能和本地技能。当 Trae 需要使用 OpenCode 技能时自动触发。"
---

# OpenCode 技能桥接器

## 功能

此技能作为 Trae 和 OpenCode 之间的桥接器，允许 Trae 访问 OpenCode 中定义的所有技能，包括：

- OpenCode 本地技能（.opencode/skills/）
- OpenCode 全局技能配置

## 工作原理

1. **自动检测**：当 Trae 需要使用技能时，会先检查 .trae/skills/ 目录
2. **本地桥接**：如果在 .trae/skills/ 中找不到对应技能，会自动查找 .opencode/skills/ 目录
3. **全局桥接**：如果本地目录也找不到，会查找用户根目录下的全局技能目录 C:\Users\yuanlu\.config\opencode\skills
4. **技能传递**：找到技能后，将技能信息传递给 Trae 进行加载

## 支持的技能

通过此桥接器，Trae 可以访问以下 OpenCode 技能：

### 本地技能（项目级）

| 技能名称 | 路径 | 功能 |
|---------|------|------|
| product-spec-builder | .opencode/skills/product-spec-builder/ | 需求收集，生成产品文档 |
| ui-prompt-generator | .opencode/skills/ui-prompt-generator/ | 生成 UI 设计提示词 |
| design-generator | .opencode/skills/design-generator/ | 设计稿生成器 |
| dev-builder | .opencode/skills/dev-builder/ | 代码开发构建器 |
| quality-gate | .opencode/skills/quality-gate/ | 质量检查和测试 |
| session-manager | .opencode/skills/session-manager/ | 会话管理和检查点 |

### 全局技能（系统级）

| 技能类型 | 路径 | 说明 |
|---------|------|------|
| 全局技能 | C:\Users\yuanlu\.config\opencode\skills\ | OpenCode 全局技能目录 |
| 系统技能 | 内置 | OpenCode 系统级技能 |

## 全局技能映射

| OpenCode 全局技能 | Trae 等效技能 |
|------------------|--------------|
| brainstorming | brainstorming |
| cache-components | cache-components |
| canvas-design | canvas-design |
| ci-cd | ci-cd |
| code-reviewer | code-reviewer |
| dispatching-parallel-agents | dispatching-parallel-agents |
| docx | docx |
| find-skills | find-skills |
| finishing-a-development-branch | finishing-a-development-branch |
| frontend-code-review | frontend-code-review |
| frontend-design | frontend-design |
| fullstack-developer | fullstack-developer |
| json-canvas | json-canvas |
| markitdown | markitdown |
| mcp-builder | mcp-builder |
| obsidian-bases | obsidian-bases |
| obsidian-markdown | obsidian-markdown |
| pdf | pdf |
| planning-with-files | planning-with-files |
| pptx | pptx |
| react-best-practices | react-best-practices |
| react-native-skills | react-native-skills |
| receiving-code-review | receiving-code-review |
| requesting-code-review | requesting-code-review |
| skill-creator | skill-creator |
| subagent-driven-development | subagent-driven-development |
| systematic-debugging | systematic-debugging |
| terraform-skill | terraform-skill |
| test-driven-development | test-driven-development |
| theme-factory | theme-factory |
| ui-ux-pro-max | ui-ux-pro-max |
| uni-app-x | uni-app-x |
| using-git-worktrees | using-git-worktrees |
| using-superpowers | using-superpowers |
| verification-before-completion | verification-before-completion |
| webapp-testing | webapp-testing |
| writing-skills | writing-skills |
| xlsx | xlsx |

## 使用方法

无需手动配置，Trae 会自动通过此桥接器访问 OpenCode 技能。

### 示例

当用户在 Trae 中执行以下指令时：

```bash
/do 做一个任务管理工具
```

Trae 会：
1. 检查 .trae/skills/ 目录
2. 通过 opencode-skills-bridge 找到 .opencode/skills/product-spec-builder/
3. 加载并使用该技能生成产品文档
4. 继续执行后续工作流

## 优势

1. **无需修改 AGENTS.md**：保持原有技能描述不变
2. **自动同步**：当 OpenCode 技能更新时，Trae 会自动获得更新
3. **无侵入性**：不影响现有技能结构和加载机制
4. **灵活性**：支持未来添加新技能

## 故障排除

如果 Trae 无法访问 OpenCode 技能，请检查：

1. .opencode/skills/ 目录是否存在
2. 对应技能目录是否包含 SKILL.md 文件
3. 技能文件格式是否正确

## 未来扩展

此桥接器设计为可扩展的，未来可以：

1. 支持更多 AI IDE 的技能目录
2. 添加技能版本管理
3. 实现技能优先级机制
4. 支持远程技能仓库
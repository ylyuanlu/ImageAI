# Product-Spec Change Log

- 2026-02-09: **[Architecture]** 重构创作流程为多页面架构 - 将单页面创作流程拆分为：Upload（上传配置）→ Progress（进度展示）→ Result（结果展示）。新增 `/progress` 页面带动态进度动画和3阶段状态提示，新增 `/result` 页面含4种社交平台分享功能。优化用户心理预期管理，支持结果页独立分享链接。

- 2026-02-09: **[Feature]** 实现穿搭方案更换功能 - 新增 `/outfit` 页面，包含6大分类（夏季/冬季/运动/正式/休闲/派对）共23套系统推荐穿搭，支持用户本地上传服装照片，与开始创作页面集成（localStorage数据同步）。

- 2026-02-09: **[Feature]** 添加社交分享功能 - 在结果页面新增分享到微信、小红书、Instagram、Twitter功能，点击后自动复制图片链接和预设文案。

- 2026-02-08: **[Bug Fix]** 修复三个已知问题：1) 大文件上传超时 - 添加图片自动压缩（>5MB自动压缩至1920px，质量80%）；2) AI生成偶发失败 - 实现3次重试机制（指数退避延迟）；3) 移动端预览错位 - 优化响应式布局（aspect-ratio + grid自适应）。新增 `lib/utils/network.ts`、`lib/hooks/useAIGeneration.ts`、`lib/hooks/useImageUpload.ts` 工具库，更新 `app/upload/page.tsx` 集成修复。

- 2026-02-08: **[UI Polish]** 优化导航栏视觉层次 - 导航链接改为14px字重400，当前页使用主题色高亮。定价页面添加原价划线促销（专业版¥59→¥49，团队版¥249→¥199）和Footer页脚组件。

- 2026-02-04: **[Workflow]** 增加专门的安全审查阶段（`/security-scan`）。在代码审查（`/review`）和部署（`/deploy`）之间插入安全扫描阶段，包括 SAST 静态代码分析、SCA 依赖漏洞扫描和配置安全检查。更新 AGENTS.md、Project-Memory.md 和相关技能定义。生成安全扫描报告模板（security-report.md）。

- 2026-01-31: Created MVP development scaffold under /dev flow. Added Gemini mock API and in-memory history endpoints.

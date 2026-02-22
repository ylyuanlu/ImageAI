# AI服装模特图生成应用 - UI原型图提示词

---

## 设计原则

**核心定位**：模特换装工具，而非时尚杂志

**设计理念**：
- 工具优先：界面服务于功能，而非视觉炫技
- 清晰反馈：用户始终能看到模特与服装的实时状态
- 简洁高效：减少认知负担，核心操作3步内完成
- 真实展示：强调换装效果，而非AI分析数据

**配色方案**：
- 主色：#374151 (深灰) - 冷静、专业、可信赖
- 强调色：#6366F1 (靛蓝) - 操作按钮、关键动作
- 背景：#F9FAFB (极浅灰) - 干净、专注
- 卡片：#FFFFFF (纯白) - 内容容器
- 文字：#1F2937 (黑灰) - 高可读性

**字体**：
- 标题/按钮：Inter (Bold) - 清晰、现代
- 正文：Inter (Regular) - 专业、易读

---

## 页面设计矩阵

| 页面 | 核心功能 | 布局方式 |
|------|----------|----------|
| 首页 | 展示工具能力 + 快速开始 | 简洁展示 + CTA |
| 图片上传 | 模特图 + 服装图输入 | 左右分栏对比 |
| 生成结果 | 换装效果展示 | 大图预览 + 参数 |
| 姿势选择 | 姿势库筛选切换 | 网格卡片 |
| 穿搭选择 | 服装快速切换 | 简洁列表 |
| 历史记录 | 生成记录管理 | 表格视图 |
| 登录 | 账号登录 | 简洁表单 |
| 分享 | 结果导出 | 简单选项 |

---

## 页面设计提示词

### 页面 1：首页

**设计目标**：清晰展示工具价值，引导用户快速开始换装

```
Clean SaaS homepage for AI fashion model generator, minimalist design focused on product demo. Light gray (#F9FAFB) background with large central area showing animated demo: mannequin figure with clothing overlay animation demonstrating core "try-on" functionality. Simple headline "Virtual Try-On in Seconds" in dark gray (#1F2937) Inter Bold. Three feature cards below in white cards with subtle shadow: "Upload Model Photo" icon, "Add Your Outfit" icon, "Generate Look" icon. Primary CTA button "Start Creating Free" in indigo (#6366F1) with subtle shadow, clearly visible above fold. Footer with minimal links. Professional B2B tool aesthetic, no decorative elements, pure product focus. 1920x1080, clean and trustworthy atmosphere.
```

**关键UX元素**：
- 核心动画：展示"模特+服装=换装结果"的简单流程
- CTA按钮：固定顶部/首屏，44px高度
- 导航：简洁logo + "Sign In"链接

---

### 页面 2：图片上传界面

**设计目标**：清晰区分模特图和服装图上传区，实时预览叠加效果

```
Professional fashion AI upload interface, light gray (#F9FAFB) background. Split layout with left panel (45%) "Model Reference" - large dashed border upload area for mannequin/figure photo, clear label "Upload full-body photo with clear pose", thumbnail preview area below showing uploaded model. Right panel (45%) "Outfit Reference" - upload area for clothing photo, supports 1-3 images shown as small thumbnails, label "Upload clothing items to try on". Center panel (10%) shows live composite preview: mannequin outline with clothing overlaid transparently, indicating how final result will combine inputs. Bottom action bar with fixed height, primary "Generate Look" button in indigo (#6366F1), secondary "Clear All" button. Clean file size indicators, progress bars for uploads. Efficient workflow, clear input-output relationship. 1920x1080, desktop-optimized, no decorative graphics.
```

**关键UX元素**：
- 上传区：清晰区分模特/服装，避免混淆
- 实时预览：透明叠加显示输入组合
- 批量支持：服装支持多图，模特单图
- 进度反馈：上传进度清晰显示

---

### 页面 3：AI生成结果展示

**设计目标**：最大化展示换装效果，清晰展示生成参数

```
Fashion AI results page, focused on image presentation. Large central image area (80%) showing generated result - model wearing the uploaded outfit in high quality, clean display with subtle border. Right sidebar (20%) "Generation Details" panel in white: shows input thumbnails (model + outfit) for reference, parameter tags: Style (Casual/Formal), Lighting (Natural/Studio), Background (Solid/Natural), Image Count (1-4). "Download" button in dark gray, "Share" button outlined, "Regenerate" button in indigo (#6366F1). Below main image: horizontal strip of alternate generations if multiple results, each with small thumbnail and quick "View" button. Simple filtering tabs above: "All Results", "Standing", "Sitting". Clean white background, product photography display aesthetic. 1920x1080, image-first design, no decorative elements.
```

**关键UX元素**：
- 大图展示：换装效果清晰可见
- 参数面板：简洁标签，不做复杂分析
- 多结果切换：横向缩略图快速浏览
- 快捷操作：下载/分享/重新生成

---

### 页面 4：姿势选择界面

**设计目标**：快速筛选和切换姿势，保持服装不变

```
Practical pose selection interface, light gray (#F9FAFB) background. Left panel (30%) "Current Preview" showing model with selected pose in large preview, confirming pose change without affecting outfit. Right panel (70%) with two sections: Top section (30%) is "Describe Your Pose" - simple text input field with placeholder "E.g., standing with arms crossed" and AI suggestion chips below (Walking confidently, Sitting elegantly, Arms raised). Bottom section (70%) is "Pose Library" with category tabs: Standing, Sitting, Walking, Casual. Below tabs, grid of pose cards (4 columns) - each card shows small pose silhouette thumbnail with pose name label. Selected pose has dark border highlight. "Apply Pose" button in indigo (#6366F1) fixed at bottom. Clean list-view aesthetic, efficient browsing, text-to-pose feature integrated seamlessly. 1920x1080, desktop-optimized, functional tool design.
```

**关键UX元素**：
- 实时预览：确认姿势变化效果
- 分类筛选：快速定位目标姿势
- 简洁网格：易读易选，不炫技
- 明确操作：Apply按钮确认选择

---

### 页面 5：穿搭选择界面

**设计目标**：快速切换服装，保持当前姿势和模特不变

```
Outfit switching interface, focused on quick selection. Left panel (40%) "Current Model" showing current model preview with current outfit, unchanged during selection. Right panel (60%) "Select New Outfit" with three sections: Top section is smart filter bar with tags based on current outfit: "Summer Style", "Casual", "Blue Tones" - one-click filtering. Middle section "Upload Your Photo" dashed area for custom clothing. Bottom section "Recommended Outfits" showing clothing items in simple grid - each item with thumbnail photo, category tag (Top/Bottom/Dress), and small "Match" badge if similar to current style. Selected outfit has blue border. "Apply Outfit" button in indigo (#6366F1) prominent. Clean and efficient, simple tag-based recommendations without complex AI analysis. 1920x1080, straightforward selection workflow.
```

**关键UX元素**：
- 模特预览区：保持静止，显示当前状态
- 服装列表：简洁图片+标签，无复杂推荐
- 上传区域：支持自定义服装
- 快速切换：一键应用，保持姿势

---

### 页面 6：历史记录界面

**设计目标**：实用的记录管理，快速查找和操作

```
Generation history dashboard, clean data table design. White background with full-width data table showing: Date/Time column, Input Thumbnails (model + outfit small icons), Parameters (Style, Lighting, Background tags), Result Thumbnail, Actions (View, Download, Delete buttons). Top bar with search field, date range filter, "Clear History" option. Each row clearly shows what was generated. Pagination at bottom. Simple statistics header: "Total Generations: X, This Month: Y". No decorative cards or film strip effects. Efficient information density, quick scanning. 1920x1080, admin dashboard aesthetic, pure utility focus.
```

**关键UX元素**：
- 表格视图：信息密度高，易于浏览
- 搜索过滤：快速定位目标记录
- 批量操作：支持多选删除/导出
- 简洁统计：仅显示必要数据

---

### 页面 7：登录界面

**设计目标**：简洁高效的账号登录

```
Clean login page, light gray (#F9FAFB) background. Centered white card (400px width) with app logo at top, simple headline "Sign in to your account". Email input field with clear label, password input with "Show/Hide" toggle. "Sign In" button full width in indigo (#6366F1). "Forgot password?" link below. Social login row: Google, Apple icons only, minimal. "New here? Create account" link at bottom. No decorative background images, no testimonials, no trust badges parade. Pure focus on login task. 1920x1080, mobile-responsive card width, efficient onboarding.
```

**关键UX元素**：
- 简洁表单：减少填写负担
- 社交登录：支持主流平台
- 清晰链接：忘记密码/注册入口

---

### 页面 8：分享界面

**设计目标**：快速导出和分享结果

```
Simple export interface, light gray background. Left section (50%) showing final image in large preview. Right section (50%) "Export Options" with: Platform selection grid (WeChat, Xiaohongshu, Instagram, Download) - each with icon and simple toggle. Quality selector (Original/HD). "Include Watermark" toggle. "Export" button in indigo (#6366F1) prominent. Below: Download link/QR code appears after export. No editing tools, no caption editor, no scheduling. Pure export functionality. 1920x1080, single-purpose tool design.
```

**关键UX元素**：
- 平台选择：简单网格，一键切换
- 质量选项：原图/高清
- 水印控制：简单开关
- 快速导出：一步完成

---

## AI交互界面

### 生成进度界面

**设计目标**：清晰展示生成进度和当前阶段

```
Simple progress interface, clean light gray background. Central status area showing: large percentage counter (e.g., "45%"), progress bar below with indigo fill. Text status: "Analyzing your photos...", "Generating your look...", "Finalizing..." in sequence. Below, small input previews showing model and outfit thumbnails. Estimated time remaining indicator. "Cancel" button simple text link. No animation particles, no neural network visualizations. Pure status communication. 1920x1080, minimal distraction, clear progress indication.
```

---

### 结果页面AI建议（简化版）

**设计目标**：提供实用的换装建议，不做过度分析

```
Minimal AI suggestions panel, appears after generation completes. Simple text: "Try these adjustments:" followed by 2-3 short suggestions like "Try natural lighting for better detail", "Standing pose works well with this outfit", "Consider adding accessories". Each suggestion with "Apply" button. No confidence scores, no charts, no detailed breakdowns. Helpful but unobtrusive. Slide-in animation, dismissible. 1920x1080, optional feature, not core flow.
```

---

## 设计决策总结

| 维度 | 设计原则 |
|------|----------|
| **产品定位** | 模特换装工具 |
| **视觉风格** | 简洁、专业、可信赖 |
| **交互理念** | 功能优先，减少认知负担 |
| **信息展示** | 清晰展示换装效果 |
| **AI功能** | 辅助建议，不喧宾夺主 |
| **智能推荐** | 简单标签匹配，无复杂分析 |
| **文本生成** | 自然语言输入，AI建议辅助 |
| **动画效果** | 最小化，仅用于必要反馈 |
| **整体调性** | B2B工具感 > 消费级时尚感 |

---

## 关键设计决策

### 为什么要这样设计：

1. **工具属性优先**
   - 用户来是为了换装，不是欣赏UI
   - 清晰的输入-处理-输出流程
   - 减少装饰性元素

2. **实时反馈**
   - 每个步骤都能看到当前状态
   - 模特和服装始终清晰可见
   - 参数调整结果可预见

3. **简洁交互**
   - 简化推荐系统：标签匹配而非复杂AI分析
   - 整合文本生成：自然语言输入框无缝集成
   - 去掉炫技的动画效果
   - 去掉过度设计的分析面板

4. **聚焦核心**
   - 换装效果展示最大化
   - 操作流程简单直接
   - 结果导出便捷

---

## 版本历史

- **v4.1** - 2026-02-07: 功能完善
  - 姿势选择页添加文本描述输入框（支持自然语言生成姿势）
  - 穿搭选择页添加简单标签匹配推荐（基于当前风格）
  - 保持简洁工具风格，避免过度设计

- **v4.0** - 2026-02-07: 重新设计，回归工具属性
  - 去掉时尚杂志风格
  - 强调换装效果展示
  - 简化交互和AI功能
  - 采用中性专业配色

---

**文档版本**: v4.1

**最后更新**: 2026-02-07

**对应产品文档**: Product-Spec.md v1.0

**匹配度评分**: 10/10 ✅

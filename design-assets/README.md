# Design Assets - ImageAI v3.0

> **生成时间**: 2026-02-06  
> **设计系统**: ui-ux-pro-max Professional  
> **版本**: 双版本方案 (A + B)

---

## 版本概览

### 🌸 Version A: Modern Beauty (亮粉紫色调)

**目标用户**: 年轻创作者、社交媒体用户、普通消费者  
**情感基调**: 活泼、创意、友好、明亮  
**配色方案**: 
- 主色: #EC4899 (亮粉)
- 辅助色: #A855F7 (紫色)  
- 强调色: #FCD34D (金色)
- 背景: #FDF2F8 (浅粉)

**字体搭配**:
- 标题: Space Grotesk (现代几何无衬线)
- 正文: Inter (经典无衬线)

**设计特点**:
- ✨ 渐变色背景和玻璃拟态卡片
- 🏃 浮动动画效果
- 📱 移动端优先的响应式设计
- 🎯 CTA按钮带微光动画
- 📐 Pinterest风格瀑布流布局

### 🌟 Version B: Luxury Editorial (午夜蓝金调)

**目标用户**: 专业设计师、品牌方、高端用户  
**情感基调**: 专业、高端、精致、杂志风  
**配色方案**:
- 主色: #1A1A2E (午夜蓝)
- 辅助色: #E94560 (珊瑚红)
- 强调色: #FFD700 (金色)
- 背景: #FAFAFA (极浅灰)

**字体搭配**:
- 标题: Playfair Display (优雅衬线)
- 正文: Inter (现代无衬线)

**设计特点**:
- 🎭 戏剧性分屏hero布局
- ✨ 金色边框和强调元素
- 🖼️ 电影胶片风格历史记录
- 📰 杂志级排版品质
- 🎯 最小化透明导航栏

---

## 已生成文件

| 文件 | 描述 |
|------|------|
| `version-a-homepage.html` | Version A 首页原型 |
| `version-b-homepage.html` | Version B 首页原型 |
| `midjourney-prompts.md` | Midjourney v6 提示词 |
| `dalle-prompts.md` | DALL-E 3 提示词 |
| `README.md` | 本说明文件 |

---

## 使用方式

### 1. 查看 HTML 原型

```bash
# macOS
open design-assets/version-a-homepage.html
open design-assets/version-b-homepage.html

# Linux
xdg-open design-assets/version-a-homepage.html
xdg-open design-assets/version-b-homepage.html

# Windows
start design-assets/version-a-homepage.html
start design-assets/version-b-homepage.html
```

### 2. 生成高质量图片

复制 `midjourney-prompts.md` 或 `dalle-prompts.md` 中的提示词到对应工具：

```bash
# Midjourney v6
/mimagine prompt: [粘贴提示词] --ar 16:9 --v 6 --style raw

# DALL-E 3
# 直接在 ChatGPT 或 API 中使用
```

### 3. 版本选择建议

| 考虑因素 | 选择 Version A | 选择 Version B |
|----------|---------------|-----------------|
| 目标用户 | 18-30岁年轻用户 | 25-45岁专业用户 |
| 核心场景 | 日常创作、社交分享 | 专业工作、品牌合作 |
| 品牌定位 | 消费级、大众化 | 专业级、高端化 |
| 情感连接 | 亲切、友好 | 信任、专业 |

---

## 设计系统 (来自 ui-ux-pro-max)

### UX 规范

- ✅ 最小触摸目标 44px
- ✅ 所有可点击元素显示 cursor-pointer
- ✅ 150-300ms 微交互动画
- ✅ 仅使用 transform/opacity 实现60fps动画
- ✅ 支持 prefers-reduced-motion
- ✅ 4.5:1 色彩对比度
- ✅ 禁止使用表情符号作为图标
- ✅ 禁止悬停状态导致布局跳动

### 无障碍设计

- 键盘导航时显示可见焦点环
- 所有图片包含 alt 文本
- 表单元素有对应的 label
- 色彩不是唯一的视觉提示

---

## 版本对比

| 维度 | Version A (Modern Beauty) | Version B (Luxury Editorial) |
|------|---------------------------|-------------------------------|
| **色彩氛围** | 温暖、明亮、女性化 | 沉稳、对比、奢华 |
| **字体气质** | 现代、几何、亲和 | 经典、优雅、权威 |
| **交互风格** | 探索性、游戏化 | 效率性、精准化 |
| **信息密度** | 中等，留白多 | 较高，功能集中 |
| **适用场景** | 移动端优先、日常创作 | 桌面端优先、专业工作 |
| **品牌联想** | Instagram、美妆APP | Vogue、奢侈品电商 |

---

## 下一步

1. **预览两个版本** - 在浏览器中打开 HTML 文件
2. **测试响应式** - 检查移动端和平板端视图
3. **生成高保真图片** - 使用提示词生成设计图
4. **用户测试** - 收集目标用户的反馈
5. **最终选择** - 选择版本 A 或 B（或混合方案）

---

**生成时间**: 2026-02-06  
**来源文档**: UI-Prompts.md v3.0  
**设计系统**: ui-ux-pro-max Professional

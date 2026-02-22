"use client";
import React from 'react';

export default function UiPromptsPage() {
  // A lightweight, readable UI Prompts reference extracted from the UI-Prompts.md
  return (
    <main style={{ padding: '2rem' }}>
      <h1 style={{ fontSize: '2rem', marginBottom: 12 }}>UI Prompts 参考</h1>
      <section className="card" style={{ marginBottom: 12 }}>
        <h2 style={{ fontSize: '1.25rem', margin: '0 0 6px' }}>界面 1：首页 - 版本 A</h2>
        <p>视觉风格：Modern Minimalist，主色渐变紫粉，辅助色白/浅灰，强调色橙金。</p>
      </section>
      <section className="card" style={{ marginBottom: 12 }}>
        <h2 style={{ fontSize: '1.25rem', margin: '0 0 6px' }}>界面 1：首页 - 版本 B</h2>
        <p>全屏 Hero 区域，渐变背景，按钮带发光效果，图片示例半透明浮动。</p>
      </section>
      <section className="card" style={{ marginBottom: 12 }}>
        <h2 style={{ fontSize: '1.25rem', margin: '0 0 6px' }}>界面 2：图片上传界面</h2>
        <p>左侧大区域上传，右侧图片网格，支持拖拽、缩略图、删除、排序等交互要点。</p>
      </section>
      <section className="card" style={{ marginBottom: 12 }}>
        <h2 style={{ fontSize: '1.25rem', margin: '0 0 6px' }}>界面 3：AI 生成界面</h2>
        <p>参数分组采用卡片式，左侧参数控制，右侧结果网格，自适应布局。</p>
      </section>
      <section className="card" style={{ marginBottom: 12 }}>
        <h2 style={{ fontSize: '1.25rem', margin: '0 0 6px' }}>界面 4：历史记录界面</h2>
        <p>列表/瀑布流两种布局，提供搜索、筛选、分页、模态详情等交互。</p>
      </section>
      <section className="card" style={{ marginBottom: 12 }}>
        <h2 style={{ fontSize: '1.25rem', margin: '0 0 6px' }}>AI 交互界面提示</h2>
        <p>文本描述生成姿势、智能穿搭推荐等，强调简洁、可读性与响应速度。</p>
      </section>
    </main>
  );
}

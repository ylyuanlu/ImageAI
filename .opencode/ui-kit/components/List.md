# List 列表组件

## 设计概述

**设计哲学**：清晰的数据展示，优雅的交互体验

**核心特征**：
- 简洁的列表项设计
- 丰富的内容支持（图标、标题、描述、操作）
- 悬停和点击反馈
- 支持多种布局模式

## 视觉效果

### 基础样式

```jsx
const List = ({ 
  items,
  renderItem,
  emptyText = '暂无数据',
  loading = false,
  bordered = true,
  hoverable = true,
  size = 'default',
  split = true
}) => {
  if (loading) {
    return (
      <div className={`list list-${size}`}>
        {[1, 2, 3].map(i => (
          <div key={i} className="list-item-skeleton">
            <div className="skeleton-avatar"></div>
            <div className="skeleton-content">
              <div className="skeleton-title"></div>
              <div className="skeleton-desc"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }
  
  if (items.length === 0) {
    return (
      <div className="list-empty">
        <svg className="empty-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
        <span>{emptyText}</span>
      </div>
    );
  }
  
  return (
    <div className={`list list-${size} ${bordered ? 'is-bordered' : ''} ${hoverable ? 'is-hoverable' : ''}`}>
      {items.map((item, index) => (
        <div 
          key={item.id || index}
          className={`list-item ${split && index !== items.length - 1 ? 'has-split' : ''}`}
        >
          {renderItem ? renderItem(item, index) : (
            <div className="list-item-default">
              {item.icon && (
                <div className="list-item-icon" style={{ color: item.iconColor }}>
                  {item.icon}
                </div>
              )}
              <div className="list-item-content">
                <div className="list-item-title">{item.title}</div>
                {item.description && (
                  <div className="list-item-description">{item.description}</div>
                )}
              </div>
              {item.extra && (
                <div className="list-item-extra">{item.extra}</div>
              )}
              {item.action && (
                <div className="list-item-action">{item.action}</div>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};
```

### CSS样式

```css
/* ===== 基础变量 ===== */
.list {
  --list-bg: #FFFFFF;
  --list-border: #E5E7EB;
  --list-border-radius: 8px;
  --list-item-padding: 16px;
  --list-item-gap: 12px;
  --list-transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

/* ===== 容器 ===== */
.list {
  background-color: var(--list-bg);
  width: 100%;
}

.list.is-bordered {
  border: 1px solid var(--list-border);
  border-radius: var(--list-border-radius);
}

/* ===== 列表项 ===== */
.list-item {
  padding: var(--list-item-padding);
  transition: var(--list-transition);
}

.list.is-hoverable .list-item:hover {
  background-color: #F9FAFB;
}

.list-item.has-split {
  border-bottom: 1px solid #F3F4F6;
}

.list.is-bordered .list-item:first-child {
  border-radius: var(--list-border-radius) var(--list-border-radius) 0 0;
}

.list.is-bordered .list-item:last-child {
  border-radius: 0 0 var(--list-border-radius) var(--list-border-radius);
  border-bottom: none;
}

/* ===== 默认列表项布局 ===== */
.list-item-default {
  display: flex;
  align-items: center;
  gap: var(--list-item-gap);
}

/* ===== 图标 ===== */
.list-item-icon {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  background-color: #F3F4F6;
  flex-shrink: 0;
  font-size: 20px;
}

/* ===== 内容区 ===== */
.list-item-content {
  flex: 1;
  min-width: 0;
}

.list-item-title {
  font-size: 14px;
  font-weight: 500;
  color: #111827;
  line-height: 1.5;
  margin-bottom: 2px;
}

.list-item-description {
  font-size: 13px;
  color: #6B7280;
  line-height: 1.5;
}

/* ===== 额外信息 ===== */
.list-item-extra {
  font-size: 13px;
  color: #9CA3AF;
  flex-shrink: 0;
}

/* ===== 操作区 ===== */
.list-item-action {
  flex-shrink: 0;
}

/* ===== 尺寸变体 ===== */
.list-small .list-item {
  --list-item-padding: 12px;
  --list-item-gap: 10px;
}

.list-small .list-item-icon {
  width: 32px;
  height: 32px;
  font-size: 16px;
}

.list-small .list-item-title {
  font-size: 13px;
}

.list-large .list-item {
  --list-item-padding: 20px;
  --list-item-gap: 16px;
}

.list-large .list-item-icon {
  width: 48px;
  height: 48px;
  font-size: 24px;
}

.list-large .list-item-title {
  font-size: 15px;
}

/* ===== 加载骨架屏 ===== */
.list-item-skeleton {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: var(--list-item-padding);
}

.skeleton-avatar {
  width: 40px;
  height: 40px;
  border-radius: 8px;
  background: linear-gradient(90deg, #F3F4F6 25%, #E5E7EB 50%, #F3F4F6 75%);
  background-size: 200% 100%;
  animation: skeleton-loading 1.5s ease-in-out infinite;
}

.skeleton-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.skeleton-title {
  height: 16px;
  width: 60%;
  border-radius: 4px;
  background: linear-gradient(90deg, #F3F4F6 25%, #E5E7EB 50%, #F3F4F6 75%);
  background-size: 200% 100%;
  animation: skeleton-loading 1.5s ease-in-out infinite;
}

.skeleton-desc {
  height: 12px;
  width: 40%;
  border-radius: 4px;
  background: linear-gradient(90deg, #F3F4F6 25%, #E5E7EB 50%, #F3F4F6 75%);
  background-size: 200% 100%;
  animation: skeleton-loading 1.5s ease-in-out infinite;
  animation-delay: 0.2s;
}

@keyframes skeleton-loading {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}

/* ===== 空状态 ===== */
.list-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 48px 24px;
  color: #9CA3AF;
  gap: 12px;
}

.empty-icon {
  width: 48px;
  height: 48px;
  opacity: 0.5;
}

.list-empty span {
  font-size: 14px;
}

/* ===== 暗色模式 ===== */
@media (prefers-color-scheme: dark) {
  .list {
    --list-bg: #1F2937;
    --list-border: #374151;
  }
  
  .list-item-title {
    color: #F9FAFB;
  }
  
  .list-item-description {
    color: #9CA3AF;
  }
  
  .list-item-icon {
    background-color: #374151;
  }
  
  .list.is-hoverable .list-item:hover {
    background-color: #374151;
  }
  
  .list-item.has-split {
    border-color: #374151;
  }
}
```

## 设计亮点

1. **灵活的内容结构**：支持图标、标题、描述、额外信息、操作
2. **优雅的悬停效果**：背景色变化，提升交互感
3. **智能分隔线**：自动处理最后一项的分隔线
4. **骨架屏加载**：优雅的加载状态展示
5. **空状态友好**：清晰的空数据提示

## 使用示例

### 基础使用

```jsx
const items = [
  { id: 1, title: '系统通知', description: '您有一条新消息', icon: <BellIcon /> },
  { id: 2, title: '任务提醒', description: '今天有3个任务待完成', icon: <TaskIcon /> },
  { id: 3, title: '日程安排', description: '下午2点会议', icon: <CalendarIcon /> }
];

<List items={items} />
```

### 带操作按钮

```jsx
<List 
  items={users}
  renderItem={(user) => (
    <div className="user-item">
      <Avatar src={user.avatar} />
      <div className="user-info">
        <div className="user-name">{user.name}</div>
        <div className="user-email">{user.email}</div>
      </div>
      <Button size="small" onClick={() => editUser(user.id)}>
        编辑
      </Button>
    </div>
  )}
/>
```

### 无边框模式

```jsx
<List items={items} bordered={false} split={false} />
```

## 最佳实践

- 列表项建议不超过10个，超出使用分页
- 重要操作放在列表项右侧
- 使用时间戳等辅助信息增强内容
- 考虑移动端触摸区域大小

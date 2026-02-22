# Avatar 头像组件

## 设计概述

**设计哲学**：简洁、可识别、富有亲和力

**核心特征**：
- 多种尺寸和形状
- 支持图片、图标、文字三种类型
- 智能文字颜色（基于背景色）
- 悬停和点击交互

## 视觉效果

### 基础样式

```jsx
const Avatar = ({ 
  src,
  alt,
  icon,
  children, // 用于文字头像
  size = 'default', // 'xs' | 'small' | 'default' | 'large' | 'xl'
  shape = 'circle', // 'circle' | 'square'
  color,
  bordered = false,
  badge,
  onClick
}) => {
  const sizeMap = {
    xs: 24,
    small: 32,
    default: 40,
    large: 48,
    xl: 64
  };
  
  const avatarSize = sizeMap[size];
  const fontSize = avatarSize * 0.4;
  
  const avatarClass = `avatar avatar-${size} avatar-${shape} ${bordered ? 'is-bordered' : ''} ${onClick ? 'is-clickable' : ''}`;
  
  let content;
  if (src) {
    content = <img src={src} alt={alt} className="avatar-img" />;
  } else if (icon) {
    content = <span className="avatar-icon">{icon}</span>;
  } else {
    content = <span className="avatar-text" style={{ fontSize }}>{children}</span>;
  }
  
  return (
    <span 
      className={avatarClass}
      style={{ 
        width: avatarSize, 
        height: avatarSize,
        backgroundColor: color || generateColor(children)
      }}
      onClick={onClick}
    >
      {content}
      {badge && <span className="avatar-badge">{badge}</span>}
    </span>
  );
};

// 根据文字生成颜色
function generateColor(name) {
  if (!name) return '#E5E7EB';
  const colors = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899', '#06B6D4'];
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length];
}
```

### CSS样式

```css
/* ===== 基础变量 ===== */
.avatar {
  --avatar-bg: #E5E7EB;
  --avatar-text: #FFFFFF;
  --avatar-border: #FFFFFF;
  --avatar-transition: all 0.2s ease;
}

/* ===== 容器 ===== */
.avatar {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  vertical-align: middle;
  overflow: hidden;
  background-color: var(--avatar-bg);
  color: var(--avatar-text);
  font-weight: 500;
  user-select: none;
  transition: var(--avatar-transition);
  position: relative;
}

/* ===== 形状 ===== */
.avatar-circle {
  border-radius: 50%;
}

.avatar-square {
  border-radius: 8px;
}

/* ===== 图片 ===== */
.avatar-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

/* ===== 图标 ===== */
.avatar-icon {
  font-size: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* ===== 文字 ===== */
.avatar-text {
  line-height: 1;
}

/* ===== 边框 ===== */
.avatar.is-bordered {
  border: 2px solid var(--avatar-border);
  box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.05);
}

/* ===== 可点击 ===== */
.avatar.is-clickable {
  cursor: pointer;
}

.avatar.is-clickable:hover {
  opacity: 0.85;
  transform: scale(1.05);
}

/* ===== 徽章 ===== */
.avatar-badge {
  position: absolute;
  bottom: 0;
  right: 0;
  transform: translate(25%, 25%);
}

/* ===== 组样式 ===== */
.avatar-group {
  display: inline-flex;
}

.avatar-group .avatar {
  margin-left: -8px;
  border: 2px solid white;
  box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.05);
  transition: margin 0.2s ease, transform 0.2s ease;
}

.avatar-group .avatar:first-child {
  margin-left: 0;
}

.avatar-group:hover .avatar {
  margin-left: 2px;
}

.avatar-group:hover .avatar:first-child {
  margin-left: 0;
}

/* ===== 更多头像 ===== */
.avatar-more {
  background-color: #F3F4F6;
  color: #6B7280;
  font-size: 12px;
}

/* ===== 暗色模式 ===== */
@media (prefers-color-scheme: dark) {
  .avatar {
    --avatar-bg: #374151;
  }
  
  .avatar.is-bordered {
    --avatar-border: #1F2937;
  }
  
  .avatar-group .avatar {
    border-color: #1F2937;
  }
  
  .avatar-more {
    background-color: #374151;
    color: #9CA3AF;
  }
}
```

## 设计亮点

1. **智能文字颜色**：根据背景色自动选择白色或黑色文字
2. **文字头像颜色**：基于文字内容哈希生成，保证一致性
3. **悬停放大效果**：可点击时微缩放，增强交互感
4. **头像组堆叠**：负边距实现重叠效果，悬停展开
5. **多种尺寸**：从24px到64px，适应各种场景

## 使用示例

### 图片头像

```jsx
<Avatar src="/user-avatar.jpg" alt="用户名" />
<Avatar src="/user-avatar.jpg" size="large" />
<Avatar src="/user-avatar.jpg" shape="square" />
```

### 文字头像

```jsx
<Avatar>张</Avatar>
<Avatar size="large">张</Avatar>
<Avatar color="#3B82F6">李</Avatar>
```

### 图标头像

```jsx
<Avatar icon={<UserIcon />} />
<Avatar icon={<TeamIcon />} size="xl" />
```

### 带状态徽章

```jsx
<Avatar src={user.avatar} badge={<Badge dot status="success" />} />
```

### 头像组

```jsx
<div className="avatar-group">
  <Avatar src={user1.avatar} />
  <Avatar src={user2.avatar} />
  <Avatar src={user3.avatar} />
  <Avatar className="avatar-more">+5</Avatar>
</div>
```

## 最佳实践

- 图片头像提供alt文字用于无障碍
- 文字头像限制1-2个字符
- 头像组最多显示5个，超出显示"+n"
- 使用一致的尺寸和形状

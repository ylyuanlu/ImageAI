# DatePicker 日期选择组件

## 设计概述

**设计哲学**：现代、直观的日期选择体验，支持多种交互方式

**核心特征**：
- 清晰的日历网格布局
- 流畅的月份/年份切换
- 范围选择支持
- 快捷选择预设

## 视觉效果

### 基础样式

```jsx
const DatePicker = ({ 
  label,
  value,
  onChange,
  placeholder = '选择日期',
  disabled = false,
  error,
  minDate,
  maxDate,
  showPresets = false
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [viewDate, setViewDate] = useState(value || new Date());
  
  // ... 日历逻辑
  
  return (
    <div className={`datepicker-wrapper ${error ? 'has-error' : ''} ${disabled ? 'is-disabled' : ''}`}>
      {label && <label className="datepicker-label">{label}</label>}
      
      <div className="datepicker-trigger" onClick={() => !disabled && setIsOpen(!isOpen)}>
        <div className="datepicker-input">
          <svg className="datepicker-icon" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
          </svg>
          <span className={value ? 'has-value' : 'placeholder'}>
            {value ? formatDate(value) : placeholder}
          </span>
        </div>
        <svg className="datepicker-arrow" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
        </svg>
      </div>
      
      {isOpen && (
        <div className="datepicker-dropdown">
          <div className="datepicker-header">
            <button onClick={prevMonth} className="datepicker-nav-btn">
              <svg viewBox="0 0 20 20"><path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
            </button>
            <span className="datepicker-month-year">
              {formatMonthYear(viewDate)}
            </span>
            <button onClick={nextMonth} className="datepicker-nav-btn">
              <svg viewBox="0 0 20 20"><path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" /></svg>
            </button>
          </div>
          
          <div className="datepicker-calendar">
            <div className="datepicker-weekdays">
              {['日', '一', '二', '三', '四', '五', '六'].map(day => (
                <div key={day} className="datepicker-weekday">{day}</div>
              ))}
            </div>
            <div className="datepicker-days">
              {calendarDays.map((day, idx) => (
                <button
                  key={idx}
                  className={`datepicker-day ${day.isCurrentMonth ? 'current-month' : 'other-month'} ${day.isSelected ? 'selected' : ''} ${day.isToday ? 'today' : ''} ${day.isDisabled ? 'disabled' : ''}`}
                  onClick={() => handleDateClick(day.date)}
                  disabled={day.isDisabled}
                >
                  {day.dayOfMonth}
                </button>
              ))}
            </div>
          </div>
          
          {showPresets && (
            <div className="datepicker-presets">
              <button onClick={() => selectPreset('today')}>今天</button>
              <button onClick={() => selectPreset('tomorrow')}>明天</button>
              <button onClick={() => selectPreset('next-week')}>一周后</button>
            </div>
          )}
        </div>
      )}
      
      {error && <span className="datepicker-error">{error}</span>}
    </div>
  );
};
```

### CSS样式

```css
/* ===== 基础变量 ===== */
.datepicker-wrapper {
  --datepicker-width: 280px;
  --datepicker-radius: 8px;
  --datepicker-border: #E5E7EB;
  --datepicker-border-focus: #3B82F6;
  --datepicker-bg: #FFFFFF;
  --datepicker-bg-hover: #F9FAFB;
  --datepicker-text: #111827;
  --datepicker-text-placeholder: #9CA3AF;
  --datepicker-error: #EF4444;
  --datepicker-primary: #3B82F6;
  --datepicker-primary-light: #EFF6FF;
  --datepicker-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1);
  --datepicker-shadow-focus: 0 0 0 3px rgba(59, 130, 246, 0.1);
  --datepicker-transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

/* ===== 容器 ===== */
.datepicker-wrapper {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 6px;
  width: 100%;
}

/* ===== 标签 ===== */
.datepicker-label {
  font-size: 14px;
  font-weight: 500;
  color: #374151;
  line-height: 1.5;
}

/* ===== 触发器 ===== */
.datepicker-trigger {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 14px;
  height: 40px;
  background-color: var(--datepicker-bg);
  border: 1.5px solid var(--datepicker-border);
  border-radius: var(--datepicker-radius);
  cursor: pointer;
  transition: var(--datepicker-transition);
}

.datepicker-trigger:hover {
  border-color: #D1D5DB;
  background-color: var(--datepicker-bg-hover);
}

.datepicker-wrapper.is-disabled .datepicker-trigger {
  background-color: #F3F4F6;
  cursor: not-allowed;
  opacity: 0.6;
}

/* ===== 输入框显示区 ===== */
.datepicker-input {
  display: flex;
  align-items: center;
  gap: 8px;
  flex: 1;
}

.datepicker-icon {
  width: 18px;
  height: 18px;
  color: #6B7280;
}

.datepicker-input span {
  font-size: 14px;
  color: var(--datepicker-text);
}

.datepicker-input span.placeholder {
  color: var(--datepicker-text-placeholder);
}

/* ===== 下拉箭头 ===== */
.datepicker-arrow {
  width: 18px;
  height: 18px;
  color: #6B7280;
  transition: transform 0.2s ease;
}

.datepicker-wrapper.is-open .datepicker-arrow {
  transform: rotate(180deg);
}

/* ===== 下拉面板 ===== */
.datepicker-dropdown {
  position: absolute;
  top: calc(100% + 8px);
  left: 0;
  width: var(--datepicker-width);
  background-color: var(--datepicker-bg);
  border: 1px solid #E5E7EB;
  border-radius: 12px;
  box-shadow: var(--datepicker-shadow);
  z-index: 1000;
  overflow: hidden;
  animation: datepicker-slide-in 0.2s ease;
}

@keyframes datepicker-slide-in {
  from {
    opacity: 0;
    transform: translateY(-8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* ===== 头部导航 ===== */
.datepicker-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  border-bottom: 1px solid #F3F4F6;
}

.datepicker-nav-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border: none;
  background: transparent;
  color: #6B7280;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.15s ease;
}

.datepicker-nav-btn:hover {
  background-color: #F3F4F6;
  color: #374151;
}

.datepicker-nav-btn svg {
  width: 16px;
  height: 16px;
}

.datepicker-month-year {
  font-size: 14px;
  font-weight: 600;
  color: #111827;
}

/* ===== 日历网格 ===== */
.datepicker-calendar {
  padding: 12px;
}

.datepicker-weekdays {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 4px;
  margin-bottom: 8px;
}

.datepicker-weekday {
  text-align: center;
  font-size: 12px;
  font-weight: 500;
  color: #6B7280;
  padding: 6px 0;
}

.datepicker-days {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 4px;
}

/* ===== 日期按钮 ===== */
.datepicker-day {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  font-size: 13px;
  border: none;
  background: transparent;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.15s ease;
  color: #374151;
}

.datepicker-day:hover:not(.disabled) {
  background-color: #F3F4F6;
}

.datepicker-day.other-month {
  color: #D1D5DB;
}

.datepicker-day.today {
  font-weight: 600;
  color: var(--datepicker-primary);
}

.datepicker-day.selected {
  background-color: var(--datepicker-primary);
  color: white;
  font-weight: 500;
}

.datepicker-day.selected:hover {
  background-color: #2563EB;
}

.datepicker-day.disabled {
  color: #D1D5DB;
  cursor: not-allowed;
}

/* ===== 快捷预设 ===== */
.datepicker-presets {
  display: flex;
  gap: 8px;
  padding: 12px 16px;
  border-top: 1px solid #F3F4F6;
  background-color: #F9FAFB;
}

.datepicker-presets button {
  padding: 6px 12px;
  font-size: 12px;
  font-weight: 500;
  color: #374151;
  background-color: white;
  border: 1px solid #E5E7EB;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.15s ease;
}

.datepicker-presets button:hover {
  background-color: #F3F4F6;
  border-color: #D1D5DB;
}

/* ===== 错误状态 ===== */
.datepicker-wrapper.has-error .datepicker-trigger {
  border-color: var(--datepicker-error);
}

.datepicker-wrapper.has-error .datepicker-trigger:focus-within {
  box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
}

.datepicker-error {
  font-size: 12px;
  color: var(--datepicker-error);
  margin-top: 4px;
}

/* ===== 暗色模式 ===== */
@media (prefers-color-scheme: dark) {
  .datepicker-wrapper {
    --datepicker-border: #374151;
    --datepicker-bg: #1F2937;
    --datepicker-bg-hover: #374151;
    --datepicker-text: #F9FAFB;
    --datepicker-text-placeholder: #6B7280;
    --datepicker-primary-light: rgba(59, 130, 246, 0.2);
  }
  
  .datepicker-dropdown {
    background-color: #1F2937;
    border-color: #374151;
  }
  
  .datepicker-header {
    border-color: #374151;
  }
  
  .datepicker-day.other-month {
    color: #4B5563;
  }
  
  .datepicker-presets {
    background-color: #374151;
    border-color: #4B5563;
  }
  
  .datepicker-presets button {
    background-color: #1F2937;
    border-color: #4B5563;
    color: #E5E7EB;
  }
}
```

## 设计亮点

1. **优雅的日历动画**：下拉面板滑入效果
2. **清晰的视觉层次**：头部导航、星期标题、日期网格分明
3. **今日高亮**：特殊颜色标识今天日期
4. **快捷预设**：常用日期一键选择
5. **圆角卡片设计**：12px圆角，现代感十足

## 使用示例

### 基础使用

```jsx
<DatePicker
  label="选择日期"
  placeholder="请选择"
  value={date}
  onChange={setDate}
/>
```

### 带快捷预设

```jsx
<DatePicker
  label="预约日期"
  value={appointmentDate}
  onChange={setAppointmentDate}
  showPresets
  minDate={new Date()}
/>
```

### 日期范围限制

```jsx
<DatePicker
  label="出生日期"
  value={birthDate}
  onChange={setBirthDate}
  maxDate={new Date()}
  minDate={new Date('1900-01-01')}
/>
```

## 最佳实践

- 使用minDate/maxDate限制可选范围
- 表单中使用label明确说明
- 快捷预设根据场景自定义
- 考虑移动端触摸区域大小

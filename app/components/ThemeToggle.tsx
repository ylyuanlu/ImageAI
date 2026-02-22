"use client";
import React from 'react';
import { useTheme } from './ThemeProvider';

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  return (
    <button
      onClick={toggleTheme}
      aria-label="切换主题"
      style={{ 
        marginLeft: 'auto', 
        padding: '8px 12px', 
        borderRadius: 8, 
        border: `1px solid ${theme === 'dark' ? '#2b3240' : '#e5e7eb'}`, 
        backgroundColor: theme === 'dark' ? '#1f2a3a' : 'white', 
        color: theme === 'dark' ? '#e5e7eb' : '#1E293B', 
        cursor: 'pointer',
        fontWeight: 500
      }}
    >
      {theme === 'light' ? '🌙 暗黑模式' : '☀️ 亮色模式'}
    </button>
  );
}

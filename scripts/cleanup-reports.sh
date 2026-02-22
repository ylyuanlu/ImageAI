#!/bin/bash

# AI报告文件清理脚本
# 用法: ./scripts/cleanup-reports.sh [days]
# 默认清理7天前的报告文件

DAYS=${1:-7}
PROJECT_ROOT="$(cd "$(dirname "$0")/.." && pwd)"

echo "🧹 清理AI报告文件"
echo "================================"
echo "清理标准: ${DAYS}天前的报告文件"
echo ""

# 统计当前报告文件数量
REPORT_COUNT=$(find "$PROJECT_ROOT" -maxdepth 1 -name "*-REPORT*.md" -o -name "*-ANALYSIS*.md" -o -name "*-CHECK*.md" 2>/dev/null | wc -l)
echo "当前报告文件数量: $REPORT_COUNT"
echo ""

# 查找并删除旧报告
echo "正在查找 ${DAYS}天前的报告文件..."
OLD_REPORTS=$(find "$PROJECT_ROOT" -maxdepth 1 -mtime +$DAYS \( \
    -name "*-REPORT*.md" -o \
    -name "*-ANALYSIS*.md" -o \
    -name "*-CHECK*.md" -o \
    -name "COMPARISON-*.md" -o \
    -name "CLEANUP-*.md" -o \
    -name "BUGFIX-*.md" -o \
    -name "FIX-*.md" \
\) 2>/dev/null)

if [ -z "$OLD_REPORTS" ]; then
    echo "✅ 没有需要清理的旧报告文件"
else
    echo "找到以下旧报告文件:"
    echo "$OLD_REPORTS" | while read file; do
        echo "  - $(basename "$file")"
    done
    echo ""
    
    # 删除旧报告
    echo "$OLD_REPORTS" | while read file; do
        rm "$file"
        echo "  ✅ 已删除: $(basename "$file")"
    done
fi

echo ""
echo "================================"
echo "🎉 清理完成!"
echo ""
echo "💡 提示: 以下核心文档不会被清理:"
echo "  - Product-Spec.md (产品规格)"
echo "  - CHANGELOG.md (变更记录)"
echo "  - Project-Memory.md (项目记忆)"
echo "  - UI-Prompts.md (UI设计)"
echo ""

/**
 * 本地历史记录管理
 * 用于未登录用户临时保存生成记录
 */

const LOCAL_HISTORY_KEY = 'ai_fitting_local_history';
const MAX_LOCAL_HISTORY = 50; // 最多保存50条

export interface LocalHistoryItem {
  id: string;
  createdAt: string;
  modelImage: string;
  outfitImages: string[];
  generatedImages: string[];
  pose: string;
  style: string;
  lighting: string;
  background: string;
  time?: string; // 生成耗时（秒）
}

/**
 * 获取本地历史记录
 */
export function getLocalHistory(): LocalHistoryItem[] {
  if (typeof window === 'undefined') return [];
  
  try {
    const data = localStorage.getItem(LOCAL_HISTORY_KEY);
    if (data) {
      return JSON.parse(data);
    }
  } catch (e) {
    console.error('读取本地历史记录失败:', e);
  }
  return [];
}

/**
 * 保存到本地历史记录
 */
export function saveToLocalHistory(item: Omit<LocalHistoryItem, 'id' | 'createdAt'>): LocalHistoryItem {
  const history = getLocalHistory();
  
  const newItem: LocalHistoryItem = {
    ...item,
    id: `local_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    createdAt: new Date().toISOString(),
  };
  
  // 添加到开头
  history.unshift(newItem);
  
  // 限制数量
  if (history.length > MAX_LOCAL_HISTORY) {
    history.pop();
  }
  
  try {
    localStorage.setItem(LOCAL_HISTORY_KEY, JSON.stringify(history));
  } catch (e) {
    console.error('保存本地历史记录失败:', e);
    // 如果存储失败（可能是空间不足），清除一些旧记录
    if (history.length > 10) {
      history.splice(10);
      localStorage.setItem(LOCAL_HISTORY_KEY, JSON.stringify(history));
    }
  }
  
  return newItem;
}

/**
 * 删除本地历史记录
 */
export function deleteLocalHistory(id: string): boolean {
  const history = getLocalHistory();
  const index = history.findIndex(item => item.id === id);
  
  if (index > -1) {
    history.splice(index, 1);
    localStorage.setItem(LOCAL_HISTORY_KEY, JSON.stringify(history));
    return true;
  }
  return false;
}

/**
 * 清空本地历史记录
 */
export function clearLocalHistory(): void {
  localStorage.removeItem(LOCAL_HISTORY_KEY);
}

/**
 * 将本地历史记录合并到服务器历史（登录后使用）
 */
export async function mergeLocalHistoryToServer(): Promise<boolean> {
  const localHistory = getLocalHistory();
  
  if (localHistory.length === 0) return true;
  
  try {
    // 逐条上传到服务器
    for (const item of localHistory) {
      await fetch('/api/history', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          modelImage: item.modelImage,
          outfitImages: item.outfitImages,
          pose: item.pose,
          style: item.style,
          lighting: item.lighting,
          background: item.background,
          count: item.generatedImages.length,
          generatedImages: item.generatedImages,
        }),
      });
    }
    
    // 上传成功后清空本地记录
    clearLocalHistory();
    return true;
  } catch (error) {
    console.error('合并本地历史记录失败:', error);
    return false;
  }
}

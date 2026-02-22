/**
 * 共享姿势数据
 * 用于上传页面和姿势库页面
 */

export interface Pose {
  id: string;
  name: string;
  image: string;
  category: string;
  description?: string;
  tags?: string[];
  difficulty?: 'easy' | 'medium' | 'hard';
  icon?: string;
}

// 姿势分类映射（用于姿势库页面）
export const categoryMapping: Record<string, string> = {
  'standing': '站姿',
  'sitting': '坐姿',
  'walking': '行走',
  'dynamic': '动态',
  'leaning': '倚靠'
};

// 统一的姿势数据
export const poses: Pose[] = [
  // 站姿类
  { 
    id: 'standing-front', 
    name: '正面站立', 
    image: '/poses/standing-front.png',
    category: 'standing',
    description: '双脚并拢或略微分开，正面朝向镜头，双手自然下垂或交叉',
    tags: ['正式', '标准', '电商'],
    difficulty: 'easy',
    icon: '🧍‍♀️'
  },
  { 
    id: 'standing-45', 
    name: '侧身45°', 
    image: '/poses/standing-45.png',
    category: 'standing',
    description: '身体侧转45度，重心放在一条腿上，更显瘦',
    tags: ['显瘦', '常用', '时尚'],
    difficulty: 'easy',
    icon: '🔄'
  },
  { 
    id: 'standing-side', 
    name: '侧面站立', 
    image: '/poses/standing-side.png',
    category: 'standing',
    description: '完全侧身，展示服装侧面线条',
    tags: ['侧面', '线条', '展示'],
    difficulty: 'easy',
    icon: '👤'
  },
  { 
    id: 'standing-cross-legs', 
    name: '双腿交叉', 
    image: '/poses/standing-cross-legs.png',
    category: 'standing',
    description: '双腿交叉站立，优雅大方',
    tags: ['优雅', '女性', '正式'],
    difficulty: 'medium',
    icon: '交叉'
  },
  
  // 坐姿类
  { 
    id: 'sitting-front', 
    name: '正面坐姿', 
    image: '/poses/sitting-front.png',
    category: 'sitting',
    description: '正面坐姿，双腿并拢或自然分开',
    tags: ['正式', '商务', '端庄'],
    difficulty: 'easy',
    icon: '🧘‍♀️'
  },
  { 
    id: 'sitting-cross-legs', 
    name: '翘腿坐姿', 
    image: '/poses/sitting-cross-legs.png',
    category: 'sitting',
    description: '翘起二郎腿，展现休闲或商务休闲风格',
    tags: ['休闲', '商务', '时尚'],
    difficulty: 'easy',
    icon: '翘腿'
  },
  { 
    id: 'sitting-side', 
    name: '侧身坐姿', 
    image: '/poses/sitting-side.png',
    category: 'sitting',
    description: '侧身坐姿，展现优雅曲线',
    tags: ['优雅', '女性', '艺术'],
    difficulty: 'medium',
    icon: '侧坐'
  },
  
  // 行走类
  { 
    id: 'walking-front', 
    name: '正面行走', 
    image: '/poses/walking-front.png',
    category: 'walking',
    description: '正面朝向镜头行走，展现动态感',
    tags: ['动态', '街拍', '活力'],
    difficulty: 'medium',
    icon: '🚶‍♀️'
  },
  { 
    id: 'walking-side', 
    name: '侧面行走', 
    image: '/poses/walking-side.png',
    category: 'walking',
    description: '侧面行走，展现服装飘逸感',
    tags: ['飘逸', '动态', '时尚'],
    difficulty: 'medium',
    icon: '侧走'
  },
  { 
    id: 'walking-back', 
    name: '背影行走', 
    image: '/poses/walking-back.png',
    category: 'walking',
    description: '背对镜头行走，神秘感十足',
    tags: ['神秘', '艺术', '氛围'],
    difficulty: 'easy',
    icon: '背影'
  },
  
  // 动态类
  { 
    id: 'dynamic-turn', 
    name: '回眸转身', 
    image: '/poses/dynamic-turn.png',
    category: 'dynamic',
    description: '转身回眸，展现动态美感',
    tags: ['动态', '优雅', '电影感'],
    difficulty: 'hard',
    icon: '转身'
  },
  { 
    id: 'dynamic-hair', 
    name: '甩发', 
    image: '/poses/dynamic-hair.png',
    category: 'dynamic',
    description: '甩动头发，展现活力',
    tags: ['活力', '青春', '动感'],
    difficulty: 'hard',
    icon: '甩发'
  },
  
  // 倚靠类
  { 
    id: 'leaning-wall', 
    name: '靠墙站立', 
    image: '/poses/leaning-wall.png',
    category: 'leaning',
    description: '身体倚靠在墙上，休闲自然',
    tags: ['休闲', '街头', '随性'],
    difficulty: 'easy',
    icon: '靠墙'
  },
  { 
    id: 'leaning-hand', 
    name: '手撑姿势', 
    image: '/poses/leaning-hand.png',
    category: 'leaning',
    description: '单手或双手支撑，展现力量感',
    tags: ['力量', '酷', '街头'],
    difficulty: 'medium',
    icon: '手撑'
  },
];

// 姿势分类标签
export const poseCategories = [
  { id: 'all', name: '全部' },
  { id: 'standing', name: '站姿' },
  { id: 'sitting', name: '坐姿' },
  { id: 'walking', name: '行走' },
  { id: 'dynamic', name: '动态' },
  { id: 'leaning', name: '倚靠' },
];

// 难度标签映射
export const difficultyLabels: Record<string, string> = {
  easy: '简单',
  medium: '中等',
  hard: '困难',
};

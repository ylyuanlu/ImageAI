/**
 * 生成姿势线稿示意图脚本
 * 使用通义万相 API 生成统一的线稿风格姿势参考图
 */

import fetch from 'node-fetch';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// 获取当前文件路径（ES Module 兼容）
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 姿势列表
const poses = [
  {
    id: 'standing-front',
    name: '正面站立',
    prompt: 'A fashion model standing front-facing pose, full body, simple line drawing, minimalist sketch style, white background, clean lines, fashion illustration, professional pose reference, black and white line art'
  },
  {
    id: 'standing-45',
    name: '侧身45°',
    prompt: 'A fashion model standing in 45-degree angle pose, three-quarter view, full body, simple line drawing, minimalist sketch style, white background, clean lines, fashion illustration, professional pose reference, black and white line art'
  },
  {
    id: 'standing-side',
    name: '侧面站立',
    prompt: 'A fashion model standing in side profile pose, full body side view, simple line drawing, minimalist sketch style, white background, clean lines, fashion illustration, professional pose reference, black and white line art'
  },
  {
    id: 'standing-cross-legs',
    name: '双腿交叉',
    prompt: 'A fashion model standing with crossed legs pose, elegant stance, full body, simple line drawing, minimalist sketch style, white background, clean lines, fashion illustration, professional pose reference, black and white line art'
  },
  {
    id: 'sitting-front',
    name: '正面坐姿',
    prompt: 'A fashion model sitting front-facing pose, full body seated position, simple line drawing, minimalist sketch style, white background, clean lines, fashion illustration, professional pose reference, black and white line art'
  },
  {
    id: 'sitting-cross-legs',
    name: '翘腿坐姿',
    prompt: 'A fashion model sitting with crossed legs pose, relaxed seated position, full body, simple line drawing, minimalist sketch style, white background, clean lines, fashion illustration, professional pose reference, black and white line art'
  },
  {
    id: 'sitting-side',
    name: '侧身坐姿',
    prompt: 'A fashion model sitting in side profile pose, elegant seated position, full body side view, simple line drawing, minimalist sketch style, white background, clean lines, fashion illustration, professional pose reference, black and white line art'
  },
  {
    id: 'walking-front',
    name: '正面行走',
    prompt: 'A fashion model walking front-facing pose, dynamic walking stance, full body, simple line drawing, minimalist sketch style, white background, clean lines, fashion illustration, professional pose reference, black and white line art'
  },
  {
    id: 'walking-side',
    name: '侧面行走',
    prompt: 'A fashion model walking in side profile pose, dynamic walking stance, full body side view, simple line drawing, minimalist sketch style, white background, clean lines, fashion illustration, professional pose reference, black and white line art'
  },
  {
    id: 'walking-back',
    name: '背影行走',
    prompt: 'A fashion model walking away from camera, back view pose, dynamic walking stance, full body back view, simple line drawing, minimalist sketch style, white background, clean lines, fashion illustration, professional pose reference, black and white line art'
  },
  {
    id: 'dynamic-turn',
    name: '回眸转身',
    prompt: 'A fashion model in turning pose with looking back, dynamic elegant movement, full body, simple line drawing, minimalist sketch style, white background, clean lines, fashion illustration, professional pose reference, black and white line art'
  },
  {
    id: 'dynamic-hair',
    name: '甩发',
    prompt: 'A fashion model with hair flowing in motion pose, dynamic movement, full body, simple line drawing, minimalist sketch style, white background, clean lines, fashion illustration, professional pose reference, black and white line art'
  },
  {
    id: 'leaning-wall',
    name: '靠墙站立',
    prompt: 'A fashion model leaning against wall pose, casual relaxed stance, full body, simple line drawing, minimalist sketch style, white background, clean lines, fashion illustration, professional pose reference, black and white line art'
  },
  {
    id: 'leaning-hand',
    name: '手撑姿势',
    prompt: 'A fashion model leaning on hand pose, confident stance, full body, simple line drawing, minimalist sketch style, white background, clean lines, fashion illustration, professional pose reference, black and white line art'
  }
];

// API 配置
const API_KEY = process.env.TONGYI_API_KEY || 'sk-777a9155d80a4703aa169c7f41947dcd';
const API_URL = 'https://dashscope.aliyuncs.com/api/v1/services/aigc/text2image/image-synthesis';

// 生成单张图片
async function generatePoseImage(pose: typeof poses[0], index: number): Promise<void> {
  console.log(`[${index + 1}/${poses.length}] 生成姿势: ${pose.name}`);
  
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`,
        'X-DashScope-Async': 'enable'
      },
      body: JSON.stringify({
        model: 'wanx-v1',
        input: {
          prompt: pose.prompt,
          negative_prompt: 'color, realistic, photograph, 3d render, complex background, messy lines, blurry, low quality'
        },
        parameters: {
          size: '1024*1024',
          n: 1,
          style: '<sketch>' // 线稿风格
        }
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API 请求失败: ${response.status} - ${errorText}`);
    }

    const data = await response.json() as any;
    
    if (data.output && data.output.task_id) {
      console.log(`  - 任务已提交，ID: ${data.output.task_id}`);
      console.log(`  - 请通过任务 ID 查询结果`);
      
      // 保存任务信息
      const taskInfo = {
        poseId: pose.id,
        poseName: pose.name,
        taskId: data.output.task_id,
        status: 'pending',
        createdAt: new Date().toISOString()
      };
      
      const tasksDir = path.join(__dirname, '..', 'public', 'poses', 'tasks');
      if (!fs.existsSync(tasksDir)) {
        fs.mkdirSync(tasksDir, { recursive: true });
      }
      
      fs.writeFileSync(
        path.join(tasksDir, `${pose.id}.json`),
        JSON.stringify(taskInfo, null, 2)
      );
      
      return;
    } else {
      throw new Error('API 返回数据格式不正确');
    }
  } catch (error) {
    console.error(`  - 生成失败: ${error}`);
    throw error;
  }
}

// 主函数
async function main() {
  console.log('========================================');
  console.log('开始生成姿势线稿示意图');
  console.log(`共 ${poses.length} 个姿势`);
  console.log('========================================\n');
  
  // 创建输出目录
  const outputDir = path.join(__dirname, '..', 'public', 'poses');
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }
  
  // 逐个提交，避免并发过高导致限流
  for (let i = 0; i < poses.length; i++) {
    const pose = poses[i];
    console.log(`\n[${i + 1}/${poses.length}] ${pose.name}`);
    
    try {
      await generatePoseImage(pose, i);
      
      // 每个任务间等待 3 秒（避免限流）
      if (i < poses.length - 1) {
        console.log('等待 3 秒...');
        await new Promise(resolve => setTimeout(resolve, 3000));
      }
    } catch (error) {
      console.error(`  - 生成失败，跳过: ${error}`);
      // 失败后等待更长时间
      if (i < poses.length - 1) {
        console.log('等待 10 秒后重试...');
        await new Promise(resolve => setTimeout(resolve, 10000));
      }
    }
  }
  
  console.log('\n========================================');
  console.log('所有姿势生成任务已提交');
  console.log('任务信息保存在: public/poses/tasks/');
  console.log('请稍后运行查询脚本获取结果');
  console.log('========================================');
}

// 运行
main().catch(console.error);

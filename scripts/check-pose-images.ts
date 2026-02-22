/**
 * 查询姿势图片生成结果
 * 获取通义万相生成的线稿图并下载
 */

import fetch from 'node-fetch';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// 获取当前文件路径（ES Module 兼容）
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const API_KEY = process.env.TONGYI_API_KEY || 'sk-777a9155d80a4703aa169c7f41947dcd';
const TASKS_DIR = path.join(__dirname, '..', 'public', 'poses', 'tasks');
const OUTPUT_DIR = path.join(__dirname, '..', 'public', 'poses');

interface TaskInfo {
  poseId: string;
  poseName: string;
  taskId: string;
  status: string;
  createdAt: string;
  imageUrl?: string;
}

// 查询任务状态
async function checkTaskStatus(taskId: string): Promise<any> {
  const response = await fetch(
    `https://dashscope.aliyuncs.com/api/v1/tasks/${taskId}`,
    {
      headers: {
        'Authorization': `Bearer ${API_KEY}`
      }
    }
  );

  if (!response.ok) {
    throw new Error(`查询失败: ${response.status}`);
  }

  return response.json();
}

// 下载图片
async function downloadImage(url: string, outputPath: string): Promise<void> {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`下载失败: ${response.status}`);
  }

  const buffer = await response.buffer();
  fs.writeFileSync(outputPath, buffer);
}

// 主函数
async function main() {
  console.log('========================================');
  console.log('查询姿势图片生成结果');
  console.log('========================================\n');

  // 读取所有任务
  if (!fs.existsSync(TASKS_DIR)) {
    console.log('没有待查询的任务');
    return;
  }

  const taskFiles = fs.readdirSync(TASKS_DIR).filter(f => f.endsWith('.json'));
  
  if (taskFiles.length === 0) {
    console.log('没有待查询的任务');
    return;
  }

  console.log(`找到 ${taskFiles.length} 个任务\n`);

  // 确保输出目录存在
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  // 查询每个任务
  for (const taskFile of taskFiles) {
    const taskPath = path.join(TASKS_DIR, taskFile);
    const taskInfo: TaskInfo = JSON.parse(fs.readFileSync(taskPath, 'utf-8'));

    console.log(`[${taskInfo.poseName}]`);
    console.log(`  任务ID: ${taskInfo.taskId}`);

    try {
      const result = await checkTaskStatus(taskInfo.taskId);
      
      if (result.output && result.output.task_status === 'SUCCEEDED') {
        // 任务成功
        const imageUrl = result.output.results?.[0]?.url;
        
        if (imageUrl) {
          console.log(`  状态: ✅ 成功`);
          console.log(`  图片URL: ${imageUrl.substring(0, 60)}...`);
          
          // 下载图片
          const outputPath = path.join(OUTPUT_DIR, `${taskInfo.poseId}.png`);
          await downloadImage(imageUrl, outputPath);
          console.log(`  已保存: ${outputPath}`);
          
          // 更新任务状态
          taskInfo.status = 'completed';
          taskInfo.imageUrl = imageUrl;
          fs.writeFileSync(taskPath, JSON.stringify(taskInfo, null, 2));
        }
      } else if (result.output && result.output.task_status === 'FAILED') {
        console.log(`  状态: ❌ 失败`);
        console.log(`  错误: ${result.output.message || '未知错误'}`);
        
        taskInfo.status = 'failed';
        fs.writeFileSync(taskPath, JSON.stringify(taskInfo, null, 2));
      } else {
        console.log(`  状态: ⏳ ${result.output?.task_status || '处理中'}`);
      }
    } catch (error) {
      console.log(`  状态: ❌ 查询失败 - ${error}`);
    }

    console.log('');
  }

  console.log('========================================');
  console.log('查询完成');
  console.log('========================================');
}

// 运行
main().catch(console.error);

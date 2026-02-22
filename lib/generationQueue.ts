/**
 * 图片生成队列管理器
 * 用于管理批量生成任务，支持并发控制和队列管理
 */

import { EventEmitter } from 'events';

// 生成任务状态
export type GenerationStatus = 'pending' | 'processing' | 'completed' | 'failed';

// 生成任务
export interface GenerationTask {
  id: string;
  modelImage: string;
  outfitImage: string;
  pose: string;
  style: string;
  lighting: string;
  background: string;
  colorTone: string;
  status: GenerationStatus;
  progress: number;
  result?: string;
  error?: string;
  createdAt: Date;
  startedAt?: Date;
  completedAt?: Date;
}

// 队列配置
export interface QueueConfig {
  maxConcurrency: number; // 最大并发数
  retryAttempts: number;  // 重试次数
  retryDelay: number;     // 重试延迟（毫秒）
}

// 默认配置
const DEFAULT_CONFIG: QueueConfig = {
  maxConcurrency: 2,  // 最多同时生成2张
  retryAttempts: 3,   // 失败重试3次
  retryDelay: 2000    // 2秒后重试
};

/**
 * 生成队列管理器
 */
export class GenerationQueue extends EventEmitter {
  private queue: GenerationTask[] = [];
  private processing: Map<string, GenerationTask> = new Map();
  private config: QueueConfig;
  private isRunning = false;

  constructor(config: Partial<QueueConfig> = {}) {
    super();
    this.config = { ...DEFAULT_CONFIG, ...config };
  }

  /**
   * 添加任务到队列
   */
  addTask(params: Omit<GenerationTask, 'id' | 'status' | 'progress' | 'createdAt'>): GenerationTask {
    const task: GenerationTask = {
      ...params,
      id: this.generateId(),
      status: 'pending',
      progress: 0,
      createdAt: new Date()
    };

    this.queue.push(task);
    this.emit('taskAdded', task);
    this.emit('queueUpdate', this.getQueueStatus());

    // 自动开始处理
    if (!this.isRunning) {
      this.start();
    }

    return task;
  }

  /**
   * 批量添加任务
   */
  addBatch(paramsList: Omit<GenerationTask, 'id' | 'status' | 'progress' | 'createdAt'>[]): GenerationTask[] {
    return paramsList.map(params => this.addTask(params));
  }

  /**
   * 开始处理队列
   */
  start(): void {
    if (this.isRunning) return;
    this.isRunning = true;
    this.emit('started');
    this.processQueue();
  }

  /**
   * 停止处理队列
   */
  stop(): void {
    this.isRunning = false;
    this.emit('stopped');
  }

  /**
   * 处理队列
   */
  private async processQueue(): Promise<void> {
    while (this.isRunning) {
      // 检查并发限制
      if (this.processing.size >= this.config.maxConcurrency) {
        await this.delay(100);
        continue;
      }

      // 获取下一个任务
      const task = this.queue.shift();
      if (!task) {
        // 队列为空，检查是否还有处理中的任务
        if (this.processing.size === 0) {
          this.emit('completed');
        }
        await this.delay(100);
        continue;
      }

      // 开始处理任务
      this.processTask(task);
    }
  }

  /**
   * 处理单个任务
   */
  private async processTask(task: GenerationTask): Promise<void> {
    task.status = 'processing';
    task.startedAt = new Date();
    task.progress = 0;
    this.processing.set(task.id, task);

    this.emit('taskStarted', task);
    this.emit('queueUpdate', this.getQueueStatus());

    let attempts = 0;
    let lastError: string | undefined;

    while (attempts < this.config.retryAttempts) {
      try {
        // 模拟进度更新
        const progressInterval = setInterval(() => {
          if (task.progress < 90) {
            task.progress += Math.random() * 10;
            this.emit('taskProgress', task);
          }
        }, 500);

        // 调用生成 API
        const result = await this.callGenerationAPI(task);

        clearInterval(progressInterval);

        // 任务完成
        task.status = 'completed';
        task.progress = 100;
        task.result = result;
        task.completedAt = new Date();

        this.processing.delete(task.id);
        this.emit('taskCompleted', task);
        this.emit('queueUpdate', this.getQueueStatus());
        return;

      } catch (error: any) {
        attempts++;
        lastError = error.message || '生成失败';

        if (attempts < this.config.retryAttempts) {
          // 更新进度为等待重试状态
          task.progress = 0;
          this.emit('taskRetry', { task, attempt: attempts, maxAttempts: this.config.retryAttempts });
          await this.delay(this.config.retryDelay);
        }
      }
    }

    // 所有重试都失败
    task.status = 'failed';
    task.error = lastError;
    task.completedAt = new Date();

    this.processing.delete(task.id);
    this.emit('taskFailed', task);
    this.emit('queueUpdate', this.getQueueStatus());
  }

  /**
   * 调用生成 API
   */
  private async callGenerationAPI(task: GenerationTask): Promise<string> {
    const response = await fetch('/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        modelImage: task.modelImage,
        outfitImage: task.outfitImage,
        pose: task.pose,
        style: task.style,
        lighting: task.lighting,
        background: task.background,
        colorTone: task.colorTone
      })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || '生成请求失败');
    }

    const data = await response.json();

    if (data.status !== 'success') {
      throw new Error(data.message || '生成失败');
    }

    return data.url;
  }

  /**
   * 取消任务
   */
  cancelTask(taskId: string): boolean {
    // 检查是否在队列中
    const queueIndex = this.queue.findIndex(t => t.id === taskId);
    if (queueIndex !== -1) {
      const task = this.queue.splice(queueIndex, 1)[0];
      task.status = 'failed';
      task.error = '用户取消';
      this.emit('taskCancelled', task);
      this.emit('queueUpdate', this.getQueueStatus());
      return true;
    }

    // 检查是否正在处理中
    const processingTask = this.processing.get(taskId);
    if (processingTask) {
      // 注意：这里只能标记为取消，实际请求可能仍在进行
      processingTask.status = 'failed';
      processingTask.error = '用户取消';
      this.processing.delete(taskId);
      this.emit('taskCancelled', processingTask);
      this.emit('queueUpdate', this.getQueueStatus());
      return true;
    }

    return false;
  }

  /**
   * 清空队列
   */
  clearQueue(): void {
    // 取消所有等待中的任务
    this.queue.forEach(task => {
      task.status = 'failed';
      task.error = '队列被清空';
      this.emit('taskCancelled', task);
    });

    this.queue = [];
    this.emit('queueUpdate', this.getQueueStatus());
  }

  /**
   * 获取队列状态
   */
  getQueueStatus() {
    return {
      pending: this.queue.length,
      processing: this.processing.size,
      total: this.queue.length + this.processing.size,
      isRunning: this.isRunning
    };
  }

  /**
   * 获取所有任务
   */
  getAllTasks(): GenerationTask[] {
    return [
      ...Array.from(this.processing.values()),
      ...this.queue
    ];
  }

  /**
   * 获取任务详情
   */
  getTask(taskId: string): GenerationTask | undefined {
    return this.processing.get(taskId) || this.queue.find(t => t.id === taskId);
  }

  /**
   * 延迟函数
   */
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * 生成唯一ID
   */
  private generateId(): string {
    return `task_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}

// 导出单例实例
let globalQueue: GenerationQueue | null = null;

export function getGenerationQueue(): GenerationQueue {
  if (!globalQueue) {
    globalQueue = new GenerationQueue();
  }
  return globalQueue;
}

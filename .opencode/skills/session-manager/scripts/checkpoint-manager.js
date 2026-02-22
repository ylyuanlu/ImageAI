#!/usr/bin/env node

/**
 * Checkpoint Manager - 会话检查点管理器
 * 
 * 统一管理检查点的保存、恢复、列表和删除
 * 
 * 用法:
 *   node checkpoint-manager.js save [name] [description]    # 保存检查点
 *   node checkpoint-manager.js restore [name]               # 恢复检查点
 *   node checkpoint-manager.js list                          # 列出所有检查点
 *   node checkpoint-manager.js delete [name]                # 删除检查点
 *   node checkpoint-manager.js info [name]                  # 查看检查点详情
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const CHECKPOINT_DIR = '.opencode/checkpoints';

/**
 * 确保检查点目录存在
 */
function ensureCheckpointDir() {
  if (!fs.existsSync(CHECKPOINT_DIR)) {
    fs.mkdirSync(CHECKPOINT_DIR, { recursive: true });
  }
}

/**
 * 保存检查点
 */
function saveCheckpoint(name, description = '') {
  try {
    ensureCheckpointDir();
    
    const timestamp = new Date().toISOString();
    const checkpointId = name || `checkpoint-${Date.now()}`;
    const checkpointPath = path.join(CHECKPOINT_DIR, `${checkpointId}.json`);
    
    // 收集项目状态
    const checkpoint = {
      id: checkpointId,
      timestamp: timestamp,
      projectPath: process.cwd(),
      projectName: path.basename(process.cwd()),
      description: description,
      git: {
        branch: getGitBranch(),
        commit: getGitCommit(),
        status: getGitStatus()
      },
      files: {
        projectMemory: fs.existsSync('Project-Memory.md'),
        productSpec: fs.existsSync('Product-Spec.md'),
        uiPrompts: fs.existsSync('UI-Prompts.md'),
        designConfirmation: fs.existsSync('Design-Confirmation.md'),
        packageJson: fs.existsSync('package.json'),
        requirements: fs.existsSync('requirements.txt')
      },
      context: {
        activePhase: getActivePhase(),
        completedPhases: getCompletedPhases(),
        pendingTasks: getPendingTasks()
      }
    };
    
    // 保存为JSON文件
    fs.writeFileSync(checkpointPath, JSON.stringify(checkpoint, null, 2));
    
    console.log(JSON.stringify({
      success: true,
      action: 'save',
      id: checkpointId,
      timestamp: timestamp,
      path: checkpointPath,
      message: `检查点已保存: ${checkpointId}`
    }, null, 2));
    
    return checkpoint;
    
  } catch (error) {
    console.error(JSON.stringify({
      success: false,
      action: 'save',
      error: error.message
    }, null, 2));
    return null;
  }
}

/**
 * 恢复检查点
 */
function restoreCheckpoint(name) {
  try {
    ensureCheckpointDir();
    
    if (!name) {
      // 列出所有检查点供选择
      const checkpoints = listCheckpoints();
      console.log(JSON.stringify({
        success: true,
        action: 'list-for-restore',
        checkpoints: checkpoints,
        message: '请指定要恢复的检查点ID'
      }, null, 2));
      return null;
    }
    
    const checkpointPath = path.join(CHECKPOINT_DIR, `${name}.json`);
    
    if (!fs.existsSync(checkpointPath)) {
      // 尝试查找最近的检查点
      const checkpoints = listCheckpoints();
      const match = checkpoints.find(cp => cp.id.includes(name));
      
      if (match) {
        console.log(JSON.stringify({
          success: false,
          action: 'restore',
          error: `检查点不存在: ${name}`,
          suggestion: `是否要找: ${match.id}?`
        }, null, 2));
      } else {
        console.error(JSON.stringify({
          success: false,
          action: 'restore',
          error: `检查点不存在: ${name}`
        }, null, 2));
      }
      return null;
    }
    
    const checkpoint = JSON.parse(fs.readFileSync(checkpointPath, 'utf-8'));
    
    console.log(JSON.stringify({
      success: true,
      action: 'restore',
      checkpoint: checkpoint,
      message: `准备恢复检查点: ${name}`,
      instructions: [
        `1. 切换到项目目录: ${checkpoint.projectPath}`,
        `2. 切换到Git分支: ${checkpoint.git.branch}`,
        `3. 恢复文件状态`,
        `4. 继续${checkpoint.context.activePhase}阶段的工作`
      ]
    }, null, 2));
    
    return checkpoint;
    
  } catch (error) {
    console.error(JSON.stringify({
      success: false,
      action: 'restore',
      error: error.message
    }, null, 2));
    return null;
  }
}

/**
 * 列出所有检查点
 */
function listCheckpoints() {
  ensureCheckpointDir();
  
  if (!fs.existsSync(CHECKPOINT_DIR)) {
    return [];
  }
  
  return fs.readdirSync(CHECKPOINT_DIR)
    .filter(file => file.endsWith('.json'))
    .map(file => {
      const content = fs.readFileSync(path.join(CHECKPOINT_DIR, file), 'utf-8');
      const checkpoint = JSON.parse(content);
      return {
        id: checkpoint.id,
        timestamp: checkpoint.timestamp,
        projectName: checkpoint.projectName,
        description: checkpoint.description,
        phase: checkpoint.context.activePhase
      };
    })
    .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
}

/**
 * 删除检查点
 */
function deleteCheckpoint(name) {
  try {
    ensureCheckpointDir();
    const checkpointPath = path.join(CHECKPOINT_DIR, `${name}.json`);
    
    if (!fs.existsSync(checkpointPath)) {
      console.error(JSON.stringify({
        success: false,
        action: 'delete',
        error: `检查点不存在: ${name}`
      }, null, 2));
      return false;
    }
    
    fs.unlinkSync(checkpointPath);
    
    console.log(JSON.stringify({
      success: true,
      action: 'delete',
      id: name,
      message: `检查点已删除: ${name}`
    }, null, 2));
    
    return true;
    
  } catch (error) {
    console.error(JSON.stringify({
      success: false,
      action: 'delete',
      error: error.message
    }, null, 2));
    return false;
  }
}

/**
 * 查看检查点详情
 */
function showCheckpointInfo(name) {
  try {
    ensureCheckpointDir();
    const checkpointPath = path.join(CHECKPOINT_DIR, `${name}.json`);
    
    if (!fs.existsSync(checkpointPath)) {
      console.error(JSON.stringify({
        success: false,
        action: 'info',
        error: `检查点不存在: ${name}`
      }, null, 2));
      return null;
    }
    
    const checkpoint = JSON.parse(fs.readFileSync(checkpointPath, 'utf-8'));
    
    console.log(JSON.stringify({
      success: true,
      action: 'info',
      checkpoint: checkpoint
    }, null, 2));
    
    return checkpoint;
    
  } catch (error) {
    console.error(JSON.stringify({
      success: false,
      action: 'info',
      error: error.message
    }, null, 2));
    return null;
  }
}

/**
 * 获取当前Git分支
 */
function getGitBranch() {
  try {
    return execSync('git branch --show-current', { encoding: 'utf-8', stdio: 'pipe' }).trim();
  } catch (error) {
    return null;
  }
}

/**
 * 获取当前Git提交
 */
function getGitCommit() {
  try {
    return execSync('git rev-parse --short HEAD', { encoding: 'utf-8', stdio: 'pipe' }).trim();
  } catch (error) {
    return null;
  }
}

/**
 * 获取Git状态
 */
function getGitStatus() {
  try {
    const status = execSync('git status --porcelain', { encoding: 'utf-8', stdio: 'pipe' });
    const lines = status.trim().split('\n').filter(line => line);
    return {
      clean: lines.length === 0,
      changes: lines.length
    };
  } catch (error) {
    return { clean: true, changes: 0 };
  }
}

/**
 * 获取当前活跃阶段
 */
function getActivePhase() {
  try {
    if (fs.existsSync('Project-Memory.md')) {
      const content = fs.readFileSync('Project-Memory.md', 'utf-8');
      const match = content.match(/当前阶段:\s*(.+?)(?:\n|$)/);
      return match ? match[1].trim() : 'unknown';
    }
    return 'init';
  } catch (error) {
    return 'unknown';
  }
}

/**
 * 获取已完成阶段
 */
function getCompletedPhases() {
  const phases = [];
  
  if (fs.existsSync('Product-Spec.md')) phases.push('需求收集');
  if (fs.existsSync('UI-Prompts.md')) phases.push('UI设计');
  if (fs.existsSync('design-assets')) phases.push('设计稿生成');
  if (fs.existsSync('Design-Confirmation.md')) phases.push('设计确认');
  if (fs.existsSync('src') || fs.existsSync('app')) phases.push('开发');
  if (fs.existsSync('test-report.md')) phases.push('测试');
  if (fs.existsSync('deployment-report.md')) phases.push('部署');
  
  return phases;
}

/**
 * 获取待办任务
 */
function getPendingTasks() {
  try {
    if (fs.existsSync('Project-Memory.md')) {
      const content = fs.readFileSync('Project-Memory.md', 'utf-8');
      const todoMatch = content.match(/## 待办事项\s*\n((?:- \[[ x]\].*\n?)*)/);
      
      if (todoMatch) {
        return todoMatch[1]
          .split('\n')
          .filter(line => line.includes('- [ ]'))
          .map(line => line.replace(/- \[ \]\s*/, '').trim())
          .filter(task => task);
      }
    }
    return [];
  } catch (error) {
    return [];
  }
}

// CLI命令处理
const command = process.argv[2];
const args = process.argv.slice(3);

switch (command) {
  case 'save':
    saveCheckpoint(args[0], args.slice(1).join(' '));
    break;
    
  case 'restore':
    restoreCheckpoint(args[0]);
    break;
    
  case 'list':
    const checkpoints = listCheckpoints();
    console.log(JSON.stringify({
      success: true,
      action: 'list',
      count: checkpoints.length,
      checkpoints: checkpoints
    }, null, 2));
    break;
    
  case 'delete':
    deleteCheckpoint(args[0]);
    break;
    
  case 'info':
    showCheckpointInfo(args[0]);
    break;
    
  default:
    console.log(`
用法:
  node checkpoint-manager.js save [name] [description]     # 保存检查点
  node checkpoint-manager.js restore [name]                # 恢复检查点
  node checkpoint-manager.js list                          # 列出所有检查点
  node checkpoint-manager.js delete [name]                 # 删除检查点
  node checkpoint-manager.js info [name]                   # 查看检查点详情

示例:
  node checkpoint-manager.js save "dev-phase-1" "完成用户认证功能"
  node checkpoint-manager.js restore dev-phase-1
  node checkpoint-manager.js list
`);
}

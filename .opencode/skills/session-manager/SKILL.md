---
name: session-manager
description: 会话管理器，支持精确检查点保存和无缝会话恢复，实现真正的断点续传体验。
---

# 会话管理器（Session Manager）

## 核心理念

**从"每次从头开始"到"从上次精确位置继续"**

```
传统体验：
第1天：/prd → /dev（完成3/5功能）
第2天：重新对话
AI："请提供Product-Spec.md路径"
你：？？？（昨天不是做过了吗）
AI：[重新读取所有文档] [重新理解上下文]

问题：
• 重复劳动（重新建立上下文）
• 状态丢失（不知道上次做到哪）
• 效率浪费（10-15分钟恢复时间）

优化后体验：
第1天：/prd → /dev（完成3/5功能）
   ↓
自动保存检查点

第2天：启动
AI："欢迎回来！检测到ImageAI项目未完成的任务：
   • 当前：姿势更换功能开发中（3/5完成）
   • 待办：2个功能待实现
   • 上次操作：2026-02-03 18:30
   
   [继续上次任务]  [查看详情]  [开始新任务]"

你：[继续上次任务]

AI：[精确恢复上下文]
   [加载上次代码状态]
   [继续开发剩余2个功能]

优势：
• 无缝恢复（< 10秒）
• 精确状态（包括AI上下文）
• 多任务切换（支持多个项目）
• 永不丢失（自动+手动保存）
```

---

## 检查点系统

### 检查点数据结构

```typescript
interface SessionCheckpoint {
  // 基础信息
  id: string;                    // 检查点ID
  timestamp: number;             // 创建时间
  type: 'auto' | 'manual';       // 自动或手动
  
  // 项目信息
  project: {
    name: string;
    path: string;
    type: string;
    stage: string;               // 当前阶段
  };
  
  // 工作流状态
  workflow: {
    currentCommand: string;      // 当前执行的指令
    progress: number;            // 整体进度（0-100）
    completedStages: string[];   // 已完成阶段
    pendingStages: string[];     // 待办阶段
    currentStageStatus: any;    // 当前阶段详细状态
  };
  
  // 代码状态
  code: {
    lastCommit: string;        // Git commit hash
    modifiedFiles: string[];     // 修改的文件列表
    uncommittedChanges: boolean; // 是否有未提交更改
  };
  
  // AI上下文（关键！）
  aiContext: {
    clarifications: any[];       // 追问阶段的关键澄清
    decisions: any[];          // 已做出的决策
    understanding: string;       // AI对需求的理解摘要
    lastOutput: any;           // AI最后的输出
    conversationSummary: string; // 对话摘要
  };
  
  // 文档状态
  documents: {
    productSpec: { path: string; version: string };
    projectMemory: { path: string; lastUpdate: number };
    personalProfile: { path: string; appliedPreferences: any };
  };
  
  // 用户意图
  userIntent: {
    originalRequest: string;   // 原始请求
    interpretedIntent: string; // 解析的意图
    confidence: number;        // 置信度
  };
}
```

---

## 自动保存机制

### 保存触发器

```typescript
const AutoSaveTriggers = {
  // 时间触发（每10分钟）
  timeBased: {
    interval: 10 * 60 * 1000,  // 10分钟
    action: () => this.createCheckpoint('auto', 'time_based')
  },
  
  // 阶段完成触发
  stageCompleted: {
    trigger: 'command_success',
    action: (command) => this.createCheckpoint('auto', `stage_${command}`)
  },
  
  // 关键操作触发
  criticalOperations: [
    '/prd 完成',      // 需求确定后
    '/dev 完成50%',   // 开发过半
    '/deploy 成功'    // 部署成功后
  ],
  
  // 用户离开前触发
  beforeExit: {
    trigger: 'user_disconnect',
    action: () => this.createCheckpoint('auto', 'user_exit')
  }
};
```

### 保存策略

```typescript
class CheckpointManager {
  // 创建检查点
  async createCheckpoint(type: 'auto' | 'manual', reason: string) {
    const checkpoint: SessionCheckpoint = {
      id: generateUUID(),
      timestamp: Date.now(),
      type,
      
      project: await this.captureProjectState(),
      workflow: await this.captureWorkflowState(),
      code: await this.captureCodeState(),
      aiContext: await this.captureAIContext(),
      documents: await this.captureDocumentState(),
      userIntent: await this.captureUserIntent()
    };
    
    // 保存到会话存储
    await this.saveCheckpoint(checkpoint);
    
    // 更新Project-Memory
    await this.updateProjectMemory(checkpoint);
    
    console.log(`💾 检查点已保存: ${reason} (${type})`);
    
    return checkpoint;
  }
  
  // 捕获AI上下文（关键！）
  async captureAIContext() {
    return {
      // 从当前对话中提取
      clarifications: extractClarifications(conversationHistory),
      decisions: extractDecisions(conversationHistory),
      understanding: summarizeUnderstanding(conversationHistory),
      lastOutput: getLastOutput(),
      conversationSummary: generateSummary(conversationHistory, 10) // 最近10轮
    };
  }
  
  // 清理过期检查点
  cleanupOldCheckpoints() {
    const all = this.getAllCheckpoints();
    
    // 保留策略
    const toKeep = [];
    
    // 1. 保留最近3个自动检查点
    const recentAuto = all
      .filter(c => c.type === 'auto')
      .sort((a, b) => b.timestamp - a.timestamp)
      .slice(0, 3);
    toKeep.push(...recentAuto);
    
    // 2. 保留所有手动检查点（最多10个）
    const manual = all
      .filter(c => c.type === 'manual')
      .sort((a, b) => b.timestamp - a.timestamp)
      .slice(0, 10);
    toKeep.push(...manual);
    
    // 3. 保留关键阶段的检查点
    const critical = all.filter(c => 
      c.workflow.currentCommand === '/prd' ||
      c.workflow.currentCommand === '/deploy'
    );
    toKeep.push(...critical);
    
    // 删除其他的
    const toDelete = all.filter(c => !toKeep.includes(c));
    toDelete.forEach(c => this.deleteCheckpoint(c.id));
  }
}
```

---

## 无缝恢复机制

### 恢复流程

```typescript
class SessionRecovery {
  // 启动时检测未完成任务
  async detectIncompleteTasks() {
    const checkpoints = await this.getAllIncompleteCheckpoints();
    
    if (checkpoints.length === 0) {
      return { hasIncomplete: false };
    }
    
    // 按项目分组
    const byProject = groupBy(checkpoints, 'project.name');
    
    return {
      hasIncomplete: true,
      projects: Object.entries(byProject).map(([name, checkpoints]) => ({
        name,
        checkpoints: checkpoints.sort((a, b) => b.timestamp - a.timestamp),
        latest: checkpoints[0]
      }))
    };
  }
  
  // 显示恢复面板
  async showRecoveryPanel(incompleteTasks) {
    console.log(`
┌─────────────────────────────────────────────────────────┐
│  👋 欢迎回来！检测到未完成的任务                          │
├─────────────────────────────────────────────────────────┤
│                                                          │
${incompleteTasks.projects.map((p, i) => `
│  ${i + 1}. ${p.name}                                     │
│     当前阶段：${p.latest.workflow.currentCommand}       │
│     进度：${p.latest.workflow.progress}%                │
│     最后操作：${formatTime(p.latest.timestamp)}          │
│     [继续此任务]                                        │
`).join('\n')}
│                                                          │
│  [💼 查看所有项目]  [🆕 开始新任务]                      │
└─────────────────────────────────────────────────────────┘
    `);
    
    return await getUserChoice();
  }
  
  // 精确恢复会话
  async resumeSession(checkpointId: string) {
    const checkpoint = await this.getCheckpoint(checkpointId);
    
    console.log(`🔄 正在恢复会话...`);
    
    // 1. 恢复项目上下文
    await this.restoreProjectContext(checkpoint.project);
    
    // 2. 恢复工作流状态
    await this.restoreWorkflowState(checkpoint.workflow);
    
    // 3. 恢复代码状态（关键！）
    await this.restoreCodeState(checkpoint.code);
    
    // 4. 恢复AI上下文（最关键！）
    await this.restoreAIContext(checkpoint.aiContext);
    
    // 5. 恢复文档状态
    await this.restoreDocumentState(checkpoint.documents);
    
    // 6. 确认恢复
    console.log(`
✅ 会话已恢复！

📍 当前位置：${checkpoint.workflow.currentCommand}
📊 完成进度：${checkpoint.workflow.progress}%
⏱️  上次操作：${formatTime(checkpoint.timestamp)}

🚀 准备继续开发...`);
    
    return {
      status: 'resumed',
      checkpoint,
      canContinue: true
    };
  }
  
  // 恢复AI上下文（核心！）
  async restoreAIContext(aiContext) {
    // 恢复追问阶段的澄清
    if (aiContext.clarifications?.length > 0) {
      console.log(`  📝 恢复 ${aiContext.clarifications.length} 个需求澄清`);
      setConversationContext('clarifications', aiContext.clarifications);
    }
    
    // 恢复已做决策
    if (aiContext.decisions?.length > 0) {
      console.log(`  ✅ 恢复 ${aiContext.decisions.length} 个技术决策`);
      setConversationContext('decisions', aiContext.decisions);
    }
    
    // 恢复AI理解摘要
    if (aiContext.understanding) {
      console.log(`  🧠 恢复需求理解上下文`);
      setConversationContext('understanding', aiContext.understanding);
    }
    
    // 恢复最后输出（让AI知道上次说到哪）
    if (aiContext.lastOutput) {
      setConversationContext('lastOutput', aiContext.lastOutput);
    }
  }
  
  // 恢复代码状态
  async restoreCodeState(codeState) {
    if (codeState.lastCommit) {
      // 恢复到指定commit
      await gitCheckout(codeState.lastCommit);
    }
    
    if (codeState.modifiedFiles?.length > 0) {
      // 恢复修改的文件（如果有stash）
      await gitStashPop();
    }
    
    console.log(`  💻 代码状态已恢复`);
  }
}
```

---

## 多项目管理

### 支持同时进行的多个项目

```typescript
const MultiProjectSupport = {
  // 项目列表
  async listProjects() {
    const checkpoints = await this.getAllCheckpoints();
    
    const projects = groupBy(checkpoints, 'project.name');
    
    return Object.entries(projects).map(([name, checkpoints]) => ({
      name,
      status: this.determineStatus(checkpoints),
      lastActive: Math.max(...checkpoints.map(c => c.timestamp)),
      progress: checkpoints[0].workflow.progress,
      totalCheckpoints: checkpoints.length
    }));
  },
  
  // 快速切换项目
  async switchProject(projectName: string) {
    // 1. 保存当前项目检查点
    await this.createCheckpoint('auto', 'switch_project');
    
    // 2. 加载目标项目
    const targetCheckpoint = await this.getLatestCheckpoint(projectName);
    
    // 3. 恢复目标项目
    await SessionRecovery.resumeSession(targetCheckpoint.id);
    
    console.log(`🔄 已切换到项目：${projectName}`);
  }
};
```

---

## 新指令

### /checkpoint - 手动保存检查点

```markdown
### /checkpoint - 保存检查点

**功能**：手动保存当前会话状态

**使用场景**：
- 重要里程碑（如完成关键功能）
- 切换任务前（保存当前进度）
- 长时间操作前（防止意外中断）

**自动保存**：
- 每10分钟自动保存
- 阶段完成后自动保存
- 用户断开前自动保存

**示例**：
```
用户：/checkpoint
AI："💾 检查点已保存
   项目：ImageAI
   阶段：/dev（姿势更换功能，60%）
   时间：2026-02-03 20:15
   
   下次启动时可以从这里继续。"
```
```

### /resume - 恢复会话

```markdown
### /resume - 恢复上次会话

**功能**：从最近检查点恢复工作

**使用场景**：
- 重新启动后继续上次任务
- 切换项目后恢复
- 中断后恢复

**恢复内容**：
- ✅ 项目上下文
- ✅ 工作流状态
- ✅ 代码状态
- ✅ AI上下文（追问、决策、理解）
- ✅ 文档状态

**示例**：
```
用户：/resume

AI："🔄 检测到未完成的任务
   
   📦 ImageAI 项目
   当前：/dev（姿势更换功能）
   进度：60%（3/5功能）
   最后操作：2小时前
   
   [继续开发]  [查看状态]  [放弃恢复]"

用户：[继续开发]

AI：[精确恢复上下文]
   "欢迎回来！上次我们在开发姿势更换功能...
   继续实现第4个功能：穿搭方案更换？"
```

### /sessions - 查看所有会话

```markdown
### /sessions - 查看会话列表

**功能**：查看所有项目的会话和检查点

**示例**：
```
用户：/sessions

AI："📁 项目会话列表

1. 🟢 ImageAI（进行中）
   阶段：/dev
   进度：60%
   最后更新：2小时前
   [继续] [查看] [删除]

2. ⏸️  BlogSystem（已暂停）
   阶段：/prd
   进度：30%
   最后更新：昨天
   [继续] [查看] [删除]

3. ✅  TodoApp（已完成）
   阶段：/deploy
   状态：已上线
   完成时间：3天前
   [查看] [归档]"
```
```

---

## 集成到主控流程

```typescript
// AGENTS.md 集成
const SmartAgentWithSession = {
  // 启动时自动检测
  async onStartup() {
    const incomplete = await SessionRecovery.detectIncompleteTasks();
    
    if (incomplete.hasIncomplete) {
      const choice = await SessionRecovery.showRecoveryPanel(incomplete);
      
      if (choice.action === 'resume') {
        return await SessionRecovery.resumeSession(choice.checkpointId);
      }
    }
    
    // 没有未完成任务或用户选择新任务
    return await this.startNewWorkflow();
  },
  
  // 每个指令后自动保存
  async afterCommand(command, result) {
    if (result.success && this.shouldAutoSave(command)) {
      await CheckpointManager.createCheckpoint('auto', command);
    }
  },
  
  shouldAutoSave(command) {
    // 重要指令后自动保存
    const importantCommands = ['/prd', '/dev', '/deploy', '/check'];
    return importantCommands.includes(command);
  }
};
```

---

## 完成标准

- [ ] 检查点保存成功率>99%
- [ ] 恢复时间<10秒
- [ ] AI上下文恢复准确率>95%
- [ ] 支持同时管理5+项目
- [ ] 自动保存不打扰用户

## 预期效果

| 指标 | 优化前 | 优化后 | 提升 |
|------|--------|--------|------|
| **恢复时间** | 10-15分钟 | < 10秒 | **-98%** |
| **上下文丢失** | 经常 | 几乎为零 | **-99%** |
| **重复劳动** | 高 | 无 | **-100%** |
| **多项目切换** | 困难 | 一键切换 | **无缝** |
| **用户满意度** | 良好 | 优秀 | **+30%** |

---

**🎯 Phase 7-2 完成：无缝会话恢复机制**

**核心价值**：
- 会话永不丢失，精确恢复
- 支持多项目切换
- 多设备同步体验

**进入 Phase 7-3：项目模板自动生成**

"use client";

import React, { useEffect, useState } from 'react';
import { useTheme } from './ThemeProvider';
import { GenerationQueue, GenerationTask, getGenerationQueue } from '@/lib/generationQueue';

interface BatchGenerationStatusProps {
  tasks: GenerationTask[];
  onTaskComplete?: (task: GenerationTask) => void;
  onAllComplete?: (tasks: GenerationTask[]) => void;
  onClose?: () => void;
}

export default function BatchGenerationStatus({
  tasks,
  onTaskComplete,
  onAllComplete,
  onClose
}: BatchGenerationStatusProps) {
  const { theme } = useTheme();
  const [queue] = useState(() => getGenerationQueue());
  const [taskList, setTaskList] = useState<GenerationTask[]>(tasks);
  const [queueStatus, setQueueStatus] = useState(queue.getQueueStatus());

  useEffect(() => {
    // 监听队列更新
    const handleQueueUpdate = () => {
      setQueueStatus(queue.getQueueStatus());
      setTaskList(queue.getAllTasks().filter(t => tasks.some(task => task.id === t.id)));
    };

    const handleTaskComplete = (task: GenerationTask) => {
      onTaskComplete?.(task);
      handleQueueUpdate();
    };

    const handleCompleted = () => {
      const allTasks = queue.getAllTasks().filter(t => tasks.some(task => task.id === t.id));
      onAllComplete?.(allTasks);
    };

    queue.on('queueUpdate', handleQueueUpdate);
    queue.on('taskCompleted', handleTaskComplete);
    queue.on('completed', handleCompleted);

    return () => {
      queue.off('queueUpdate', handleQueueUpdate);
      queue.off('taskCompleted', handleTaskComplete);
      queue.off('completed', handleCompleted);
    };
  }, [queue, tasks, onTaskComplete, onAllComplete]);

  const styles = {
    overlay: {
      position: 'fixed' as const,
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000
    },
    modal: {
      backgroundColor: theme === 'dark' ? '#1f2a3a' : 'white',
      borderRadius: 16,
      padding: '2rem',
      maxWidth: 600,
      width: '90%',
      maxHeight: '80vh',
      overflow: 'auto',
      boxShadow: theme === 'dark' ? '0 24px 48px rgba(0,0,0,.5)' : '0 24px 48px rgba(0,0,0,.2)'
    },
    header: {
      display: 'flex',
      justifyContent: 'space-between' as const,
      alignItems: 'center',
      marginBottom: '1.5rem'
    },
    title: {
      fontSize: '1.5rem',
      fontWeight: 600,
      color: theme === 'dark' ? '#e5e7eb' : '#1e293b'
    },
    closeButton: {
      background: 'none',
      border: 'none',
      fontSize: '1.5rem',
      cursor: 'pointer',
      color: theme === 'dark' ? '#9ca3af' : '#6b7280'
    },
    summary: {
      display: 'flex',
      gap: '1rem',
      marginBottom: '1.5rem',
      padding: '1rem',
      backgroundColor: theme === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)',
      borderRadius: 8
    },
    summaryItem: {
      flex: 1,
      textAlign: 'center' as const
    },
    summaryValue: {
      fontSize: '1.5rem',
      fontWeight: 700,
      color: theme === 'dark' ? '#e5e7eb' : '#1e293b'
    },
    summaryLabel: {
      fontSize: '0.75rem',
      color: theme === 'dark' ? '#9ca3af' : '#6b7280',
      marginTop: '0.25rem'
    },
    taskList: {
      display: 'flex',
      flexDirection: 'column' as const,
      gap: '0.75rem'
    },
    taskItem: {
      padding: '1rem',
      borderRadius: 8,
      backgroundColor: theme === 'dark' ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)',
      border: `1px solid ${theme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)'}`,
      display: 'flex',
      alignItems: 'center',
      gap: '1rem'
    },
    taskNumber: {
      width: 32,
      height: 32,
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '0.875rem',
      fontWeight: 600,
      flexShrink: 0
    },
    taskInfo: {
      flex: 1
    },
    taskParams: {
      fontSize: '0.75rem',
      color: theme === 'dark' ? '#9ca3af' : '#6b7280'
    },
    taskProgress: {
      width: 120,
      flexShrink: 0
    },
    progressBar: {
      height: 6,
      backgroundColor: theme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
      borderRadius: 3,
      overflow: 'hidden'
    },
    progressFill: {
      height: '100%',
      borderRadius: 3,
      transition: 'width 0.3s ease'
    },
    progressText: {
      fontSize: '0.75rem',
      color: theme === 'dark' ? '#9ca3af' : '#6b7280',
      marginTop: '0.25rem',
      textAlign: 'right' as const
    },
    statusBadge: {
      padding: '0.25rem 0.75rem',
      borderRadius: 9999,
      fontSize: '0.75rem',
      fontWeight: 500
    },
    resultPreview: {
      width: 60,
      height: 60,
      borderRadius: 8,
      objectFit: 'cover' as const,
      flexShrink: 0
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return { bg: theme === 'dark' ? 'rgba(245, 158, 11, 0.2)' : '#fef3c7', text: '#f59e0b' };
      case 'processing':
        return { bg: theme === 'dark' ? 'rgba(59, 130, 246, 0.2)' : '#dbeafe', text: '#3b82f6' };
      case 'completed':
        return { bg: theme === 'dark' ? 'rgba(16, 185, 129, 0.2)' : '#d1fae5', text: '#10b981' };
      case 'failed':
        return { bg: theme === 'dark' ? 'rgba(239, 68, 68, 0.2)' : '#fee2e2', text: '#ef4444' };
      default:
        return { bg: theme === 'dark' ? 'rgba(107, 114, 128, 0.2)' : '#f3f4f6', text: '#6b7280' };
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending':
        return '等待中';
      case 'processing':
        return '生成中';
      case 'completed':
        return '已完成';
      case 'failed':
        return '失败';
      default:
        return status;
    }
  };

  const completedCount = taskList.filter(t => t.status === 'completed').length;
  const failedCount = taskList.filter(t => t.status === 'failed').length;
  const processingCount = taskList.filter(t => t.status === 'processing').length;

  return (
    <div style={styles.overlay} onClick={onClose}>
      <div style={styles.modal} onClick={e => e.stopPropagation()}>
        <div style={styles.header}>
          <h3 style={styles.title}>批量生成进度</h3>
          <button style={styles.closeButton} onClick={onClose}>×</button>
        </div>

        <div style={styles.summary}>
          <div style={styles.summaryItem}>
            <div style={styles.summaryValue}>{completedCount}</div>
            <div style={styles.summaryLabel}>已完成</div>
          </div>
          <div style={styles.summaryItem}>
            <div style={{ ...styles.summaryValue, color: '#3b82f6' }}>{processingCount}</div>
            <div style={styles.summaryLabel}>生成中</div>
          </div>
          <div style={styles.summaryItem}>
            <div style={{ ...styles.summaryValue, color: failedCount > 0 ? '#ef4444' : 'inherit' }}>
              {failedCount}
            </div>
            <div style={styles.summaryLabel}>失败</div>
          </div>
          <div style={styles.summaryItem}>
            <div style={styles.summaryValue}>{taskList.length}</div>
            <div style={styles.summaryLabel}>总计</div>
          </div>
        </div>

        <div style={styles.taskList}>
          {taskList.map((task, index) => {
            const statusColor = getStatusColor(task.status);
            return (
              <div key={task.id} style={styles.taskItem}>
                <div
                  style={{
                    ...styles.taskNumber,
                    backgroundColor: statusColor.bg,
                    color: statusColor.text
                  }}
                >
                  {task.status === 'completed' ? '✓' : index + 1}
                </div>

                {task.result && (
                  <img src={task.result} alt="result" style={styles.resultPreview} />
                )}

                <div style={styles.taskInfo}>
                  <div style={{ fontSize: '0.875rem', fontWeight: 500, color: theme === 'dark' ? '#e5e7eb' : '#1e293b' }}>
                    {task.pose} · {task.style}
                  </div>
                  <div style={styles.taskParams}>
                    {task.lighting} · {task.background} · {task.colorTone}
                  </div>
                </div>

                {task.status === 'processing' && (
                  <div style={styles.taskProgress}>
                    <div style={styles.progressBar}>
                      <div
                        style={{
                          ...styles.progressFill,
                          width: `${task.progress}%`,
                          backgroundColor: '#3b82f6'
                        }}
                      />
                    </div>
                    <div style={styles.progressText}>{Math.round(task.progress)}%</div>
                  </div>
                )}

                <div
                  style={{
                    ...styles.statusBadge,
                    backgroundColor: statusColor.bg,
                    color: statusColor.text
                  }}
                >
                  {getStatusText(task.status)}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

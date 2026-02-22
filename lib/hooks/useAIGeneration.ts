/**
 * AI 生成 Hook
 * 提供重试机制、超时控制、进度跟踪等功能
 */

import { useState, useCallback } from 'react';
import { fetchWithRetry } from '../utils/network';

interface GenerationParams {
  modelImage: string;
  outfitImage: string;
  pose?: string;
  style?: string;
  lighting?: string;
  background?: string;
  colorTone?: string;
}

interface GenerationState {
  isGenerating: boolean;
  progress: number;
  error: string | null;
  result: string | null;
}

interface GenerationOptions {
  maxRetries?: number;
  timeout?: number;
  onRetry?: (attempt: number, error: Error) => void;
  onProgress?: (progress: number) => void;
}

export function useAIGeneration(options: GenerationOptions = {}) {
  const {
    maxRetries = 3,
    timeout = 120000,
    onRetry,
    onProgress
  } = options;

  const [state, setState] = useState<GenerationState>({
    isGenerating: false,
    progress: 0,
    error: null,
    result: null
  });

  const generate = useCallback(async (
    params: GenerationParams
  ): Promise<string> => {
    setState({ isGenerating: true, progress: 0, error: null, result: null });

    // 模拟进度 - 定义在try外部以便catch可以访问
    let progressInterval: NodeJS.Timeout | null = null;

    try {
      progressInterval = setInterval(() => {
        setState(prev => {
          const newProgress = Math.min(prev.progress + 5, 90);
          onProgress?.(newProgress);
          return { ...prev, progress: newProgress };
        });
      }, 1000);

      const response = await fetchWithRetry('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(params),
        timeout,
        retry: {
          maxRetries,
          retryDelay: 2000,
          backoffMultiplier: 1.5,
          onRetry: (attempt, error) => {
            console.warn(`AI 生成失败，第 ${attempt} 次重试`, error);
            onRetry?.(attempt, error);
          }
        }
      });

      clearInterval(progressInterval);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `生成失败: ${response.statusText}`);
      }

      const data = await response.json();

      if (data.status !== 'success') {
        throw new Error(data.message || '生成失败');
      }

      if (progressInterval) clearInterval(progressInterval);

      setState({
        isGenerating: false,
        progress: 100,
        error: null,
        result: data.url
      });

      return data.url;
    } catch (error) {
      if (progressInterval) clearInterval(progressInterval);
      
      const errorMessage = error instanceof Error ? error.message : '生成失败';
      setState({
        isGenerating: false,
        progress: 0,
        error: errorMessage,
        result: null
      });
      
      throw error;
    }
  }, [maxRetries, timeout, onRetry, onProgress]);

  const reset = useCallback(() => {
    setState({ isGenerating: false, progress: 0, error: null, result: null });
  }, []);

  const clearError = useCallback(() => {
    setState(prev => ({ ...prev, error: null }));
  }, []);

  return {
    ...state,
    generate,
    reset,
    clearError
  };
}

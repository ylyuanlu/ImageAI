import { useState, useEffect, useCallback } from 'react';

interface User {
  id: string;
  email: string;
  username: string;
  avatar?: string;
  role: string;
  status: string;
  emailVerified: boolean;
  createdAt: string;
  updatedAt: string;
  lastLoginAt?: string;
  subscription?: {
    plan: string;
    status: string;
    currentPeriodEnd: string;
  };
  quota?: {
    freeQuota: number;
    freeQuotaUsed: number;
    paidQuota: number;
    paidQuotaUsed: number;
    extraQuota: number;
    extraQuotaUsed: number;
    totalQuota: number;
    remainingQuota: number;
  };
}

interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

export function useAuth() {
  const [state, setState] = useState<AuthState>({
    user: null,
    isLoading: true,
    isAuthenticated: false,
  });

  // 获取当前用户信息
  const fetchUser = useCallback(async () => {
    try {
      const response = await fetch('/api/auth/me', {
        credentials: 'include',
      });

      if (response.ok) {
        const data = await response.json();
        setState({
          user: data.user,
          isLoading: false,
          isAuthenticated: true,
        });
      } else {
        setState({
          user: null,
          isLoading: false,
          isAuthenticated: false,
        });
      }
    } catch (error) {
      console.error('获取用户信息失败:', error);
      setState({
        user: null,
        isLoading: false,
        isAuthenticated: false,
      });
    }
  }, []);

  // 初始加载
  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  // 登录
  const login = async (email: string, password: string) => {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        setState({
          user: data.user,
          isLoading: false,
          isAuthenticated: true,
        });
        return { success: true, message: data.message };
      } else {
        return { success: false, error: data.error };
      }
    } catch (error) {
      return { success: false, error: '登录失败，请稍后重试' };
    }
  };

  // 注册
  const register = async (email: string, username: string, password: string) => {
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email, username, password }),
      });

      const data = await response.json();

      if (response.ok) {
        setState({
          user: data.user,
          isLoading: false,
          isAuthenticated: true,
        });
        return { success: true, message: data.message, verificationUrl: data.verificationUrl };
      } else {
        return { success: false, error: data.error };
      }
    } catch (error) {
      return { success: false, error: '注册失败，请稍后重试' };
    }
  };

  // 登出
  const logout = async () => {
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include',
      });

      setState({
        user: null,
        isLoading: false,
        isAuthenticated: false,
      });

      return { success: true };
    } catch (error) {
      return { success: false, error: '登出失败' };
    }
  };

  // 更新个人资料
  const updateProfile = async (data: { username?: string; avatar?: string }) => {
    try {
      const response = await fetch('/api/auth/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (response.ok) {
        setState(prev => ({
          ...prev,
          user: result.user,
        }));
        return { success: true, message: result.message };
      } else {
        return { success: false, error: result.error };
      }
    } catch (error) {
      return { success: false, error: '更新失败，请稍后重试' };
    }
  };

  // 修改密码
  const changePassword = async (currentPassword: string, newPassword: string) => {
    try {
      const response = await fetch('/api/auth/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ currentPassword, newPassword }),
      });

      const result = await response.json();

      if (response.ok) {
        return { success: true, message: result.message };
      } else {
        return { success: false, error: result.error };
      }
    } catch (error) {
      return { success: false, error: '修改密码失败，请稍后重试' };
    }
  };

  return {
    ...state,
    login,
    register,
    logout,
    updateProfile,
    changePassword,
    refreshUser: fetchUser,
  };
}

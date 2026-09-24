import api, { getErrorMessage } from './api';
import { ApiResponse, AuthResponse, User } from '../types';

export interface RegisterPayload {
  name: string;
  email: string;
  phone: string;
  password: string;
  role?: 'customer' | 'worker';
}

export interface LoginPayload {
  email: string;
  password: string;
}

export const authService = {
  async register(payload: RegisterPayload): Promise<{ user?: User; token?: string; message?: string }> {
    try {
      const response = await api.post<AuthResponse>('/auth/register', payload);
      const data = response.data;
      const token = data.token || data.accessToken || data.data?.token;
      const user = data.user || data.data?.user;
      return { user, token, message: data.message };
    } catch (error) {
      throw new Error(getErrorMessage(error, 'Registration failed'));
    }
  },

  async login(payload: LoginPayload): Promise<{ user: User; token: string; message?: string }> {
    try {
      const response = await api.post<AuthResponse>('/auth/login', payload);
      const data = response.data;
      const token = data.token || data.accessToken || data.data?.token;
      const user = data.user || data.data?.user;

      if (!token) {
        throw new Error('Authentication succeeded but no token was returned.');
      }

      if (!user) {
        throw new Error('Authentication succeeded but user details were not returned.');
      }

      return { user, token, message: data.message };
    } catch (error) {
      throw new Error(getErrorMessage(error, 'Login failed'));
    }
  },

  async forgotPassword(email: string): Promise<string> {
    try {
      const response = await api.post<{ message?: string }>('/auth/forgot-password', { email });
      return response.data.message || 'If an account exists, a reset link has been sent.';
    } catch (error) {
      throw new Error(getErrorMessage(error, 'Could not send password reset email'));
    }
  },

  async resetPassword(token: string, password: string): Promise<string> {
    try {
      const response = await api.post<{ message?: string }>('/auth/reset-password', { token, password });
      return response.data.message || 'Password reset successfully.';
    } catch (error) {
      throw new Error(getErrorMessage(error, 'Could not reset password'));
    }
  },

};

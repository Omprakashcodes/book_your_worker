import api, { getErrorMessage } from './api';
import { User, ApiResponse } from '../types';

export interface UpdateUserProfilePayload {
  phone?: string;
  address?: string;
  bio?: string;
  profileImage?: string;
}

export const userService = {
  async getCurrentUser(): Promise<User> {
    try {
      const response = await api.get<ApiResponse<User> | User>('/users/me');
      const data = response.data;
      const user = (data as any)?.data || (data as any)?.user || data;
      return user;
    } catch (error) {
      throw new Error(getErrorMessage(error, 'Could not load user profile'));
    }
  },

  async updateProfile(payload: UpdateUserProfilePayload): Promise<User> {
    try {
      const response = await api.patch<ApiResponse<User> | User>('/users/profile', payload);
      const data = response.data;
      const user = (data as any)?.data || (data as any)?.user || data;
      return user;
    } catch (error) {
      throw new Error(getErrorMessage(error, 'Failed to update profile'));
    }
  },
};

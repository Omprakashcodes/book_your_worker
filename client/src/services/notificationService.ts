import api from './api';

export interface Notification {
  _id: string;
  userId: string;
  title: string;
  message: string;
  type:
    | 'welcome'
    | 'kyc_submitted'
    | 'kyc_approved'
    | 'kyc_rejected'
    | 'booking_created'
    | 'booking_accepted'
    | 'booking_rejected'
    | 'booking_completed'
    | 'booking_cancelled';
  isRead: boolean;
  relatedId?: string | null;
  createdAt: string;
  updatedAt: string;
}

interface NotificationsResponse {
  success: boolean;
  data: Notification[];
}

interface UnreadCountResponse {
  success: boolean;
  data: {
    count: number;
  };
}

export const notificationService = {
  async getNotifications(): Promise<Notification[]> {
    const response = await api.get<NotificationsResponse>('/notifications');
    return response.data.data;
  },

  async getUnreadCount(): Promise<number> {
    const response = await api.get<UnreadCountResponse>(
      '/notifications/unread-count'
    );
    return response.data.data.count;
  },

  async markAsRead(notificationId: string): Promise<Notification> {
    const response = await api.patch<{ success: boolean; data: Notification }>(
      `/notifications/${notificationId}/read`
    );
    return response.data.data;
  },

  async markAllAsRead(): Promise<void> {
    await api.patch('/notifications/read-all');
  },
};
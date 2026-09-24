import api, { getErrorMessage } from './api';
import { WorkerProfile, ApiResponse } from '../types';

export const adminService = {
  /**
   * GET /api/admin/workers
   * Get all workers for admin verification.
   */
  async getAllWorkers(status?: string): Promise<WorkerProfile[]> {
    try {
      const url =
        status && status !== 'all'
          ? `/admin/workers?status=${encodeURIComponent(status)}`
          : '/admin/workers';

      const response = await api.get(url);
      const data = response.data;

      if (Array.isArray(data)) {
        return data;
      }

      if (Array.isArray(data?.data)) {
        return data.data;
      }

      if (Array.isArray(data?.workers)) {
        return data.workers;
      }

      return [];
    } catch (error) {
      throw new Error(
        getErrorMessage(error, 'Could not fetch workers list')
      );
    }
  },

  /**
   * GET /api/admin/workers/pending
   * Get workers waiting for verification.
   */
  async getPendingWorkers(): Promise<WorkerProfile[]> {
    try {
      const response = await api.get('/admin/workers/pending');
      const data = response.data;

      if (Array.isArray(data)) {
        return data;
      }

      if (Array.isArray(data?.data)) {
        return data.data;
      }

      if (Array.isArray(data?.workers)) {
        return data.workers;
      }

      return [];
    } catch (error) {
      throw new Error(
        getErrorMessage(error, 'Could not fetch pending workers')
      );
    }
  },

  /**
   * GET /api/admin/workers/:id
   * Get complete worker details.
   */
  async getWorkerDetails(workerId: string): Promise<WorkerProfile> {
    try {
      const response = await api.get<
        ApiResponse<WorkerProfile> | WorkerProfile
      >(`/admin/workers/${workerId}`);

      const data = response.data;

      return (
        (data as any)?.data ||
        (data as any)?.worker ||
        data
      );
    } catch (error) {
      throw new Error(
        getErrorMessage(error, 'Could not fetch worker details')
      );
    }
  },

  /**
   * PATCH /api/admin/workers/:id/approve
   * Approve worker verification.
   */
  async verifyWorker(workerId: string): Promise<WorkerProfile> {
    try {
      const response = await api.patch<
        ApiResponse<WorkerProfile> | WorkerProfile
      >(`/admin/workers/${workerId}/approve`);

      const data = response.data;

      return (
        (data as any)?.data ||
        (data as any)?.worker ||
        data
      );
    } catch (error) {
      throw new Error(
        getErrorMessage(error, 'Failed to approve worker')
      );
    }
  },

  /**
   * Backwards-compatible alias.
   */
  async approveWorker(workerId: string): Promise<WorkerProfile> {
    return this.verifyWorker(workerId);
  },

  /**
   * PATCH /api/admin/workers/:id/reject
   * Reject worker verification.
   */
  async rejectWorker(
    workerId: string,
    reason: string
  ): Promise<WorkerProfile> {
    try {
      const response = await api.patch<
        ApiResponse<WorkerProfile> | WorkerProfile
      >(`/admin/workers/${workerId}/reject`, {
        rejectionReason: reason,
      });

      const data = response.data;

      return (
        (data as any)?.data ||
        (data as any)?.worker ||
        data
      );
    } catch (error) {
      throw new Error(
        getErrorMessage(error, 'Failed to reject worker')
      );
    }
  },

    /**
   * GET /api/admin/users
   * Get all registered users for admin.
   */
  async getAllUsers(): Promise<any[]> {
    try {
      const response = await api.get('/admin/users');
      const data = response.data;

      if (Array.isArray(data)) {
        return data;
      }

      if (Array.isArray(data?.data)) {
        return data.data;
      }

      if (Array.isArray(data?.users)) {
        return data.users;
      }

      return [];
    } catch (error) {
      throw new Error(
        getErrorMessage(error, 'Could not fetch registered users')
      );
    }
  },
};
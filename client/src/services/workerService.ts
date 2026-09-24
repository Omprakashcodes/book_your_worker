import api, { getErrorMessage } from './api';
import { WorkerProfile, ApiResponse } from '../types';

export interface UpdateWorkerProfilePayload {
  phone: string;
  profileImage?: string;
  skills: string[];
  experience: number;
  address: string;
  city: string;
  state: string;
  dailyWage: number;
}

export const workerService = {
  /**
   * Public marketplace discovery of approved workers only
   * GET /api/workers/
   */
  async getWorkers(): Promise<WorkerProfile[]> {
    try {
      const response = await api.get('/workers/');
      const data = response.data;
      let workers: WorkerProfile[] = [];
      if (Array.isArray(data)) {
        workers = data;
      } else if (Array.isArray(data?.workers)) {
        workers = data.workers;
      } else if (Array.isArray(data?.data)) {
        workers = data.data;
      }
      return workers;
    } catch (error) {
      throw new Error(getErrorMessage(error, 'Could not fetch service professionals from server'));
    }
  },

  /**
   * Resolves worker from approved workers list
   * (Since backend does not provide a public /api/workers/:id endpoint)
   */
  async getWorkerById(id: string): Promise<WorkerProfile> {
    const workers = await this.getWorkers();
    const found = workers.find((w) => (w._id || w.id) === id);
    if (!found) {
      throw new Error('Worker profile not found or worker is not currently approved');
    }
    return found;
  },

  /**
   * Get authenticated worker's own profile and verification details
   * GET /api/workers/me
   */
  async getMyWorkerProfile(): Promise<WorkerProfile> {
    try {
      const response = await api.get<ApiResponse<WorkerProfile> | WorkerProfile>('/workers/me');
      const data = response.data;
      const profile = (data as any)?.data || (data as any)?.worker || data;
      return profile;
    } catch (error) {
      throw new Error(getErrorMessage(error, 'Could not load worker profile'));
    }
  },

  /**
   * Update authenticated worker's profile
   * PATCH /api/workers/profile
   */
  async updateWorkerProfile(payload: UpdateWorkerProfilePayload): Promise<WorkerProfile> {
    try {
      const response = await api.patch<ApiResponse<WorkerProfile> | WorkerProfile>('/workers/profile', payload);
      const data = response.data;
      const profile = (data as any)?.data || (data as any)?.worker || data;
      return profile;
    } catch (error) {
      throw new Error(getErrorMessage(error, 'Failed to update worker profile'));
    }
  },

  /**
   * Upload worker Aadhaar and PAN documents for verification
   * POST /api/workers/documents (multipart/form-data)
   */
  async uploadDocuments(formData: FormData): Promise<WorkerProfile> {
    try {
      const response = await api.post<ApiResponse<WorkerProfile> | WorkerProfile>(
        '/workers/documents',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      const data = response.data;
      const profile = (data as any)?.data || (data as any)?.worker || data;
      return profile;
    } catch (error) {
      throw new Error(getErrorMessage(error, 'Failed to upload verification documents'));
    }
  },
};

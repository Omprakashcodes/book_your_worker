import api, { getErrorMessage } from './api';
import { Booking, ApiResponse } from '../types';

export interface CreateBookingPayload {
  workerId: string;
  service: string;
  bookingDate: string;
  bookingTime: string;
  address: string;
  amount: number;
  description?: string;
  // Backwards compat fields if needed:
  date?: string;
  time?: string;
}

export interface PaymentOrder {
  keyId: string;
  orderId: string;
  amount: number;
  currency: string;
  bookingId: string;
}

export interface PaymentVerificationPayload {
  razorpayOrderId: string;
  razorpayPaymentId: string;
  razorpaySignature: string;
}

export interface LiveLocation {
  latitude: number | null;
  longitude: number | null;
  updatedAt: string | null;
  isSharing: boolean;
}

export const bookingService = {
  /**
   * POST /api/bookings/ - Create customer booking for an approved worker
   */
  async createBooking(payload: CreateBookingPayload): Promise<Booking> {
    try {
      const body = {
        workerId: payload.workerId,
        service: payload.service,
        bookingDate: payload.bookingDate || payload.date,
        bookingTime: payload.bookingTime || payload.time,
        address: payload.address,
        amount: payload.amount,
        description: payload.description || undefined,
      };

      const response = await api.post<ApiResponse<Booking> | Booking>('/bookings/', body);
      const data = response.data;
      const created = (data as any)?.data || (data as any)?.booking || data;
      return created;
    } catch (error) {
      throw new Error(getErrorMessage(error, 'Failed to create booking'));
    }
  },

  async createPaymentOrder(bookingId: string): Promise<PaymentOrder> {
    try {
      const response = await api.post<ApiResponse<PaymentOrder>>(`/payments/bookings/${bookingId}/order`);
      return response.data.data as PaymentOrder;
    } catch (error) {
      throw new Error(getErrorMessage(error, 'Could not start payment'));
    }
  },

  async verifyPayment(
    bookingId: string,
    payload: PaymentVerificationPayload
  ): Promise<Booking> {
    try {
      const response = await api.post<ApiResponse<Booking>>(
        `/payments/bookings/${bookingId}/verify`,
        payload
      );
      return response.data.data as Booking;
    } catch (error) {
      throw new Error(getErrorMessage(error, 'Could not verify payment'));
    }
  },

  async updateLiveLocation(bookingId: string, latitude: number, longitude: number): Promise<LiveLocation> {
    try {
      const response = await api.patch<ApiResponse<LiveLocation>>(
        `/bookings/${bookingId}/live-location`,
        { latitude, longitude, isSharing: true }
      );
      return response.data.data as LiveLocation;
    } catch (error) {
      throw new Error(getErrorMessage(error, 'Could not share live location'));
    }
  },

  async getLiveLocation(bookingId: string): Promise<LiveLocation> {
    try {
      const response = await api.get<ApiResponse<LiveLocation>>(`/bookings/${bookingId}/live-location`);
      return response.data.data as LiveLocation;
    } catch (error) {
      throw new Error(getErrorMessage(error, 'Could not load live location'));
    }
  },

  /**
   * GET /api/bookings/my - Get customer's booking history
   */
  async getMyBookings(): Promise<Booking[]> {
    try {
      const response = await api.get('/bookings/my');
      const data = response.data;
      let bookings: Booking[] = [];
      if (Array.isArray(data)) {
        bookings = data;
      } else if (Array.isArray(data?.bookings)) {
        bookings = data.bookings;
      } else if (Array.isArray(data?.data)) {
        bookings = data.data;
      }
      return bookings;
    } catch (error) {
      throw new Error(getErrorMessage(error, 'Could not fetch your bookings'));
    }
  },

  /**
   * GET /api/bookings/worker - Get worker's assigned booking requests
   */
  async getWorkerBookings(): Promise<Booking[]> {
    try {
      const response = await api.get('/bookings/worker');
      const data = response.data;
      let bookings: Booking[] = [];
      if (Array.isArray(data)) {
        bookings = data;
      } else if (Array.isArray(data?.bookings)) {
        bookings = data.bookings;
      } else if (Array.isArray(data?.data)) {
        bookings = data.data;
      }
      return bookings;
    } catch (error) {
      throw new Error(getErrorMessage(error, 'Could not fetch worker bookings'));
    }
  },

  /**
   * PATCH /api/bookings/:id/cancel - Customer cancels own pending booking
   */
  async cancelBooking(bookingId: string): Promise<Booking> {
    try {
      const response = await api.patch<ApiResponse<Booking> | Booking>(`/bookings/${bookingId}/cancel`);
      const data = response.data;
      const updated = (data as any)?.data || (data as any)?.booking || data;
      return updated;
    } catch (error) {
      throw new Error(getErrorMessage(error, 'Could not cancel booking'));
    }
  },

  /**
   * PATCH /api/bookings/:id/accept - Worker accepts pending booking
   */
  async acceptBooking(bookingId: string): Promise<Booking> {
    try {
      const response = await api.patch<ApiResponse<Booking> | Booking>(`/bookings/${bookingId}/accept`);
      const data = response.data;
      const updated = (data as any)?.data || (data as any)?.booking || data;
      return updated;
    } catch (error) {
      throw new Error(getErrorMessage(error, 'Could not accept booking'));
    }
  },

  /**
   * PATCH /api/bookings/:id/reject - Worker rejects pending booking
   */
  async rejectBooking(bookingId: string): Promise<Booking> {
    try {
      const response = await api.patch<ApiResponse<Booking> | Booking>(`/bookings/${bookingId}/reject`);
      const data = response.data;
      const updated = (data as any)?.data || (data as any)?.booking || data;
      return updated;
    } catch (error) {
      throw new Error(getErrorMessage(error, 'Could not reject booking'));
    }
  },

  /**
   * PATCH /api/bookings/:id/complete - Worker marks accepted booking as complete
   */
  async completeBooking(bookingId: string): Promise<Booking> {
    try {
      const response = await api.patch<ApiResponse<Booking> | Booking>(`/bookings/${bookingId}/complete`);
      const data = response.data;
      const updated = (data as any)?.data || (data as any)?.booking || data;
      return updated;
    } catch (error) {
      throw new Error(getErrorMessage(error, 'Could not mark booking as complete'));
    }
  },
};

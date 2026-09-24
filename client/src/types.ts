export type UserRole = 'customer' | 'worker' | 'admin';

export interface User {
  _id: string;
  id?: string;
  name: string;
  email: string;
  role: UserRole;
  phone?: string;
  address?: string;
  bio?: string;
  profileImage?: string;
  createdAt?: string;
  updatedAt?: string;
}

export type VerificationStatus = 'pending' | 'approved' | 'rejected';

export interface WorkerProfile {
  _id: string;
  id?: string;
  userId?: User | { _id: string; id?: string; name: string; email: string; role?: string };
  name?: string; // normalized helper when populated
  email?: string; // normalized helper when populated
  phone: string;
  profileImage?: string;
  skills: string[];
  experience: number;
  address: string;
  city: string;
  state: string;
  dailyWage: number;
  aadhaarDocument?: string;
  panDocument?: string;
  verificationStatus: VerificationStatus;
  rejectionReason?: string;
  verifiedAt?: string;
  createdAt?: string;
  updatedAt?: string;
}

// Backwards compatibility alias for Worker
export type Worker = WorkerProfile;

export type BookingStatus =
  | 'pending'
  | 'accepted'
  | 'rejected'
  | 'cancelled'
  | 'completed'
  | 'Pending'
  | 'Accepted'
  | 'Rejected'
  | 'Cancelled'
  | 'Completed';

export interface Booking {
  _id: string;
  id?: string;
  customerId?: User | string;
  customer?: User;
  workerId?: WorkerProfile | string;
  worker?: WorkerProfile;
  service: string;
  bookingDate?: string;
  date?: string; // Normalized fallback
  bookingTime?: string;
  time?: string; // Normalized fallback
  address: string;
  description?: string;
  amount: number;
  paymentStatus?: 'pending' | 'created' | 'paid' | 'failed' | 'refunded';
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
  liveLocation?: {
    latitude: number | null;
    longitude: number | null;
    updatedAt: string | null;
    isSharing: boolean;
  };
  status: BookingStatus;
  createdAt?: string;
  updatedAt?: string;
}

export interface AuthResponse {
  success?: boolean;
  message?: string;
  token?: string;
  accessToken?: string;
  user?: User;
  data?: {
    token?: string;
    user?: User;
  };
}

export interface AdminStats {
  totalUsers: number;
  totalWorkers: number;
  pendingVerifications: number;
  totalBookings: number;
}

export interface ApiResponse<T = any> {
  success?: boolean;
  message?: string;
  data?: T;
}

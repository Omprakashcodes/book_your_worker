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

export interface WorkerReview {
  _id: string;
  rating: number;
  comment: string;
  createdAt?: string;
  customerId?: { name?: string } | null;
  bookingId?: { service?: string } | null;
}

export interface ServiceLocation {
  latitude: number;
  longitude: number;
}

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
  serviceLocation?: ServiceLocation;
  dailyWage: number;
  aadhaarDocument?: string;
  panDocument?: string;
  verificationStatus: VerificationStatus;
  rejectionReason?: string;
  verifiedAt?: string;
  averageRating?: number;
  reviewCount?: number;
  reviews?: WorkerReview[];
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
  baseAmount?: number | null;
  urgencyFee?: number;
  isUrgent?: boolean;
  paymentStatus?: 'pending' | 'created' | 'paid' | 'failed' | 'refunded';
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
  liveLocation?: {
    latitude: number | null;
    longitude: number | null;
    updatedAt: string | null;
    isSharing: boolean;
  };
  arrivalOtpVerifiedAt?: string | null;
  problemPhotos?: Array<{ filename: string; originalName: string; mimeType: string; size: number; uploadedAt?: string }>;
  solutionPhotos?: Array<{ filename: string; originalName: string; mimeType: string; size: number; uploadedAt?: string }>;
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

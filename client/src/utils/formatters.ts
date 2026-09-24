import { API_BASE_URL } from '../services/api';

export const formatCurrency = (amount: number | string | undefined | null): string => {
  if (amount === undefined || amount === null || isNaN(Number(amount))) return '₹0';
  const num = Number(amount);
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(num);
};

export const formatDate = (dateString?: string): string => {
  if (!dateString) return 'N/A';
  try {
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return dateString;
    return d.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  } catch {
    return dateString;
  }
};

export const getInitials = (name?: string): string => {
  if (!name) return 'U';
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
};

export const parseSkills = (skills?: string[] | string): string[] => {
  if (!skills) return [];
  if (Array.isArray(skills)) return skills;
  if (typeof skills === 'string') {
    return skills.split(',').map((s) => s.trim()).filter(Boolean);
  }
  return [];
};

export const getWorkerDisplayName = (worker?: any): string => {
  if (!worker) return 'Professional';
  if (worker.userId && typeof worker.userId === 'object' && worker.userId.name) {
    return worker.userId.name;
  }
  if (worker.name) return worker.name;
  return 'Service Professional';
};

export const getWorkerEmail = (worker?: any): string => {
  if (!worker) return '';
  if (worker.userId && typeof worker.userId === 'object' && worker.userId.email) {
    return worker.userId.email;
  }
  if (worker.email) return worker.email;
  return '';
};

export const getImageUrl = (path?: string): string | undefined => {
  if (!path) return undefined;
  if (path.startsWith('http://') || path.startsWith('https://') || path.startsWith('blob:') || path.startsWith('data:')) {
    return path;
  }
  // Server root base (remove /api from API_BASE_URL if present)
  const serverRoot = API_BASE_URL.replace(/\/api\/?$/, '');
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${serverRoot}${cleanPath}`;
};

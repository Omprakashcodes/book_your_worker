import React from 'react';
import { BookingStatus } from '../types';
import { Clock, CheckCircle2, XCircle, AlertCircle, Ban } from 'lucide-react';

interface StatusBadgeProps {
  status: BookingStatus | string;
  size?: 'sm' | 'md';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, size = 'md' }) => {
  const normalized = (status || '').toLowerCase();

  let colorClasses = 'bg-slate-100 text-slate-700 border-slate-200';
  let Icon = Clock;
  let label = status || 'Unknown';

  switch (normalized) {
    case 'pending':
      colorClasses = 'bg-amber-50 text-amber-700 border-amber-200/80';
      Icon = Clock;
      label = 'Pending';
      break;
    case 'accepted':
      colorClasses = 'bg-blue-50 text-blue-700 border-blue-200/80';
      Icon = CheckCircle2;
      label = 'Accepted';
      break;
    case 'completed':
      colorClasses = 'bg-emerald-50 text-emerald-700 border-emerald-200/80';
      Icon = CheckCircle2;
      label = 'Completed';
      break;
    case 'rejected':
      colorClasses = 'bg-rose-50 text-rose-700 border-rose-200/80';
      Icon = XCircle;
      label = 'Rejected';
      break;
    case 'cancelled':
      colorClasses = 'bg-slate-100 text-slate-600 border-slate-200';
      Icon = Ban;
      label = 'Cancelled';
      break;
    default:
      colorClasses = 'bg-slate-100 text-slate-700 border-slate-200';
      Icon = AlertCircle;
      label = status;
  }

  const sizeClasses =
    size === 'sm'
      ? 'px-2 py-0.5 text-xs gap-1 font-medium'
      : 'px-2.5 py-1 text-xs font-semibold gap-1.5';

  return (
    <span
      className={`inline-flex items-center rounded-full border tracking-wide uppercase ${sizeClasses} ${colorClasses}`}
    >
      <Icon className={size === 'sm' ? 'w-3 h-3' : 'w-3.5 h-3.5'} />
      <span>{label}</span>
    </span>
  );
};

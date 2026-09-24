import React from 'react';

export const WorkerCardSkeleton: React.FC = () => {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-5 flex flex-col justify-between animate-pulse">
      <div>
        <div className="flex items-start gap-4">
          <div className="w-16 h-16 rounded-2xl bg-slate-200 shrink-0" />
          <div className="flex-1 min-w-0 space-y-2">
            <div className="h-5 bg-slate-200 rounded-md w-3/4" />
            <div className="h-4 bg-slate-200 rounded-md w-1/2" />
            <div className="h-4 bg-slate-100 rounded-md w-1/3" />
          </div>
        </div>

        <div className="mt-4 flex flex-wrap gap-1.5">
          <div className="h-6 bg-slate-100 rounded-lg w-16" />
          <div className="h-6 bg-slate-100 rounded-lg w-20" />
          <div className="h-6 bg-slate-100 rounded-lg w-14" />
        </div>
      </div>

      <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
        <div className="h-6 bg-slate-200 rounded-md w-24" />
        <div className="h-9 bg-slate-200 rounded-xl w-28" />
      </div>
    </div>
  );
};

export const BookingRowSkeleton: React.FC = () => {
  return (
    <div className="p-5 sm:p-6 bg-white rounded-xl border border-slate-200/80 animate-pulse space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-slate-200 shrink-0" />
          <div className="space-y-2">
            <div className="h-5 bg-slate-200 rounded w-40" />
            <div className="h-4 bg-slate-100 rounded w-28" />
          </div>
        </div>
        <div className="h-6 bg-slate-200 rounded-full w-24" />
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
        <div className="h-4 bg-slate-100 rounded w-full" />
        <div className="h-4 bg-slate-100 rounded w-full" />
        <div className="h-4 bg-slate-100 rounded w-full" />
        <div className="h-4 bg-slate-100 rounded w-full" />
      </div>
    </div>
  );
};

export const ProfileSkeleton: React.FC = () => {
  return (
    <div className="max-w-5xl mx-auto px-4 py-8 animate-pulse space-y-8">
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 sm:p-8 flex flex-col md:flex-row gap-6 items-center md:items-start">
        <div className="w-28 h-28 sm:w-36 sm:h-36 rounded-2xl bg-slate-200 shrink-0" />
        <div className="flex-1 space-y-3 text-center md:text-left w-full">
          <div className="h-8 bg-slate-200 rounded-lg w-1/2 mx-auto md:mx-0" />
          <div className="h-5 bg-slate-200 rounded-md w-1/3 mx-auto md:mx-0" />
          <div className="h-4 bg-slate-100 rounded-md w-2/3 mx-auto md:mx-0" />
          <div className="pt-3 flex flex-wrap gap-2 justify-center md:justify-start">
            <div className="h-7 bg-slate-100 rounded-lg w-20" />
            <div className="h-7 bg-slate-100 rounded-lg w-24" />
          </div>
        </div>
      </div>
    </div>
  );
};

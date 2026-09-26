import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { adminService } from '../services/adminService';
import { WorkerProfile } from '../types';
import {
  Users,
  Briefcase,
  Clock,
  CheckCircle2,
  XCircle,
  ArrowRight,
  RefreshCw,
  FileCheck,
  Star,
} from 'lucide-react';
import { ErrorState } from '../components/ErrorState';

export const AdminDashboard: React.FC = () => {
  const [workers, setWorkers] = useState<WorkerProfile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reviewSummary, setReviewSummary] = useState<{ count: number; averageRating: number; recent: any[] }>({ count: 0, averageRating: 0, recent: [] });

  const fetchWorkers = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const [data, reviews] = await Promise.all([
        adminService.getAllWorkers(),
        adminService.getReviewSummary(),
      ]);
      setWorkers(data);
      setReviewSummary(reviews);
    } catch (err: unknown) {
      setError(
        err instanceof Error
          ? err.message
          : 'Could not fetch admin dashboard data'
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchWorkers();
  }, []);

  const totalWorkers = workers.length;

  const pendingVerifications = workers.filter(
    (worker) => worker.verificationStatus === 'pending'
  ).length;

  const approvedWorkers = workers.filter(
    (worker) => worker.verificationStatus === 'approved'
  ).length;

  const rejectedWorkers = workers.filter(
    (worker) => worker.verificationStatus === 'rejected'
  ).length;

  return (
    <div className="min-h-screen bg-slate-50/50 py-8 sm:py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200">
                Administration Central
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 font-heading">
              Platform Administration
            </h1>

            <p className="text-sm text-slate-500 mt-1">
              Manage worker verification and monitor the service professional registry.
            </p>
          </div>

          <button
            type="button"
            onClick={fetchWorkers}
            disabled={isLoading}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl transition-colors cursor-pointer disabled:opacity-50"
          >
            <RefreshCw
              className={`w-3.5 h-3.5 ${
                isLoading ? 'animate-spin' : ''
              }`}
            />
            <span>Refresh Data</span>
          </button>
        </div>

        {/* Error */}
        {error && (
          <ErrorState
            title="Failed to Load Admin Data"
            message={error}
            onRetry={fetchWorkers}
          />
        )}

        {/* Pending Alert */}
        {!error && pendingVerifications > 0 && (
          <div className="bg-amber-500 text-white rounded-2xl p-5 sm:p-6 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
                <Clock className="w-5 h-5 text-white" />
              </div>

              <div>
                <h3 className="text-base font-bold font-heading">
                  Action Required: {pendingVerifications}{' '}
                  {pendingVerifications === 1
                    ? 'Worker Verification'
                    : 'Worker Verifications'}{' '}
                  Pending
                </h3>

                <p className="text-xs text-amber-100 mt-0.5">
                  Review submitted KYC documents before workers appear in the marketplace.
                </p>
              </div>
            </div>

            <Link
              to="/admin/workers?status=pending"
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-amber-900 bg-white hover:bg-amber-50 rounded-xl transition-colors shrink-0 shadow-xs"
            >
              <span>Review Queue</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        )}

        {/* KPI Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">

          {/* Total Workers */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/90 hover:border-slate-300 transition-colors">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Total Workers
              </span>
              <Briefcase className="w-5 h-5 text-blue-600" />
            </div>

            <p className="text-3xl font-extrabold text-slate-900 font-heading">
              {isLoading ? '...' : totalWorkers}
            </p>

            <p className="text-[11px] text-slate-500 mt-1">
              Worker profiles in the system
            </p>
          </div>

          {/* Pending KYC */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/90 hover:border-slate-300 transition-colors">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Pending KYC
              </span>
              <Clock className="w-5 h-5 text-amber-600" />
            </div>

            <p className="text-3xl font-extrabold text-slate-900 font-heading">
              {isLoading ? '...' : pendingVerifications}
            </p>

            <p className="text-[11px] text-slate-500 mt-1">
              Awaiting admin review
            </p>
          </div>

          {/* Approved */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/90 hover:border-slate-300 transition-colors">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Approved
              </span>
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            </div>

            <p className="text-3xl font-extrabold text-slate-900 font-heading">
              {isLoading ? '...' : approvedWorkers}
            </p>

            <p className="text-[11px] text-slate-500 mt-1">
              Verified professionals
            </p>
          </div>

          {/* Rejected */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/90 hover:border-slate-300 transition-colors">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Rejected
              </span>
              <XCircle className="w-5 h-5 text-rose-600" />
            </div>

            <p className="text-3xl font-extrabold text-slate-900 font-heading">
              {isLoading ? '...' : rejectedWorkers}
            </p>

            <p className="text-[11px] text-slate-500 mt-1">
              Verification rejected
            </p>
          </div>
        </div>

        {/* Administrative Modules */}
        <div>
          <h2 className="text-lg font-bold text-slate-900 font-heading mb-4">
            Administrative Modules
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            {/* Verification Queue */}
            <Link
              to="/admin/workers?status=pending"
              className="group bg-white p-6 rounded-2xl border border-slate-200/90 hover:border-indigo-600 hover:shadow-xs transition-all flex flex-col justify-between"
            >
              <div>
                <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                  <FileCheck className="w-5 h-5" />
                </div>

                <h3 className="text-base font-bold text-slate-900 font-heading group-hover:text-indigo-600 transition-colors">
                  Verification Queue
                </h3>

                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  Review submitted Aadhaar and PAN documents, verify identities,
                  and approve or reject worker profiles.
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-indigo-600">
                <span>
                  {isLoading ? '...' : pendingVerifications} Pending Review
                </span>

                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>

            {/* Worker Directory */}
            <Link
              to="/admin/workers"
              className="group bg-white p-6 rounded-2xl border border-slate-200/90 hover:border-indigo-600 hover:shadow-xs transition-all flex flex-col justify-between"
            >
              <div>
                <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                  <Briefcase className="w-5 h-5" />
                </div>

                <h3 className="text-base font-bold text-slate-900 font-heading group-hover:text-indigo-600 transition-colors">
                  Worker Directory
                </h3>

                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  Inspect worker profiles, filter verification status,
                  and review submitted KYC documents.
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-indigo-600">
                <span>
                  Manage {isLoading ? '...' : totalWorkers} Professionals
                </span>

                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          </div>
        </div>

        <section aria-labelledby="feedback-heading" className="border-t border-slate-200 pt-6">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <h2 id="feedback-heading" className="text-lg font-bold text-slate-900 font-heading">Customer feedback</h2>
              <p className="mt-1 text-xs text-slate-500">Ratings submitted for completed bookings.</p>
            </div>
            <div className="flex items-center gap-2 text-sm font-semibold text-amber-700" aria-label={`${reviewSummary.averageRating.toFixed(1)} average rating from ${reviewSummary.count} reviews`}>
              <Star className="h-4 w-4 fill-current" />
              <span>{reviewSummary.averageRating.toFixed(1)} average</span>
              <span className="font-normal text-slate-500">({reviewSummary.count})</span>
            </div>
          </div>
          {reviewSummary.recent.length === 0 ? (
            <p className="mt-4 border-y border-slate-200 py-4 text-sm text-slate-500">No customer feedback yet.</p>
          ) : (
            <div className="mt-4 divide-y divide-slate-200 border-y border-slate-200">
              {reviewSummary.recent.map((review) => (
                <article key={review._id} className="grid grid-cols-1 gap-2 py-4 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-start">
                  <div>
                    <p className="text-sm font-semibold text-slate-900">
                      {review.workerId?.userId?.name || 'Worker'}
                      <span className="font-normal text-slate-500"> · {review.customerId?.name || 'Customer'}</span>
                    </p>
                    {review.comment && <p className="mt-1 text-sm text-slate-600">{review.comment}</p>}
                    <p className="mt-1 text-[11px] text-slate-400">{review.createdAt ? new Date(review.createdAt).toLocaleDateString() : ''}</p>
                  </div>
                  <span className="inline-flex items-center gap-1 text-sm font-semibold text-amber-700">
                    <Star className="h-4 w-4 fill-current" /> {review.rating}/5
                  </span>
                </article>
              ))}
            </div>
          )}
        </section>

        {/* Empty State */}
        {!isLoading && !error && totalWorkers === 0 && (
          <div className="p-6 rounded-2xl bg-white border border-dashed border-slate-300 text-center space-y-2">
            <Users className="w-8 h-8 text-indigo-600 mx-auto" />

            <h4 className="text-sm font-bold text-slate-900">
              No Workers Found
            </h4>

            <p className="text-xs text-slate-500 max-w-md mx-auto">
              Worker profiles will appear here once they complete their
              registration and worker profile setup.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
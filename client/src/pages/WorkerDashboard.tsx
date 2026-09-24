import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { WorkerProfile, Booking } from '../types';
import { workerService } from '../services/workerService';
import { bookingService } from '../services/bookingService';
import { BookingRow } from '../components/BookingRow';
import {
  ShieldCheck,
  Clock,
  CheckCircle2,
  XCircle,
  Briefcase,
  AlertTriangle,
  ArrowRight,
  RefreshCw,
  FileCheck,
  UserCheck,
  DollarSign,
  MapPin,
  FileText,
} from 'lucide-react';
import { formatCurrency, getWorkerDisplayName } from '../utils/formatters';

export const WorkerDashboard: React.FC = () => {
  const [profile, setProfile] = useState<WorkerProfile | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [profileData, bookingsData] = await Promise.all([
        workerService.getMyWorkerProfile().catch(() => null),
        bookingService.getWorkerBookings().catch(() => []),
      ]);
      setProfile(profileData);
      setBookings(bookingsData || []);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Could not load worker dashboard data');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Derived real stats ONLY from actual bookings
  const stats = useMemo(() => {
    let pending = 0;
    let accepted = 0;
    let completed = 0;
    let rejected = 0;

    bookings.forEach((b) => {
      const s = (b.status || '').toLowerCase();
      if (s === 'pending') pending++;
      else if (s === 'accepted') accepted++;
      else if (s === 'completed') completed++;
      else if (s === 'rejected') rejected++;
    });

    return { pending, accepted, completed, rejected, total: bookings.length };
  }, [bookings]);

  const verificationStatus = profile?.verificationStatus || 'pending';
  const isApproved = verificationStatus === 'approved';
  const isPending = verificationStatus === 'pending';
  const isRejected = verificationStatus === 'rejected';

  const pendingBookings = useMemo(() => {
    return bookings.filter((b) => (b.status || '').toLowerCase() === 'pending').slice(0, 3);
  }, [bookings]);

  return (
    <div className="min-h-screen bg-slate-50/50 py-8 sm:py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">
                Service Provider Portal
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 font-heading">
              Worker Dashboard
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Welcome back{profile ? `, ${getWorkerDisplayName(profile)}` : ''}. Review job requests and account status.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={loadData}
              disabled={isLoading}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl transition-colors cursor-pointer disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
              <span>Refresh</span>
            </button>

            <Link
              to="/worker/profile"
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 rounded-xl shadow-xs transition-colors"
            >
              <span>Profile & Documents</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* 1. Verification Status Banner */}
        {isApproved ? (
          <div className="bg-emerald-50/90 border border-emerald-200 rounded-2xl p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start sm:items-center gap-3.5">
              <div className="w-11 h-11 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-emerald-950 font-heading">
                  Verified Professional Account
                </h3>
                <p className="text-xs text-emerald-800 mt-0.5">
                  Your identity and trade credentials have been approved by administration. Your profile is discoverable in the public marketplace.
                </p>
              </div>
            </div>
            <Link
              to="/worker/profile"
              className="px-4 py-2 text-xs font-bold text-emerald-900 bg-emerald-100/80 hover:bg-emerald-200/80 rounded-xl transition-colors shrink-0 text-center"
            >
              View Verified Profile
            </Link>
          </div>
        ) : isRejected ? (
          <div className="bg-rose-50/90 border border-rose-200 rounded-2xl p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start sm:items-center gap-3.5">
              <div className="w-11 h-11 rounded-xl bg-rose-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                <XCircle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-rose-950 font-heading">
                  Verification Rejected
                </h3>
                <p className="text-xs text-rose-800 mt-0.5">
                  Reason:{' '}
                  <strong className="text-rose-900">
                    {profile?.rejectionReason || 'Documents or profile requirements not met.'}
                  </strong>
                </p>
                <p className="text-xs text-rose-700 mt-1">
                  Please update your trade details and re-upload clear copies of your Aadhaar and PAN documents.
                </p>
              </div>
            </div>
            <Link
              to="/worker/profile"
              className="px-4 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-xl transition-colors shrink-0 text-center shadow-xs"
            >
              Re-upload & Update
            </Link>
          </div>
        ) : (
          <div className="bg-amber-50/90 border border-amber-200 rounded-2xl p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start sm:items-center gap-3.5">
              <div className="w-11 h-11 rounded-xl bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-xs">
                <Clock className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-amber-950 font-heading">
                  Verification Pending Review
                </h3>
                <p className="text-xs text-amber-800 mt-0.5">
                  Your registration and KYC documents are under review by the SERVIGO administrative team.
                  Customers cannot book you until approval is finalized.
                </p>
              </div>
            </div>
            <Link
              to="/worker/profile"
              className="px-4 py-2 text-xs font-bold text-amber-950 bg-amber-200/70 hover:bg-amber-200 rounded-xl transition-colors shrink-0 text-center"
            >
              Check Documents
            </Link>
          </div>
        )}

        {/* 2. Derived Real Booking Stats */}
        <div>
          <h2 className="text-lg font-bold text-slate-900 font-heading mb-4">
            Booking Overview
          </h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            <div className="bg-white p-5 rounded-2xl border border-slate-200/90">
              <div className="flex items-center justify-between text-amber-600 mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Pending Requests
                </span>
                <Clock className="w-4 h-4" />
              </div>
              <p className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-heading">
                {stats.pending}
              </p>
              <p className="text-[11px] text-slate-500 mt-1">Awaiting your acceptance</p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200/90">
              <div className="flex items-center justify-between text-indigo-600 mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Active / Accepted
                </span>
                <Briefcase className="w-4 h-4" />
              </div>
              <p className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-heading">
                {stats.accepted}
              </p>
              <p className="text-[11px] text-slate-500 mt-1">Scheduled appointments</p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200/90">
              <div className="flex items-center justify-between text-emerald-600 mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Completed Jobs
                </span>
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <p className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-heading">
                {stats.completed}
              </p>
              <p className="text-[11px] text-slate-500 mt-1">Successfully delivered</p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200/90">
              <div className="flex items-center justify-between text-rose-600 mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Rejected Jobs
                </span>
                <XCircle className="w-4 h-4" />
              </div>
              <p className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-heading">
                {stats.rejected}
              </p>
              <p className="text-[11px] text-slate-500 mt-1">Declined requests</p>
            </div>
          </div>
        </div>

        {/* 3. Quick Actions & Profile Summary */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile overview card */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/90 space-y-4">
            <h3 className="text-base font-bold text-slate-900 font-heading border-b border-slate-100 pb-3 flex items-center justify-between">
              <span>Trade Profile</span>
              <Link
                to="/worker/profile"
                className="text-xs text-indigo-600 hover:text-indigo-700 font-semibold"
              >
                Edit
              </Link>
            </h3>

            {profile ? (
              <div className="space-y-3 text-xs text-slate-600">
                <div className="flex justify-between">
                  <span className="text-slate-400">Daily Wage:</span>
                  <span className="font-bold text-slate-900">
                    {formatCurrency(profile.dailyWage)}/day
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Experience:</span>
                  <span className="font-bold text-slate-900">{profile.experience} years</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Base City:</span>
                  <span className="font-bold text-slate-900">{profile.city || 'Not set'}</span>
                </div>
                <div>
                  <span className="text-slate-400 block mb-1.5">Registered Skills:</span>
                  <div className="flex flex-wrap gap-1">
                    {profile.skills?.length > 0 ? (
                      profile.skills.map((s, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 font-medium"
                        >
                          {s}
                        </span>
                      ))
                    ) : (
                      <span className="text-rose-500">No skills registered yet</span>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="py-6 text-center space-y-2">
                <AlertTriangle className="w-8 h-8 text-amber-500 mx-auto" />
                <p className="text-xs text-slate-600">
                  Profile not yet configured. Please set up your professional profile to start receiving bookings.
                </p>
                <Link
                  to="/worker/profile"
                  className="inline-block mt-2 px-3 py-1.5 text-xs font-bold text-white bg-indigo-600 rounded-lg"
                >
                  Create Profile
                </Link>
              </div>
            )}
          </div>

          {/* Quick links & KYC checklist */}
          <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200/90 space-y-4">
            <h3 className="text-base font-bold text-slate-900 font-heading border-b border-slate-100 pb-3">
              KYC & Verification Checklist
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 flex items-start gap-3">
                <div
                  className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                    profile?.aadhaarDocument
                      ? 'bg-emerald-100 text-emerald-700'
                      : 'bg-amber-100 text-amber-700'
                  }`}
                >
                  <FileText className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <h4 className="text-xs font-bold text-slate-900">Aadhaar Card Document</h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    {profile?.aadhaarDocument ? 'Uploaded & attached' : 'Pending upload'}
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 flex items-start gap-3">
                <div
                  className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                    profile?.panDocument
                      ? 'bg-emerald-100 text-emerald-700'
                      : 'bg-amber-100 text-amber-700'
                  }`}
                >
                  <FileCheck className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <h4 className="text-xs font-bold text-slate-900">PAN Card Document</h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    {profile?.panDocument ? 'Uploaded & attached' : 'Pending upload'}
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-2 flex flex-wrap items-center justify-between gap-3">
              <span className="text-xs text-slate-500">
                Need to update your KYC documents or trade skills?
              </span>
              <Link
                to="/worker/profile"
                className="inline-flex items-center gap-1 text-xs font-bold text-indigo-600 hover:text-indigo-700"
              >
                <span>Upload Documents</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>

        {/* 4. Recent Incoming Requests Preview */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-6">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="text-base font-bold text-slate-900 font-heading">
                Pending Job Requests ({stats.pending})
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Respond to these requests to secure bookings with customers.
              </p>
            </div>

            <Link
              to="/worker/bookings"
              className="text-xs font-bold text-indigo-600 hover:text-indigo-700 inline-flex items-center gap-1"
            >
              <span>View All ({bookings.length})</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {pendingBookings.length === 0 ? (
            <div className="py-8 text-center border border-dashed border-slate-200 rounded-xl">
              <p className="text-xs text-slate-500">
                No pending job requests awaiting response right now.
              </p>
              <Link
                to="/worker/bookings"
                className="inline-block mt-2 text-xs font-semibold text-indigo-600 hover:underline"
              >
                Review all past and active jobs
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {pendingBookings.map((b) => (
                <BookingRow key={b._id || b.id} booking={b} isWorkerDashboard={true} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

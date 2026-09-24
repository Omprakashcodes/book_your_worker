import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { WorkerProfile as WorkerType } from '../types';
import { workerService } from '../services/workerService';
import { ProfileSkeleton } from '../components/SkeletonLoader';
import { ErrorState } from '../components/ErrorState';
import {
  formatCurrency,
  parseSkills,
  getInitials,
  getWorkerDisplayName,
  getWorkerEmail,
  getImageUrl,
} from '../utils/formatters';
import {
  ShieldCheck,
  MapPin,
  Briefcase,
  ArrowLeft,
  CheckCircle,
  Phone,
  Mail,
  Zap,
  ExternalLink,
} from 'lucide-react';

export const WorkerProfile: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [worker, setWorker] = useState<WorkerType | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProfile = async () => {
    if (!id) return;
    setIsLoading(true);
    setError(null);
    try {
      const data = await workerService.getWorkerById(id);
      setWorker(data);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Could not load worker profile');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, [id]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50/50 py-10">
        <ProfileSkeleton />
      </div>
    );
  }

  if (error || !worker) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center p-4 bg-slate-50/50">
        <ErrorState
          title="Worker Profile Not Found"
          message={error || 'The requested worker could not be found or has not been approved.'}
          onRetry={fetchProfile}
        />
      </div>
    );
  }

  const workerId = worker._id || worker.id || id || '';
  const displayName = getWorkerDisplayName(worker);
  const displayEmail = getWorkerEmail(worker);
  const skillsList = parseSkills(worker.skills);
  const isApproved = worker.verificationStatus === 'approved';
  const imageUrl = getImageUrl(worker.profileImage);
  const workerLocation = [worker.address, worker.city, worker.state]
    .filter(Boolean)
    .join(', ');
  const encodedLocation = encodeURIComponent(workerLocation);
  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodedLocation}`;
  const googleMapsEmbedUrl = `https://www.google.com/maps?q=${encodedLocation}&output=embed`;

  return (
    <div className="min-h-screen bg-slate-50/50 py-8 sm:py-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back navigation */}
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 mb-6 group cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" />
          <span>Back to All Workers</span>
        </button>

        {/* Profile Card & Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Info (Left 2 cols) */}
          <div className="lg:col-span-2 space-y-6">
            {/* Header Box */}
            <div className="bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-8">
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
                <div className="relative shrink-0">
                  {imageUrl ? (
                    <img
                      src={imageUrl}
                      alt={displayName}
                      referrerPolicy="no-referrer"
                      className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl object-cover bg-slate-100 border border-slate-200"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none';
                        const fallback = (e.target as HTMLElement).nextElementSibling;
                        if (fallback) fallback.classList.remove('hidden');
                      }}
                    />
                  ) : null}
                  <div
                    className={`w-24 h-24 sm:w-28 sm:h-28 rounded-2xl bg-gradient-to-br from-indigo-500 to-blue-600 text-white flex items-center justify-center font-bold text-3xl shadow-sm ${
                      imageUrl ? 'hidden' : 'flex'
                    }`}
                  >
                    {getInitials(displayName)}
                  </div>

                  {isApproved && (
                    <div
                      className="absolute -bottom-1 -right-1 bg-emerald-500 text-white p-1 rounded-full ring-3 ring-white"
                      title="Verified Identity & Police Verification"
                    >
                      <ShieldCheck className="w-4 h-4" />
                    </div>
                  )}
                </div>

                <div className="flex-1 text-center sm:text-left min-w-0">
                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                    <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-heading">
                      {displayName}
                    </h1>
                    {isApproved && (
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 inline-flex items-center gap-1">
                        <ShieldCheck className="w-3.5 h-3.5" />
                        <span>Verified Pro</span>
                      </span>
                    )}
                  </div>

                  <div className="mt-2 flex flex-wrap items-center justify-center sm:justify-start gap-y-1.5 gap-x-4 text-xs sm:text-sm text-slate-500">
                    {(worker.city || worker.state) && (
                      <span className="inline-flex items-center gap-1">
                        <MapPin className="w-4 h-4 text-slate-400" />
                        <span>{[worker.city, worker.state].filter(Boolean).join(', ')}</span>
                      </span>
                    )}
                    {worker.experience !== undefined && worker.experience !== null && (
                      <span className="inline-flex items-center gap-1">
                        <Briefcase className="w-4 h-4 text-slate-400" />
                        <span>{worker.experience} years practical experience</span>
                      </span>
                    )}
                  </div>

                  {/* Contact Info Preview if provided */}
                  <div className="mt-4 pt-4 border-t border-slate-100 flex flex-wrap items-center justify-center sm:justify-start gap-4 text-xs text-slate-600">
                    {worker.phone && (
                      <span className="inline-flex items-center gap-1.5 font-medium">
                        <Phone className="w-3.5 h-3.5 text-indigo-600" />
                        <span>{worker.phone}</span>
                      </span>
                    )}
                    {displayEmail && (
                      <span className="inline-flex items-center gap-1.5 font-medium">
                        <Mail className="w-3.5 h-3.5 text-indigo-600" />
                        <span>{displayEmail}</span>
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Skills & Specializations */}
            <div className="bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-8">
              <h2 className="text-lg font-bold text-slate-900 mb-4 font-heading flex items-center gap-2">
                <Zap className="w-5 h-5 text-indigo-600" />
                <span>Specialized Skills & Trade Services</span>
              </h2>
              <div className="flex flex-wrap gap-2">
                {skillsList.map((skill, index) => (
                  <span
                    key={index}
                    className="px-3.5 py-1.5 rounded-xl text-sm font-medium bg-indigo-50 text-indigo-700 border border-indigo-100"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Service & Operational Coverage */}
            <div className="bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-8">
              <h2 className="text-lg font-bold text-slate-900 mb-3 font-heading">
                Location & Coverage
              </h2>
              <p className="text-sm text-slate-600 leading-relaxed mb-4">
                This service professional operates across <strong className="text-slate-900">{worker.city || 'your region'}</strong> and surrounding neighborhoods.
              </p>
              {worker.address && (
                <div className="p-3 bg-slate-50 rounded-xl text-xs text-slate-600">
                  <span className="font-semibold text-slate-700 block mb-0.5">Base Area:</span>
                  {worker.address}, {worker.city}, {worker.state}
                </div>
              )}

              {workerLocation && (
                <div className="mt-4 overflow-hidden rounded-xl border border-slate-200 bg-slate-100">
                  <iframe
                    title={`${displayName} service location`}
                    src={googleMapsEmbedUrl}
                    className="h-64 w-full border-0"
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                  <div className="flex flex-col gap-3 p-3 sm:flex-row sm:items-center sm:justify-between bg-white">
                    <div className="flex items-center gap-2 text-xs text-slate-600">
                      <MapPin className="h-4 w-4 shrink-0 text-indigo-600" />
                      <span>Approximate service area shown</span>
                    </div>
                    <a
                      href={googleMapsUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-indigo-50 px-3 py-2 text-xs font-semibold text-indigo-700 transition-colors hover:bg-indigo-100"
                    >
                      <span>Open in Google Maps</span>
                      <ExternalLink className="h-3.5 w-3.5" />
                    </a>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Sticky Booking Card */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 bg-white rounded-2xl border border-slate-200/90 p-6 shadow-sm space-y-5">
              <div className="border-b border-slate-100 pb-4">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
                  Standard Daily Wage
                </span>
                <div className="flex items-baseline gap-1 mt-1">
                  <span className="text-3xl font-extrabold text-slate-900 font-heading">
                    {formatCurrency(worker.dailyWage)}
                  </span>
                  <span className="text-sm text-slate-500 font-normal">/ day (8 hrs)</span>
                </div>
                <p className="text-[11px] text-slate-500 mt-1">
                  Inclusive of skilled labor. Materials purchased separately upon mutual agreement.
                </p>
              </div>

              <div className="space-y-3 text-xs text-slate-600">
                <div className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>Government-verified Aadhaar & PAN credential checks</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>Direct doorstep dispatch with live booking status tracking</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>Transparent payment directly upon work completion</span>
                </div>
              </div>

              <Link
                to={`/book/${workerId}`}
                className="w-full inline-flex items-center justify-center gap-2 py-3.5 px-4 text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 rounded-xl shadow-xs transition-all cursor-pointer text-center"
              >
                <span>Book This Professional</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

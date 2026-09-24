import React from 'react';
import { Link } from 'react-router-dom';
import { WorkerProfile } from '../types';
import {
  formatCurrency,
  parseSkills,
  getInitials,
  getWorkerDisplayName,
  getImageUrl,
} from '../utils/formatters';
import { ShieldCheck, MapPin, Briefcase, ArrowRight } from 'lucide-react';

interface WorkerCardProps {
  worker: WorkerProfile;
}

export const WorkerCard: React.FC<WorkerCardProps> = ({ worker }) => {
  const workerId = worker._id || worker.id || '';
  const displayName = getWorkerDisplayName(worker);
  const skillsList = parseSkills(worker.skills);
  const isApproved = worker.verificationStatus === 'approved';
  const imageUrl = getImageUrl(worker.profileImage);

  return (
    <div className="group bg-white rounded-2xl border border-slate-200/90 hover:border-indigo-200 hover:shadow-md transition-all duration-200 flex flex-col justify-between overflow-hidden">
      <div className="p-5 sm:p-6">
        {/* Top Header: Image & Basics */}
        <div className="flex items-start gap-4">
          <div className="relative shrink-0">
            {imageUrl ? (
              <img
                src={imageUrl}
                alt={displayName}
                referrerPolicy="no-referrer"
                className="w-16 h-16 rounded-2xl object-cover bg-slate-100 border border-slate-200/80"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                  const fallback = (e.target as HTMLElement).nextElementSibling;
                  if (fallback) fallback.classList.remove('hidden');
                }}
              />
            ) : null}
            <div
              className={`w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-blue-600 text-white flex items-center justify-center font-bold text-xl shadow-xs ${
                imageUrl ? 'hidden' : 'flex'
              }`}
            >
              {getInitials(displayName)}
            </div>

            {isApproved && (
              <div
                className="absolute -bottom-1 -right-1 bg-emerald-500 text-white p-1 rounded-full ring-2 ring-white"
                title="Verified Professional"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
              </div>
            )}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5 flex-wrap">
              <Link
                to={`/workers/${workerId}`}
                className="text-base font-bold text-slate-900 hover:text-indigo-600 transition-colors truncate font-heading"
              >
                {displayName}
              </Link>
            </div>

            {/* Location & Experience */}
            <div className="mt-1 flex flex-wrap items-center gap-y-1 gap-x-3 text-xs text-slate-500">
              {(worker.city || worker.state) && (
                <span className="inline-flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  <span className="truncate">
                    {[worker.city, worker.state].filter(Boolean).join(', ')}
                  </span>
                </span>
              )}
              {worker.experience !== undefined && worker.experience !== null && (
                <span className="inline-flex items-center gap-1">
                  <Briefcase className="w-3.5 h-3.5 text-slate-400" />
                  <span>{worker.experience} yrs exp</span>
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Skills Pills */}
        {skillsList.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-1.5">
            {skillsList.slice(0, 4).map((skill, index) => (
              <span
                key={index}
                className="px-2.5 py-0.5 rounded-lg text-xs font-medium bg-slate-100 text-slate-700"
              >
                {skill}
              </span>
            ))}
            {skillsList.length > 4 && (
              <span className="px-2 py-0.5 rounded-lg text-xs font-medium bg-slate-50 text-slate-500">
                +{skillsList.length - 4} more
              </span>
            )}
          </div>
        )}
      </div>

      {/* Footer / Price & Actions */}
      <div className="px-5 py-3.5 sm:px-6 bg-slate-50/70 border-t border-slate-100 flex items-center justify-between gap-3">
        <div>
          <span className="text-[11px] font-medium text-slate-500 uppercase tracking-wider block">
            Daily Wage
          </span>
          <span className="text-base sm:text-lg font-bold text-slate-900">
            {formatCurrency(worker.dailyWage)}
            <span className="text-xs font-normal text-slate-500">/day</span>
          </span>
        </div>

        <div className="flex items-center gap-2">
          <Link
            to={`/workers/${workerId}`}
            className="px-3 py-1.5 text-xs font-semibold text-slate-700 hover:text-indigo-600 hover:bg-slate-200/60 rounded-xl transition-colors"
          >
            Profile
          </Link>
          <Link
            to={`/book/${workerId}`}
            className="inline-flex items-center gap-1 px-3.5 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 rounded-xl shadow-xs transition-all cursor-pointer"
          >
            <span>Book</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
};

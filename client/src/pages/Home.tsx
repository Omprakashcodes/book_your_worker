import React, { useState, useEffect, useMemo } from 'react';
import { WorkerProfile } from '../types';
import { workerService } from '../services/workerService';
import { WorkerCard } from '../components/WorkerCard';
import { WorkerCardSkeleton } from '../components/SkeletonLoader';
import { EmptyState } from '../components/EmptyState';
import { ErrorState } from '../components/ErrorState';
import { getWorkerDisplayName } from '../utils/formatters';
import {
  Search,
  MapPin,
  ShieldCheck,
  Zap,
  CalendarCheck,
  CheckCircle,
  Wrench,
  Sparkles,
  Paintbrush,
  Hammer,
  Tv,
  Flower2,
  ArrowRight,
  ShieldAlert,
} from 'lucide-react';

const CATEGORIES = [
  { id: 'all', name: 'All Services', icon: Sparkles },
  { id: 'plumbing', name: 'Plumbing', icon: Wrench, keyword: 'Plumb' },
  { id: 'electrical', name: 'Electrical', icon: Zap, keyword: 'Electr' },
  { id: 'cleaning', name: 'Cleaning', icon: Sparkles, keyword: 'Clean' },
  { id: 'painting', name: 'Painting', icon: Paintbrush, keyword: 'Paint' },
  { id: 'carpentry', name: 'Carpentry', icon: Hammer, keyword: 'Carpent' },
  { id: 'appliance', name: 'Appliance Repair', icon: Tv, keyword: 'Appliance' },
  { id: 'gardening', name: 'Gardening', icon: Flower2, keyword: 'Garden' },
];

const CITIES = ['All Locations', 'Bangalore', 'Mumbai', 'Delhi NCR', 'Hyderabad', 'Pune'];

export const Home: React.FC = () => {
  const [workers, setWorkers] = useState<WorkerProfile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCity, setSelectedCity] = useState('All Locations');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const fetchWorkers = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await workerService.getWorkers();
      setWorkers(data);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Could not fetch workers from server');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchWorkers();
  }, []);

  // Filtered workers
  const filteredWorkers = useMemo(() => {
    return workers.filter((worker) => {
      // City filter
      if (selectedCity !== 'All Locations') {
        const workerCity = (worker.city || worker.state || '').toLowerCase();
        if (!workerCity.includes(selectedCity.toLowerCase())) {
          return false;
        }
      }

      // Category filter
      if (selectedCategory !== 'all') {
        const cat = CATEGORIES.find((c) => c.id === selectedCategory);
        if (cat?.keyword) {
          const skillsStr = Array.isArray(worker.skills)
            ? worker.skills.join(' ')
            : String(worker.skills || '');
          if (!skillsStr.toLowerCase().includes(cat.keyword.toLowerCase())) {
            return false;
          }
        }
      }

      // Search query filter (matches name, skills, city, state)
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const displayName = getWorkerDisplayName(worker).toLowerCase();
        const skillsStr = Array.isArray(worker.skills)
          ? worker.skills.join(' ')
          : String(worker.skills || '');
        const skillsMatch = skillsStr.toLowerCase().includes(q);
        const cityMatch = (worker.city || worker.state || '').toLowerCase().includes(q);
        if (!displayName.includes(q) && !skillsMatch && !cityMatch) {
          return false;
        }
      }

      return true;
    });
  }, [workers, selectedCity, selectedCategory, searchQuery]);

  return (
    <div className="min-h-screen bg-slate-50/50">
      {/* ---------------------------------------------------- */}
      {/* HERO SECTION */}
      {/* ---------------------------------------------------- */}
      <section className="relative pt-12 pb-16 md:pt-20 md:pb-24 overflow-hidden bg-gradient-to-b from-white via-indigo-50/30 to-slate-50 border-b border-slate-200/70">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            {/* Top Verified Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-semibold mb-6 shadow-2xs">
              <ShieldCheck className="w-4 h-4 text-indigo-600" />
              <span>Verified Home Service Professionals On Demand</span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 leading-[1.15] font-heading">
              Trusted Professionals, <br className="hidden sm:block" />
              Right at Your Doorstep.
            </h1>

            <p className="mt-5 text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
              SERVIGO connects you with verified workers for plumbing, electrical, cleaning, painting,
              and carpentry — with transparent daily wages.
            </p>

            {/* Search & Location Bar */}
            <div className="mt-8 sm:mt-10 p-2 sm:p-2.5 bg-white rounded-2xl shadow-lg border border-slate-200 flex flex-col sm:flex-row gap-2">
              <div className="flex-1 flex items-center gap-2.5 px-3 py-1.5 bg-slate-50/80 rounded-xl">
                <Search className="w-4 h-4 text-slate-400 shrink-0" />
                <input
                  type="text"
                  placeholder="Try 'Plumber', 'Electrician', 'Painting'..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full text-sm text-slate-800 placeholder-slate-400 bg-transparent focus:outline-hidden"
                />
              </div>

              <div className="sm:w-52 flex items-center gap-2 px-3 py-1.5 bg-slate-50/80 rounded-xl">
                <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
                <select
                  value={selectedCity}
                  onChange={(e) => setSelectedCity(e.target.value)}
                  className="w-full text-sm text-slate-800 bg-transparent focus:outline-hidden cursor-pointer"
                >
                  {CITIES.map((city) => (
                    <option key={city} value={city}>
                      {city}
                    </option>
                  ))}
                </select>
              </div>

              <a
                href="#workers-section"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 rounded-xl shadow-xs transition-all cursor-pointer shrink-0"
              >
                <span>Find Worker</span>
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>

            {/* Quick Keyword Shortcuts */}
            <div className="mt-4 flex flex-wrap items-center justify-center gap-1.5 text-xs text-slate-500">
              <span className="font-medium text-slate-400">Popular:</span>
              {['Plumbing', 'Wiring', 'Cleaning', 'Carpentry', 'Painting'].map((k) => (
                <button
                  key={k}
                  onClick={() => setSearchQuery(k)}
                  className="px-2.5 py-1 rounded-lg bg-white border border-slate-200/90 hover:border-indigo-300 hover:text-indigo-600 transition-colors cursor-pointer"
                >
                  {k}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------- */}
      {/* POPULAR SERVICE CATEGORIES */}
      {/* ---------------------------------------------------- */}
      <section className="py-12 md:py-16 bg-white border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-3">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 block mb-1">
                Explore Categories
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 font-heading">
                Popular Services
              </h2>
            </div>
            <p className="text-sm text-slate-500 max-w-md">
              Select a category to instantly browse verified workers ready for hire.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3 sm:gap-4">
            {CATEGORIES.map((cat) => {
              const Icon = cat.icon;
              const isSelected = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => {
                    setSelectedCategory(cat.id);
                    const el = document.getElementById('workers-section');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className={`flex flex-col items-center text-center p-3.5 sm:p-4 rounded-xl border transition-all cursor-pointer group ${
                    isSelected
                      ? 'bg-indigo-50/80 border-indigo-300 text-indigo-700 shadow-2xs'
                      : 'bg-white border-slate-200/80 hover:border-indigo-200 hover:bg-slate-50/50 text-slate-700'
                  }`}
                >
                  <div
                    className={`w-11 h-11 rounded-xl flex items-center justify-center mb-2.5 transition-colors ${
                      isSelected
                        ? 'bg-indigo-600 text-white shadow-xs'
                        : 'bg-slate-100 text-slate-600 group-hover:bg-indigo-50 group-hover:text-indigo-600'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-semibold leading-tight line-clamp-1">
                    {cat.name}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------- */}
      {/* FEATURED / VERIFIED WORKERS MARKETPLACE */}
      {/* ---------------------------------------------------- */}
      <section id="workers-section" className="py-14 sm:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">
                Direct Marketplace
              </span>
              <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                Verified Professionals
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 font-heading">
              {selectedCategory === 'all'
                ? 'Available Workers'
                : `${CATEGORIES.find((c) => c.id === selectedCategory)?.name} Specialists`}
            </h2>
          </div>

          {/* Quick filter summary & Reset */}
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <span>
              Showing {filteredWorkers.length} {filteredWorkers.length === 1 ? 'professional' : 'professionals'}
            </span>
            {(selectedCategory !== 'all' || searchQuery || selectedCity !== 'All Locations') && (
              <button
                onClick={() => {
                  setSelectedCategory('all');
                  setSearchQuery('');
                  setSelectedCity('All Locations');
                }}
                className="text-indigo-600 hover:text-indigo-800 font-semibold underline cursor-pointer ml-2"
              >
                Reset Filters
              </button>
            )}
          </div>
        </div>

        {/* Worker Grid or States */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <WorkerCardSkeleton />
            <WorkerCardSkeleton />
            <WorkerCardSkeleton />
            <WorkerCardSkeleton />
            <WorkerCardSkeleton />
            <WorkerCardSkeleton />
          </div>
        ) : error ? (
          <ErrorState
            title="Unable to load workers from server"
            message={error}
            onRetry={fetchWorkers}
          />
        ) : workers.length === 0 ? (
          <EmptyState
            title="No approved service professionals available"
            message="No certified professionals are currently approved in the system. As workers are verified and approved by the administrator, they will appear here."
          />
        ) : filteredWorkers.length === 0 ? (
          <EmptyState
            title="No professionals matched your criteria"
            message="Try broadening your search or choosing a different service category or location."
            actionText="Reset All Filters"
            onActionClick={() => {
              setSelectedCategory('all');
              setSearchQuery('');
              setSelectedCity('All Locations');
            }}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredWorkers.map((worker) => (
              <WorkerCard key={worker._id || worker.id} worker={worker} />
            ))}
          </div>
        )}
      </section>

      {/* ---------------------------------------------------- */}
      {/* HOW IT WORKS */}
      {/* ---------------------------------------------------- */}
      <section id="how-it-works" className="py-14 sm:py-20 bg-slate-100/60 border-t border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 block mb-1">
              Simple & Transparent
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 font-heading">
              How SERVIGO Works
            </h2>
            <p className="mt-2 text-sm sm:text-base text-slate-500">
              Get skilled help at your door in three simple steps.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 text-center flex flex-col items-center">
              <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-lg mb-4">
                1
              </div>
              <h3 className="text-lg font-bold text-slate-900 font-heading">
                Browse & Select
              </h3>
              <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                Explore approved service professionals, compare daily wages, verify trade skills, and view credentials.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 text-center flex flex-col items-center">
              <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-lg mb-4">
                2
              </div>
              <h3 className="text-lg font-bold text-slate-900 font-heading">
                Schedule & Book
              </h3>
              <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                Choose your required date and time slot, specify service address and instructions, and confirm your request.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 text-center flex flex-col items-center">
              <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-lg mb-4">
                3
              </div>
              <h3 className="text-lg font-bold text-slate-900 font-heading">
                Job Execution
              </h3>
              <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                The professional accepts your booking, arrives at your doorstep on time, and completes the work smoothly.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------- */}
      {/* TRUST SECTION */}
      {/* ---------------------------------------------------- */}
      <section className="py-14 sm:py-18 bg-white border-y border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 block mb-1">
              Why SERVIGO
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 font-heading">
              Built on Trust and Real Transparency
            </h2>
            <p className="mt-2 text-sm sm:text-base text-slate-500">
              Direct connection with verified local tradespeople, completely free of middlemen markups.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="flex flex-col items-start p-5 rounded-2xl bg-slate-50/70 border border-slate-200/80">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-4">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 font-heading">
                Verified Professionals
              </h3>
              <p className="mt-1.5 text-xs sm:text-sm text-slate-600 leading-relaxed">
                Every worker profile undergoes manual credential and identity verification before being approved.
              </p>
            </div>

            <div className="flex flex-col items-start p-5 rounded-2xl bg-slate-50/70 border border-slate-200/80">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4">
                <CheckCircle className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 font-heading">
                Fixed Daily Wages
              </h3>
              <p className="mt-1.5 text-xs sm:text-sm text-slate-600 leading-relaxed">
                Transparent daily rates set directly by professionals with zero hidden platform surprise fees.
              </p>
            </div>

            <div className="flex flex-col items-start p-5 rounded-2xl bg-slate-50/70 border border-slate-200/80">
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center mb-4">
                <CalendarCheck className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 font-heading">
                Instant Scheduling
              </h3>
              <p className="mt-1.5 text-xs sm:text-sm text-slate-600 leading-relaxed">
                Pick convenient dates and time windows, with live status updates on your booking dashboard.
              </p>
            </div>

            <div className="flex flex-col items-start p-5 rounded-2xl bg-slate-50/70 border border-slate-200/80">
              <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center mb-4">
                <ShieldAlert className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 font-heading">
                Safe & Regulated
              </h3>
              <p className="mt-1.5 text-xs sm:text-sm text-slate-600 leading-relaxed">
                Strict administrative oversight ensuring standard safety and operational compliance.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

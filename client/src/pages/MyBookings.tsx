import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Booking } from '../types';
import { bookingService } from '../services/bookingService';
import { BookingRow } from '../components/BookingRow';
import { BookingRowSkeleton } from '../components/SkeletonLoader';
import { EmptyState } from '../components/EmptyState';
import { ErrorState } from '../components/ErrorState';
import { ConfirmationModal } from '../components/ConfirmationModal';
import { RefreshCw, ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';

type FilterTab = 'all' | 'pending' | 'accepted' | 'completed' | 'cancelled' | 'rejected';

export const MyBookings: React.FC = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Active filter tab
  const [activeTab, setActiveTab] = useState<FilterTab>('all');

  // Cancel modal state
  const [cancellingBooking, setCancellingBooking] = useState<Booking | null>(null);
  const [isCancelLoading, setIsCancelLoading] = useState(false);

  const fetchBookings = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await bookingService.getMyBookings();
      setBookings(data);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Could not retrieve your bookings');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleCancelConfirm = async () => {
    if (!cancellingBooking) return;
    const bookingId = cancellingBooking._id || cancellingBooking.id;
    if (!bookingId) return;

    setIsCancelLoading(true);
    try {
      await bookingService.cancelBooking(bookingId);
      toast.success('Booking cancelled successfully');

      // Update local state without full page reload
      setBookings((prev) =>
        prev.map((b) =>
          b._id === bookingId || b.id === bookingId ? { ...b, status: 'cancelled' } : b
        )
      );
      setCancellingBooking(null);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to cancel booking';
      toast.error(msg);
    } finally {
      setIsCancelLoading(false);
    }
  };

  // Filtered list
  const filteredBookings = useMemo(() => {
    if (activeTab === 'all') return bookings;
    return bookings.filter(
      (b) => (b.status || '').toLowerCase() === activeTab.toLowerCase()
    );
  }, [bookings, activeTab]);

  // Tab counts
  const counts = useMemo(() => {
    const res = { all: bookings.length, pending: 0, accepted: 0, completed: 0, cancelled: 0, rejected: 0 };
    bookings.forEach((b) => {
      const s = (b.status || '').toLowerCase();
      if (s === 'pending') res.pending++;
      else if (s === 'accepted') res.accepted++;
      else if (s === 'completed') res.completed++;
      else if (s === 'cancelled') res.cancelled++;
      else if (s === 'rejected') res.rejected++;
    });
    return res;
  }, [bookings]);

  return (
    <div className="min-h-screen bg-slate-50/50 py-8 sm:py-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 font-heading">
              My Bookings
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Track and manage your scheduled doorstep service orders.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={fetchBookings}
              disabled={isLoading}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl transition-colors cursor-pointer disabled:opacity-50"
              title="Refresh bookings"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
              <span>Refresh</span>
            </button>

            <Link
              to="/#workers-section"
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 rounded-xl shadow-xs transition-colors"
            >
              <span>Book New Worker</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Filter Navigation Tabs */}
        <div className="mt-6 flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none">
          {[
            { id: 'all', label: 'All Orders', count: counts.all },
            { id: 'pending', label: 'Pending', count: counts.pending },
            { id: 'accepted', label: 'Accepted', count: counts.accepted },
            { id: 'completed', label: 'Completed', count: counts.completed },
            { id: 'rejected', label: 'Rejected', count: counts.rejected },
            { id: 'cancelled', label: 'Cancelled', count: counts.cancelled },
          ].map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as FilterTab)}
                className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  isActive
                    ? 'bg-slate-900 text-white shadow-2xs'
                    : 'bg-white text-slate-600 hover:text-slate-900 hover:bg-slate-100/80 border border-slate-200/90'
                }`}
              >
                <span>{tab.label}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${
                    isActive
                      ? 'bg-white/20 text-white'
                      : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Content Section */}
        <div className="mt-6">
          {isLoading ? (
            <div className="space-y-4">
              <BookingRowSkeleton />
              <BookingRowSkeleton />
              <BookingRowSkeleton />
            </div>
          ) : error ? (
            <ErrorState
              title="Unable to load your orders"
              message={error}
              onRetry={fetchBookings}
            />
          ) : filteredBookings.length === 0 ? (
            <EmptyState
              title={
                activeTab === 'all'
                  ? 'No service bookings placed yet'
                  : `No ${activeTab} bookings found`
              }
              message={
                activeTab === 'all'
                  ? 'You have not scheduled any service requests yet. Browse our verified tradespeople to get started.'
                  : `You do not have any orders currently marked as ${activeTab}.`
              }
              actionText="Explore Workers"
              actionLink="/#workers-section"
            />
          ) : (
            <div className="space-y-4">
              {filteredBookings.map((booking) => (
                <BookingRow
                  key={booking._id || booking.id}
                  booking={booking}
                  onCancelClick={(b) => setCancellingBooking(b)}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Confirmation Modal for Cancellation */}
      <ConfirmationModal
        isOpen={!!cancellingBooking}
        title="Cancel Service Booking?"
        message={`Are you sure you want to cancel booking #${
          cancellingBooking?._id?.slice(-8) || cancellingBooking?.id?.slice(-8)
        }? This will withdraw your request and notify the assigned professional.`}
        confirmText="Yes, Cancel Booking"
        cancelText="Keep Booking"
        confirmVariant="danger"
        isLoading={isCancelLoading}
        onConfirm={handleCancelConfirm}
        onCancel={() => setCancellingBooking(null)}
      />
    </div>
  );
};

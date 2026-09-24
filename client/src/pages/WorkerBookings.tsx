import React, { useState, useEffect, useMemo } from 'react';
import { Booking } from '../types';
import { bookingService } from '../services/bookingService';
import { BookingRow } from '../components/BookingRow';
import { BookingRowSkeleton } from '../components/SkeletonLoader';
import { EmptyState } from '../components/EmptyState';
import { ErrorState } from '../components/ErrorState';
import { ConfirmationModal } from '../components/ConfirmationModal';
import { Briefcase, RefreshCw } from 'lucide-react';
import toast from 'react-hot-toast';

type FilterTab = 'all' | 'pending' | 'accepted' | 'completed' | 'rejected';

export const WorkerBookings: React.FC = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<FilterTab>('all');

  // Active action modal
  const [pendingAction, setPendingAction] = useState<{
    type: 'accept' | 'reject' | 'complete';
    booking: Booking;
  } | null>(null);
  const [isActionLoading, setIsActionLoading] = useState(false);

  const fetchWorkerBookings = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await bookingService.getWorkerBookings();
      setBookings(data);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Could not fetch worker bookings');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchWorkerBookings();
  }, []);

  const handleActionConfirm = async () => {
    if (!pendingAction) return;
    const { type, booking } = pendingAction;
    const bookingId = booking._id || booking.id;
    if (!bookingId) return;

    setIsActionLoading(true);
    try {
      if (type === 'accept') {
        await bookingService.acceptBooking(bookingId);
        toast.success('Job request accepted successfully!');
        setBookings((prev) =>
          prev.map((b) =>
            b._id === bookingId || b.id === bookingId ? { ...b, status: 'accepted' } : b
          )
        );
      } else if (type === 'reject') {
        await bookingService.rejectBooking(bookingId);
        toast.success('Job request rejected');
        setBookings((prev) =>
          prev.map((b) =>
            b._id === bookingId || b.id === bookingId ? { ...b, status: 'rejected' } : b
          )
        );
      } else if (type === 'complete') {
        await bookingService.completeBooking(bookingId);
        toast.success('Service marked as completed!');
        setBookings((prev) =>
          prev.map((b) =>
            b._id === bookingId || b.id === bookingId ? { ...b, status: 'completed' } : b
          )
        );
      }
      setPendingAction(null);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : `Failed to ${type} booking`;
      toast.error(msg);
    } finally {
      setIsActionLoading(false);
    }
  };

  const filteredBookings = useMemo(() => {
    if (activeTab === 'all') return bookings;
    return bookings.filter(
      (b) => (b.status || '').toLowerCase() === activeTab.toLowerCase()
    );
  }, [bookings, activeTab]);

  const counts = useMemo(() => {
    const res = { all: bookings.length, pending: 0, accepted: 0, completed: 0, rejected: 0 };
    bookings.forEach((b) => {
      const s = (b.status || '').toLowerCase();
      if (s === 'pending') res.pending++;
      else if (s === 'accepted') res.accepted++;
      else if (s === 'completed') res.completed++;
      else if (s === 'rejected') res.rejected++;
    });
    return res;
  }, [bookings]);

  return (
    <div className="min-h-screen bg-slate-50/50 py-8 sm:py-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200">
                Worker Portal
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 font-heading">
              Incoming Job Requests
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Manage appointments requested by customers and update status upon fulfillment.
            </p>
          </div>

          <div>
            <button
              type="button"
              onClick={fetchWorkerBookings}
              disabled={isLoading}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl transition-colors cursor-pointer disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
              <span>Refresh Requests</span>
            </button>
          </div>
        </div>

        {/* Filter Navigation Tabs */}
        <div className="mt-6 flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none">
          {[
            { id: 'all', label: 'All Jobs', count: counts.all },
            { id: 'pending', label: 'Pending Review', count: counts.pending },
            { id: 'accepted', label: 'Active / Accepted', count: counts.accepted },
            { id: 'completed', label: 'Completed', count: counts.completed },
            { id: 'rejected', label: 'Rejected', count: counts.rejected },
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

        {/* Requests List */}
        <div className="mt-6 space-y-4">
          {isLoading ? (
            <div className="space-y-4">
              <BookingRowSkeleton />
              <BookingRowSkeleton />
            </div>
          ) : error ? (
            <ErrorState
              title="Unable to load worker requests"
              message={error}
              onRetry={fetchWorkerBookings}
            />
          ) : filteredBookings.length === 0 ? (
            <EmptyState
              title={activeTab === 'all' ? 'No incoming job requests' : `No ${activeTab} jobs`}
              message={
                activeTab === 'all'
                  ? 'New customer bookings for your trade services will appear here.'
                  : `You have no job orders currently in '${activeTab}' status.`
              }
              icon={Briefcase}
            />
          ) : (
            <div className="space-y-3.5">
              {filteredBookings.map((booking) => (
                <BookingRow
                  key={booking._id || booking.id}
                  booking={booking}
                  isWorkerDashboard={true}
                  onAcceptClick={(b) => setPendingAction({ type: 'accept', booking: b })}
                  onRejectClick={(b) => setPendingAction({ type: 'reject', booking: b })}
                  onCompleteClick={(b) => setPendingAction({ type: 'complete', booking: b })}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Action Modal */}
      {pendingAction && (
        <ConfirmationModal
          isOpen={true}
          title={
            pendingAction.type === 'accept'
              ? 'Accept Service Job?'
              : pendingAction.type === 'reject'
              ? 'Decline Service Job?'
              : 'Complete Service Job?'
          }
          message={
            pendingAction.type === 'accept'
              ? `Confirm acceptance of job #${pendingAction.booking._id?.slice(-8) || pendingAction.booking.id?.slice(-8)} for ${pendingAction.booking.service}. Customer will be notified.`
              : pendingAction.type === 'reject'
              ? `Are you sure you want to decline job #${pendingAction.booking._id?.slice(-8) || pendingAction.booking.id?.slice(-8)}? The customer will receive an alert to choose another professional.`
              : `Confirm that you have completed this service request for the customer.`
          }
          confirmText={
            pendingAction.type === 'accept'
              ? 'Accept Job'
              : pendingAction.type === 'reject'
              ? 'Decline Job'
              : 'Mark Complete'
          }
          cancelText="Cancel"
          confirmVariant={pendingAction.type === 'reject' ? 'danger' : 'primary'}
          isLoading={isActionLoading}
          onConfirm={handleActionConfirm}
          onCancel={() => setPendingAction(null)}
        />
      )}
    </div>
  );
};

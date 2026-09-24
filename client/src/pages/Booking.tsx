import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { WorkerProfile } from '../types';
import { workerService } from '../services/workerService';
import { bookingService } from '../services/bookingService';
import {
  formatCurrency,
  parseSkills,
  getInitials,
  getWorkerDisplayName,
  getImageUrl,
} from '../utils/formatters';
import { ErrorState } from '../components/ErrorState';
import {
  ShieldCheck,
  Calendar,
  Clock,
  MapPin,
  FileText,
  Loader2,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  Briefcase,
} from 'lucide-react';
import toast from 'react-hot-toast';

declare global {
  interface Window {
    Razorpay: new (options: Record<string, unknown>) => { open: () => void };
  }
}

const TIME_SLOTS = [
  '08:00 AM - 10:00 AM',
  '10:00 AM - 12:00 PM',
  '12:00 PM - 02:00 PM',
  '02:00 PM - 04:00 PM',
  '04:00 PM - 06:00 PM',
];

const loadRazorpay = (): Promise<void> =>
  new Promise((resolve, reject) => {
    if (window.Razorpay) {
      resolve();
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('Razorpay checkout could not be loaded'));
    document.body.appendChild(script);
  });

export const Booking: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [worker, setWorker] = useState<WorkerProfile | null>(null);
  const [isLoadingWorker, setIsLoadingWorker] = useState(true);
  const [workerError, setWorkerError] = useState<string | null>(null);

  // Form states
  const [service, setService] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState(TIME_SLOTS[1]);
  const [address, setAddress] = useState('');
  const [description, setDescription] = useState('');

  // Submit states
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  useEffect(() => {
    const loadWorker = async () => {
      if (!id) return;
      setIsLoadingWorker(true);
      try {
        const data = await workerService.getWorkerById(id);
        setWorker(data);
        const skills = parseSkills(data.skills);
        if (skills.length > 0) {
          setService(skills[0]);
        } else {
          setService('General Home Service');
        }
      } catch (err: unknown) {
        setWorkerError(err instanceof Error ? err.message : 'Worker details could not be loaded');
      } finally {
        setIsLoadingWorker(false);
      }
    };

    loadWorker();

    // Default booking date to tomorrow
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const yyyy = tomorrow.getFullYear();
    const mm = String(tomorrow.getMonth() + 1).padStart(2, '0');
    const dd = String(tomorrow.getDate()).padStart(2, '0');
    setDate(`${yyyy}-${mm}-${dd}`);
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);

    if (!service.trim()) {
      setValidationError('Please select or specify the required service.');
      return;
    }
    if (!date) {
      setValidationError('Please choose a preferred booking date.');
      return;
    }
    if (!time) {
      setValidationError('Please select a time slot.');
      return;
    }
    if (!address.trim() || address.trim().length < 8) {
      setValidationError('Please provide a complete service address (house/flat no, street, city).');
      return;
    }

    if (!worker) return;

    setIsSubmitting(true);
    try {
      const workerId = worker._id || worker.id || id || '';
      const booking = await bookingService.createBooking({
        workerId,
        service: service.trim(),
        bookingDate: date,
        bookingTime: time,
        date,
        time,
        address: address.trim(),
        description: description.trim() || undefined,
        amount: Number(worker.dailyWage) || 750,
      });

      const bookingId = booking._id || booking.id;
      if (!bookingId) {
        throw new Error('Booking was created without an ID');
      }

      const order = await bookingService.createPaymentOrder(bookingId);
      await loadRazorpay();

      const razorpay = new window.Razorpay({
        key: order.keyId,
        amount: order.amount,
        currency: order.currency,
        name: 'BookMyWorker',
        description: `${service.trim()} booking`,
        order_id: order.orderId,
        handler: async (response: Record<string, string>) => {
          try {
            await bookingService.verifyPayment(bookingId, {
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
            });
            toast.success('Payment verified. Your booking request has been sent.');
            navigate('/my-bookings');
          } catch (error: unknown) {
            const message = error instanceof Error ? error.message : 'Payment verification failed';
            toast.error(message);
            setValidationError(message);
          } finally {
            setIsSubmitting(false);
          }
        },
        modal: {
          ondismiss: () => {
            setIsSubmitting(false);
            toast('Payment cancelled. You can retry from My Bookings.', { icon: '!' });
          },
        },
        theme: { color: '#4f46e5' },
      });

      razorpay.open();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to create booking. Please try again.';
      toast.error(msg);
      setValidationError(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoadingWorker) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center gap-3 bg-slate-50/50">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
        <p className="text-sm text-slate-500 font-medium">Loading checkout summary...</p>
      </div>
    );
  }

  if (workerError || !worker) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center p-4 bg-slate-50/50">
        <ErrorState
          title="Unable to load worker for checkout"
          message={workerError || 'Worker not found'}
        />
      </div>
    );
  }

  const displayName = getWorkerDisplayName(worker);
  const skillsList = parseSkills(worker.skills);
  const isApproved = worker.verificationStatus === 'approved';
  const imageUrl = getImageUrl(worker.profileImage);
  const workerDailyWage = Number(worker.dailyWage) || 750;

  return (
    <div className="min-h-screen bg-slate-50/60 py-8 sm:py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Navigation back */}
        <Link
          to={`/workers/${worker._id || worker.id || id}`}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 mb-6 group"
        >
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" />
          <span>Back to Worker Profile</span>
        </Link>

        {/* Checkout Header */}
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 font-heading">
            Review & Confirm Booking
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Complete your booking schedule and pay securely before your request is sent.
          </p>
        </div>

        {validationError && (
          <div className="mb-6 p-4 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
            <span className="leading-relaxed">{validationError}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left: Booking Details Form (Col 7) */}
            <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-8 space-y-6">
              <div>
                <h2 className="text-lg font-bold text-slate-900 font-heading">
                  1. Service & Schedule
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Select the required job task and your preferred visit timing.
                </p>
              </div>

              {/* Service Selection */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  Required Service
                </label>
                {skillsList.length > 0 ? (
                  <select
                    value={service}
                    onChange={(e) => setService(e.target.value)}
                    className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-indigo-600 focus:outline-hidden transition-colors cursor-pointer"
                  >
                    {skillsList.map((s, idx) => (
                      <option key={idx} value={s}>
                        {s}
                      </option>
                    ))}
                    <option value="General Maintenance / Repair">
                      General Maintenance / Repair
                    </option>
                  </select>
                ) : (
                  <input
                    type="text"
                    required
                    placeholder="e.g. Bathroom pipe leakage fix"
                    value={service}
                    onChange={(e) => setService(e.target.value)}
                    className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-indigo-600 focus:outline-hidden transition-colors"
                  />
                )}
              </div>

              {/* Date & Time Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    <span>Booking Date</span>
                  </label>
                  <input
                    type="date"
                    required
                    value={date}
                    min={new Date().toISOString().split('T')[0]}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-indigo-600 focus:outline-hidden transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <span>Preferred Time Slot</span>
                  </label>
                  <select
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-indigo-600 focus:outline-hidden transition-colors cursor-pointer"
                  >
                    {TIME_SLOTS.map((slot) => (
                      <option key={slot} value={slot}>
                        {slot}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Address Section */}
              <div className="pt-4 border-t border-slate-100">
                <h2 className="text-lg font-bold text-slate-900 font-heading mb-1">
                  2. Service Location
                </h2>
                <p className="text-xs text-slate-500 mb-4">
                  Where should the service professional report for work?
                </p>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    <span>Complete Street Address</span>
                  </label>
                  <textarea
                    required
                    rows={3}
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="House / Flat No., Apartment Name, Street, Landmark, Area, City"
                    className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-indigo-600 focus:outline-hidden transition-colors resize-none"
                  />
                </div>
              </div>

              {/* Additional notes */}
              <div className="pt-4 border-t border-slate-100">
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                  <FileText className="w-3.5 h-3.5 text-slate-400" />
                  <span>Job Notes / Instructions (Optional)</span>
                </label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Provide any specific details regarding tools required, parking, or site access."
                  className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-indigo-600 focus:outline-hidden transition-colors resize-none"
                />
              </div>
            </div>

            {/* Right: Order Summary Card (Col 5) */}
            <div className="lg:col-span-5 space-y-6">
              <div className="bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-7 shadow-xs">
                <h3 className="text-base font-bold text-slate-900 font-heading mb-4 pb-3 border-b border-slate-100">
                  Worker Summary
                </h3>

                {/* Worker Mini Card */}
                <div className="flex items-center gap-3.5 mb-6">
                  <div className="relative shrink-0">
                    {imageUrl ? (
                      <img
                        src={imageUrl}
                        alt={displayName}
                        referrerPolicy="no-referrer"
                        className="w-14 h-14 rounded-xl object-cover bg-slate-100 border border-slate-200"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = 'none';
                          const fallback = (e.target as HTMLElement).nextElementSibling;
                          if (fallback) fallback.classList.remove('hidden');
                        }}
                      />
                    ) : null}
                    <div
                      className={`w-14 h-14 rounded-xl bg-gradient-to-br from-indigo-500 to-blue-600 text-white flex items-center justify-center font-bold text-lg shadow-xs ${
                        imageUrl ? 'hidden' : 'flex'
                      }`}
                    >
                      {getInitials(displayName)}
                    </div>
                    {isApproved && (
                      <div className="absolute -bottom-1 -right-1 bg-emerald-500 text-white p-0.5 rounded-full ring-2 ring-white">
                        <ShieldCheck className="w-3 h-3" />
                      </div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-bold text-slate-900 font-heading truncate">
                      {displayName}
                    </h4>
                    <p className="text-xs text-slate-500 truncate mt-0.5">
                      {[worker.city, worker.state].filter(Boolean).join(', ')}
                    </p>
                    {worker.experience !== undefined && (
                      <div className="mt-1 flex items-center gap-1 text-xs text-slate-500">
                        <Briefcase className="w-3 h-3 text-slate-400" />
                        <span>{worker.experience} yrs exp</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Price Breakdown */}
                <div className="space-y-3 text-sm border-t border-slate-100 pt-4">
                  <div className="flex justify-between text-slate-600">
                    <span>Base Daily Wage (8 hours)</span>
                    <span className="font-semibold text-slate-900">
                      {formatCurrency(workerDailyWage)}
                    </span>
                  </div>

                  <div className="flex justify-between text-slate-600">
                    <span>Platform Booking Fee</span>
                    <span className="font-semibold text-emerald-600">FREE</span>
                  </div>

                  <div className="flex justify-between text-slate-600">
                    <span>Safety & Verification Guarantee</span>
                    <span className="font-semibold text-emerald-600">Included</span>
                  </div>

                  <div className="border-t border-slate-100 pt-3 flex justify-between items-baseline">
                    <span className="text-base font-bold text-slate-900 font-heading">
                      Estimated Total
                    </span>
                    <div className="text-right">
                      <span className="text-2xl font-extrabold text-slate-900 font-heading">
                        {formatCurrency(workerDailyWage)}
                      </span>
                      <span className="block text-[11px] text-slate-400">
                        Pay directly upon job satisfaction
                      </span>
                    </div>
                  </div>
                </div>

                {/* Submit Action */}
                <div className="mt-6 pt-4 border-t border-slate-100">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full flex items-center justify-center gap-2 py-3.5 px-4 text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 rounded-xl shadow-xs transition-all cursor-pointer disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Starting Secure Checkout...</span>
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Confirm & Request Booking</span>
                      </>
                    )}
                  </button>
                </div>

                <div className="mt-4 flex items-center justify-center gap-2 text-[11px] text-slate-400">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>Verified tradesperson • Secure Razorpay checkout</span>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

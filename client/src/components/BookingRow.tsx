import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Booking } from '../types';
import { StatusBadge } from './StatusBadge';
import {
  formatCurrency,
  formatDate,
  getInitials,
  getWorkerDisplayName,
  getImageUrl,
} from '../utils/formatters';
import {
  Calendar,
  Clock,
  MapPin,
  ChevronDown,
  ChevronUp,
  XCircle,
  ExternalLink,
  ShieldCheck,
  CheckCircle,
  X,
  User,
  Navigation,
} from 'lucide-react';
import { bookingService, LiveLocation } from '../services/bookingService';

interface BookingRowProps {
  booking: Booking;
  onCancelClick?: (booking: Booking) => void;
  isWorkerDashboard?: boolean;
  onAcceptClick?: (booking: Booking) => void;
  onRejectClick?: (booking: Booking) => void;
  onCompleteClick?: (booking: Booking) => void;
  isActionLoading?: boolean;
}

export const BookingRow: React.FC<BookingRowProps> = ({
  booking,
  onCancelClick,
  isWorkerDashboard = false,
  onAcceptClick,
  onRejectClick,
  onCompleteClick,
  isActionLoading = false,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isSharingLocation, setIsSharingLocation] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [liveLocation, setLiveLocation] = useState<LiveLocation | null>(null);
  const [isTrackingLocation, setIsTrackingLocation] = useState(false);
  const [customerLocation, setCustomerLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const locationWatchRef = useRef<number | null>(null);

  // Normalize worker object
  const workerObj =
    (typeof booking.workerId === 'object' && booking.workerId !== null ? booking.workerId : null) ||
    (typeof booking.worker === 'object' && booking.worker !== null ? booking.worker : null);

  const workerId =
    workerObj?._id ||
    workerObj?.id ||
    (typeof booking.workerId === 'string' ? booking.workerId : '') ||
    (typeof booking.worker === 'string' ? booking.worker : '');

  const workerName = workerObj ? getWorkerDisplayName(workerObj) : 'Service Professional';
  const workerImage = getImageUrl(workerObj?.profileImage);
  const isWorkerVerified = workerObj?.verificationStatus === 'approved';

  // Customer info if on worker dashboard
  const customerObj =
    (typeof booking.customerId === 'object' && booking.customerId !== null ? booking.customerId : null) ||
    (typeof booking.customer === 'object' && booking.customer !== null ? booking.customer : null);
  const customerName = (customerObj as any)?.name || 'Valued Customer';
  const customerEmail = (customerObj as any)?.email;
  const customerPhone = (customerObj as any)?.phone;

  const normalizedStatus = (booking.status || '').toLowerCase();
  // Backend rule: ONLY allow customer cancellation when status is strictly pending
  const canCancel = normalizedStatus === 'pending';

  const canWorkerAct = normalizedStatus === 'pending';
  const canWorkerComplete = normalizedStatus === 'accepted';

  const bookingDateVal = booking.bookingDate || booking.date;
  const bookingTimeVal = booking.bookingTime || booking.time;
  const bookingId = booking._id || booking.id || '';

  const hasLiveCoordinates = Boolean(
    liveLocation &&
    liveLocation.latitude !== null &&
    liveLocation.longitude !== null
  );

  const distanceInKm = hasLiveCoordinates && customerLocation
    ? (() => {
        const toRadians = (value: number) => (value * Math.PI) / 180;
        const earthRadius = 6371;
        const latitudeDelta = toRadians(customerLocation.latitude - (liveLocation?.latitude || 0));
        const longitudeDelta = toRadians(customerLocation.longitude - (liveLocation?.longitude || 0));
        const latitudeOne = toRadians(liveLocation?.latitude || 0);
        const latitudeTwo = toRadians(customerLocation.latitude);
        const a = Math.sin(latitudeDelta / 2) ** 2 + Math.cos(latitudeOne) * Math.cos(latitudeTwo) * Math.sin(longitudeDelta / 2) ** 2;
        return earthRadius * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      })()
    : null;

  const estimatedMinutes = distanceInKm !== null ? Math.max(1, Math.round((distanceInKm / 25) * 60)) : null;
  const routeUrl = hasLiveCoordinates
    ? `https://www.google.com/maps/dir/?api=1&origin=${liveLocation.latitude},${liveLocation.longitude}&destination=${encodeURIComponent(booking.address)}&travelmode=driving`
    : null;

  useEffect(() => {
    return () => {
      if (locationWatchRef.current !== null) {
        navigator.geolocation?.clearWatch(locationWatchRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (isWorkerDashboard || normalizedStatus !== 'accepted' || !bookingId) return;

    let isMounted = true;
    const loadLocation = async () => {
      try {
        const location = await bookingService.getLiveLocation(bookingId);
        if (isMounted) setLiveLocation(location);
      } catch {
        // Location may not have been shared yet.
      }
    };

    loadLocation();
    const intervalId = isTrackingLocation
      ? window.setInterval(loadLocation, 10000)
      : undefined;
    return () => {
      isMounted = false;
      if (intervalId) window.clearInterval(intervalId);
    };
  }, [bookingId, isTrackingLocation, isWorkerDashboard, normalizedStatus]);

  const startLocationSharing = () => {
    if (!bookingId) return;
    if (!navigator.geolocation) {
      setLocationError('This browser does not support live location.');
      return;
    }

    setLocationError(null);
    setIsSharingLocation(true);
    locationWatchRef.current = navigator.geolocation.watchPosition(
      async (position) => {
        try {
          const location = await bookingService.updateLiveLocation(
            bookingId,
            position.coords.latitude,
            position.coords.longitude
          );
          setLiveLocation(location);
        } catch (error: unknown) {
          setLocationError(error instanceof Error ? error.message : 'Could not share location');
        }
      },
      (error) => {
        setIsSharingLocation(false);
        setLocationError(error.message || 'Location permission is required.');
      },
      { enableHighAccuracy: true, maximumAge: 10000, timeout: 15000 }
    );
  };

  const startTracking = () => {
    setIsTrackingLocation(true);
    setIsExpanded(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => setCustomerLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        }),
        () => setLocationError('Allow location access to calculate your distance from the worker.'),
        { enableHighAccuracy: true, maximumAge: 30000, timeout: 15000 }
      );
    }
  };

  return (
    <div className="bg-white border border-slate-200/90 rounded-xl overflow-hidden transition-colors hover:border-slate-300">
      {/* Top Strip: Order ID & Date */}
      <div className="bg-slate-50/80 px-4 py-2.5 sm:px-6 border-b border-slate-100 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500">
        <div className="flex items-center gap-3">
          <span className="font-semibold text-slate-700">
            Order #{booking._id?.slice(-8) || booking.id?.slice(-8) || 'REF'}
          </span>
          {booking.createdAt && (
            <span className="hidden sm:inline text-slate-400">
              Placed on {formatDate(booking.createdAt)}
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          <StatusBadge status={booking.status} size="sm" />
        </div>
      </div>

      {/* Main Order Content */}
      <div className="p-4 sm:p-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
          {/* Worker / Customer Info & Service */}
          <div className="flex items-start gap-4 flex-1 min-w-0">
            {!isWorkerDashboard ? (
              // Customer view: shows worker details
              <>
                <div className="relative shrink-0">
                  {workerImage ? (
                    <img
                      src={workerImage}
                      alt={workerName}
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
                      workerImage ? 'hidden' : 'flex'
                    }`}
                  >
                    {getInitials(workerName)}
                  </div>
                  {isWorkerVerified && (
                    <div
                      className="absolute -bottom-1 -right-1 bg-emerald-500 text-white p-0.5 rounded-full ring-2 ring-white"
                      title="Verified Worker"
                    >
                      <ShieldCheck className="w-3 h-3" />
                    </div>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-baseline gap-2 flex-wrap">
                    {workerId ? (
                      <Link
                        to={`/workers/${workerId}`}
                        className="text-base font-bold text-slate-900 hover:text-indigo-600 transition-colors font-heading inline-flex items-center gap-1 group"
                      >
                        <span>{workerName}</span>
                        <ExternalLink className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity text-slate-400" />
                      </Link>
                    ) : (
                      <h4 className="text-base font-bold text-slate-900 font-heading">
                        {workerName}
                      </h4>
                    )}
                  </div>

                  <div className="mt-0.5 inline-block px-2 py-0.5 rounded text-xs font-semibold bg-indigo-50 text-indigo-700">
                    {booking.service}
                  </div>

                  <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-600">
                    <span className="inline-flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      <span>{formatDate(bookingDateVal)}</span>
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      <span>{bookingTimeVal || 'Scheduled Window'}</span>
                    </span>
                    <span className="inline-flex items-center gap-1 max-w-xs truncate" title={booking.address}>
                      <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="truncate">{booking.address}</span>
                    </span>
                  </div>
                </div>
              </>
            ) : (
              // Worker view: shows customer booking details
              <>
                <div className="w-14 h-14 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center font-bold text-lg border border-slate-200 shrink-0">
                  <User className="w-6 h-6 text-slate-500" />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h4 className="text-base font-bold text-slate-900 font-heading">
                      {customerName}
                    </h4>
                    <span className="text-xs text-slate-500">
                      {customerPhone && `• ${customerPhone}`}
                    </span>
                  </div>

                  <div className="mt-0.5 inline-block px-2 py-0.5 rounded text-xs font-semibold bg-indigo-50 text-indigo-700">
                    {booking.service}
                  </div>

                  <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-600">
                    <span className="inline-flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      <span>{formatDate(bookingDateVal)}</span>
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      <span>{bookingTimeVal || 'Scheduled Window'}</span>
                    </span>
                    <span className="inline-flex items-center gap-1 max-w-xs truncate" title={booking.address}>
                      <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="truncate">{booking.address}</span>
                    </span>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Amount & Actions */}
          <div className="flex flex-row lg:flex-col items-center lg:items-end justify-between border-t lg:border-t-0 pt-4 lg:pt-0 border-slate-100 gap-3 shrink-0">
            <div className="text-left lg:text-right">
              <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider block">
                Total Price
              </span>
              <span className="text-lg sm:text-xl font-bold text-slate-900 font-heading">
                {formatCurrency(booking.amount)}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setIsExpanded(!isExpanded)}
                className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:text-indigo-600 bg-slate-100 hover:bg-slate-200/70 rounded-lg transition-colors cursor-pointer"
              >
                <span>Details</span>
                {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
              </button>

              {/* Customer Action: Cancel only allowed when pending */}
              {!isWorkerDashboard && canCancel && onCancelClick && (
                <button
                  type="button"
                  disabled={isActionLoading}
                  onClick={() => onCancelClick(booking)}
                  className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-rose-600 hover:text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200/80 rounded-lg transition-colors cursor-pointer disabled:opacity-50"
                >
                  <XCircle className="w-3.5 h-3.5" />
                  <span>Cancel</span>
                </button>
              )}

              {/* Worker Dashboard Actions */}
              {isWorkerDashboard && canWorkerAct && (
                <div className="flex items-center gap-1.5">
                  {onAcceptClick && (
                    <button
                      type="button"
                      disabled={isActionLoading}
                      onClick={() => onAcceptClick(booking)}
                      className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors cursor-pointer disabled:opacity-50"
                    >
                      <CheckCircle className="w-3.5 h-3.5" />
                      <span>Accept</span>
                    </button>
                  )}
                  {onRejectClick && (
                    <button
                      type="button"
                      disabled={isActionLoading}
                      onClick={() => onRejectClick(booking)}
                      className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-rose-600 hover:text-rose-700 bg-rose-50 border border-rose-200 rounded-lg transition-colors cursor-pointer disabled:opacity-50"
                    >
                      <X className="w-3.5 h-3.5" />
                      <span>Reject</span>
                    </button>
                  )}
                </div>
              )}

              {isWorkerDashboard && canWorkerComplete && onCompleteClick && (
                <button
                  type="button"
                  disabled={isActionLoading}
                  onClick={() => onCompleteClick(booking)}
                  className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors cursor-pointer disabled:opacity-50"
                >
                  <CheckCircle className="w-3.5 h-3.5" />
                  <span>Complete</span>
                </button>
              )}

              {isWorkerDashboard && normalizedStatus === 'accepted' && (
                <button
                  type="button"
                  onClick={startLocationSharing}
                  disabled={isSharingLocation}
                  className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors cursor-pointer disabled:opacity-60"
                >
                  <Navigation className="w-3.5 h-3.5" />
                  <span>{isSharingLocation ? 'Sharing Live' : 'Share Live Location'}</span>
                </button>
              )}

              {!isWorkerDashboard && normalizedStatus === 'accepted' && (
                <button
                  type="button"
                  onClick={startTracking}
                  className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 rounded-lg transition-colors cursor-pointer"
                >
                  <Navigation className="w-3.5 h-3.5" />
                  <span>{isTrackingLocation ? 'Tracking Live Worker' : 'Track Live Worker'}</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Expandable Order Details Section */}
        {isExpanded && (
          <div className="mt-4 pt-4 border-t border-slate-100 text-xs text-slate-600 space-y-3 bg-slate-50/50 p-3.5 rounded-xl">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <span className="font-semibold text-slate-700 block mb-1">
                  Full Service Address:
                </span>
                <p className="text-slate-600 leading-relaxed">{booking.address}</p>
              </div>

              {booking.description && (
                <div>
                  <span className="font-semibold text-slate-700 block mb-1">
                    Customer Instructions / Notes:
                  </span>
                  <p className="text-slate-600 italic">"{booking.description}"</p>
                </div>
              )}

              {isWorkerDashboard && customerEmail && (
                <div>
                  <span className="font-semibold text-slate-700 block mb-1">
                    Customer Email:
                  </span>
                  <p className="text-slate-600">{customerEmail}</p>
                </div>
              )}

              {isWorkerDashboard && locationError && (
                <p className="text-rose-600">{locationError}</p>
              )}

              {!isWorkerDashboard && normalizedStatus === 'accepted' && liveLocation?.isSharing && liveLocation.latitude !== null && liveLocation.longitude !== null && (
                <div className="md:col-span-2 overflow-hidden rounded-xl border border-emerald-200 bg-white">
                  <div className="flex items-center gap-2 border-b border-emerald-100 bg-emerald-50 px-3 py-2 text-xs font-semibold text-emerald-800">
                    <Navigation className="h-3.5 w-3.5" />
                    <span>Worker is sharing live location</span>
                  </div>
                  <iframe
                    title="Worker live location"
                    src={`https://www.google.com/maps?q=${liveLocation.latitude},${liveLocation.longitude}&z=15&output=embed`}
                    className="h-64 w-full border-0"
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                  <div className="grid grid-cols-2 gap-2 border-t border-emerald-100 bg-white p-3 text-center">
                    <div>
                      <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">Approx. distance</p>
                      <p className="mt-0.5 text-sm font-bold text-slate-900">
                        {distanceInKm !== null ? `${distanceInKm.toFixed(1)} km` : 'Allow location'}
                      </p>
                    </div>
                    <div>
                      <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">Approx. arrival</p>
                      <p className="mt-0.5 text-sm font-bold text-slate-900">
                        {estimatedMinutes !== null ? `${estimatedMinutes} min` : 'Calculating'}
                      </p>
                    </div>
                  </div>
                  {routeUrl && (
                    <a
                      href={routeUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="mx-3 mb-3 inline-flex items-center justify-center gap-1.5 rounded-lg bg-indigo-600 px-3 py-2 text-xs font-semibold text-white hover:bg-indigo-700"
                    >
                      <ExternalLink className="h-3.5 w-3.5" />
                      <span>Open Route in Google Maps</span>
                    </a>
                  )}
                  <p className="px-3 py-2 text-[11px] text-slate-500">
                    Last updated {liveLocation.updatedAt ? new Date(liveLocation.updatedAt).toLocaleTimeString() : 'just now'}
                  </p>
                </div>
              )}

              {!isWorkerDashboard && normalizedStatus === 'accepted' && !liveLocation?.isSharing && (
                <p className="md:col-span-2 text-slate-500">
                  The worker has not started sharing live location yet.
                </p>
              )}
            </div>

            <div className="pt-2 border-t border-slate-200/60 flex flex-wrap items-center justify-between gap-2 text-slate-500">
              <span>
                Booking ID: <code className="text-slate-700 font-mono">{booking._id || booking.id}</code>
              </span>
              {!isWorkerDashboard && workerId && (
                <Link
                  to={`/workers/${workerId}`}
                  className="text-indigo-600 hover:text-indigo-700 font-semibold inline-flex items-center gap-1"
                >
                  <span>View Worker Profile</span>
                  <ExternalLink className="w-3 h-3" />
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

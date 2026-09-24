import React, { useEffect, useRef, useState } from 'react';
import {
  Bell,
  CheckCheck,
  Info,
  Loader2,
  XCircle,
  CheckCircle2,
  CalendarDays,
  FileCheck2,
  ShieldAlert,
  Wrench,
} from 'lucide-react';
import {
  notificationService,
  Notification,
} from '../../services/notificationService';
import { useAuth } from '../../context/AuthContext';

export const NotificationBell: React.FC = () => {
  const { isAuthenticated } = useAuth();

  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [markingAll, setMarkingAll] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);

  const loadNotifications = async () => {
    if (!isAuthenticated) return;

    try {
      setLoading(true);

      const [items, count] = await Promise.all([
        notificationService.getNotifications(),
        notificationService.getUnreadCount(),
      ]);

      setNotifications(items);
      setUnreadCount(count);
    } catch (error) {
      console.error('Failed to load notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isAuthenticated) {
      setNotifications([]);
      setUnreadCount(0);
      return;
    }

    loadNotifications();

    // Refresh unread notifications periodically.
    const interval = setInterval(() => {
      notificationService
        .getUnreadCount()
        .then((count) => setUnreadCount(count))
        .catch(() => {});
    }, 30000);

    return () => clearInterval(interval);
  }, [isAuthenticated]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleOpen = async () => {
    const nextState = !isOpen;
    setIsOpen(nextState);

    if (nextState) {
      await loadNotifications();
    }
  };

  const handleMarkAsRead = async (notification: Notification) => {
    if (notification.isRead) return;

    try {
      const updated = await notificationService.markAsRead(notification._id);

      setNotifications((current) =>
        current.map((item) =>
          item._id === updated._id ? updated : item
        )
      );

      setUnreadCount((count) => Math.max(0, count - 1));
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
    }
  };

  const handleMarkAllAsRead = async () => {
    if (unreadCount === 0 || markingAll) return;

    try {
      setMarkingAll(true);

      await notificationService.markAllAsRead();

      setNotifications((current) =>
        current.map((notification) => ({
          ...notification,
          isRead: true,
        }))
      );

      setUnreadCount(0);
    } catch (error) {
      console.error('Failed to mark all notifications as read:', error);
    } finally {
      setMarkingAll(false);
    }
  };

  const getNotificationIcon = (type: Notification['type']) => {
    switch (type) {
      case 'welcome':
        return <Wrench className="w-4 h-4" />;

      case 'kyc_submitted':
        return <FileCheck2 className="w-4 h-4" />;

      case 'kyc_approved':
        return <CheckCircle2 className="w-4 h-4" />;

      case 'kyc_rejected':
        return <ShieldAlert className="w-4 h-4" />;

      case 'booking_created':
        return <CalendarDays className="w-4 h-4" />;

      case 'booking_accepted':
        return <CheckCircle2 className="w-4 h-4" />;

      case 'booking_rejected':
      case 'booking_cancelled':
        return <XCircle className="w-4 h-4" />;

      case 'booking_completed':
        return <CheckCircle2 className="w-4 h-4" />;

      default:
        return <Info className="w-4 h-4" />;
    }
  };

  const getNotificationStyle = (type: Notification['type']) => {
    switch (type) {
      case 'kyc_rejected':
      case 'booking_rejected':
      case 'booking_cancelled':
        return 'bg-rose-50 text-rose-600';

      case 'kyc_approved':
      case 'booking_accepted':
      case 'booking_completed':
        return 'bg-emerald-50 text-emerald-600';

      case 'kyc_submitted':
      case 'booking_created':
        return 'bg-amber-50 text-amber-600';

      default:
        return 'bg-indigo-50 text-indigo-600';
    }
  };

  const formatTime = (date: string) => {
    const notificationDate = new Date(date);

    if (Number.isNaN(notificationDate.getTime())) {
      return '';
    }

    return notificationDate.toLocaleString('en-IN', {
      day: 'numeric',
      month: 'short',
      hour: 'numeric',
      minute: '2-digit',
    });
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Notification Button */}
      <button
        type="button"
        onClick={handleOpen}
        aria-label="Notifications"
        className="relative p-2 text-slate-500 hover:text-slate-900 rounded-xl hover:bg-slate-100 transition-colors focus:outline-hidden"
        title="Notifications"
      >
        <Bell className="w-5 h-5 stroke-[1.8]" />

        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 rounded-full bg-rose-500 text-white text-[9px] font-bold flex items-center justify-center border-2 border-white">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {/* Notification Dropdown */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-[360px] max-w-[calc(100vw-2rem)] bg-white rounded-2xl border border-slate-200/90 shadow-2xl z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-100">
          {/* Header */}
          <div className="px-4 py-3.5 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h4 className="text-sm font-bold text-slate-900">
                Notifications
              </h4>

              <p className="text-[10px] text-slate-400 mt-0.5">
                {unreadCount > 0
                  ? `${unreadCount} unread notification${unreadCount > 1 ? 's' : ''}`
                 : "You're all caught up"}
              </p>
            </div>

            {unreadCount > 0 && (
              <button
                type="button"
                onClick={handleMarkAllAsRead}
                disabled={markingAll}
                className="flex items-center gap-1 text-[10px] font-semibold text-indigo-600 hover:text-indigo-700 disabled:opacity-50"
              >
                {markingAll ? (
                  <Loader2 className="w-3 h-3 animate-spin" />
                ) : (
                  <CheckCheck className="w-3 h-3" />
                )}

                Mark all read
              </button>
            )}
          </div>

          {/* Loading */}
          {loading && notifications.length === 0 && (
            <div className="py-10 flex flex-col items-center justify-center">
              <Loader2 className="w-6 h-6 text-indigo-500 animate-spin" />

              <p className="text-xs text-slate-500 mt-2">
                Loading notifications...
              </p>
            </div>
          )}

          {/* Empty */}
          {!loading && notifications.length === 0 && (
            <div className="py-10 px-5 text-center">
              <div className="w-11 h-11 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto">
                <Bell className="w-5 h-5" />
              </div>

              <h5 className="text-xs font-bold text-slate-800 mt-3">
                No notifications yet
              </h5>

              <p className="text-[11px] text-slate-500 leading-relaxed max-w-[240px] mx-auto mt-1">
                Booking updates, verification alerts and important Servigo
                updates will appear here.
              </p>
            </div>
          )}

          {/* Notification List */}
          {notifications.length > 0 && (
            <div className="max-h-[430px] overflow-y-auto">
              {notifications.map((notification) => (
                <button
                  key={notification._id}
                  type="button"
                  onClick={() => handleMarkAsRead(notification)}
                  className={`w-full text-left px-4 py-3.5 border-b border-slate-100 last:border-b-0 transition-colors ${
                    notification.isRead
                      ? 'bg-white hover:bg-slate-50'
                      : 'bg-indigo-50/40 hover:bg-indigo-50/70'
                  }`}
                >
                  <div className="flex gap-3">
                    {/* Icon */}
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${getNotificationStyle(
                        notification.type
                      )}`}
                    >
                      {getNotificationIcon(notification.type)}
                    </div>

                    {/* Content */}
                    <div className="min-w-0 flex-1">
                      <div className="flex items-start gap-2">
                        <h5 className="text-xs font-bold text-slate-800 leading-4 flex-1">
                          {notification.title}
                        </h5>

                        {!notification.isRead && (
                          <span className="w-2 h-2 rounded-full bg-indigo-500 mt-1 shrink-0" />
                        )}
                      </div>

                      <p className="text-[11px] text-slate-500 leading-relaxed mt-1">
                        {notification.message}
                      </p>

                      <p className="text-[9px] text-slate-400 mt-1.5">
                        {formatTime(notification.createdAt)}
                      </p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
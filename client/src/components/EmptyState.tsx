import React from 'react';
import { LucideIcon, Inbox } from 'lucide-react';
import { Link } from 'react-router-dom';

interface EmptyStateProps {
  title: string;
  message: string;
  icon?: LucideIcon;
  actionText?: string;
  actionHref?: string;
  onActionClick?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  message,
  icon: Icon = Inbox,
  actionText,
  actionHref,
  onActionClick,
}) => {
  return (
    <div className="text-center py-12 sm:py-16 px-4 bg-white rounded-2xl border border-dashed border-slate-300 max-w-lg mx-auto">
      <div className="w-14 h-14 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto mb-4">
        <Icon className="w-7 h-7 stroke-[1.75]" />
      </div>
      <h3 className="text-lg font-bold text-slate-900 font-heading">{title}</h3>
      <p className="mt-1.5 text-sm text-slate-500 max-w-sm mx-auto leading-relaxed">
        {message}
      </p>

      {(actionText && actionHref) && (
        <div className="mt-6">
          <Link
            to={actionHref}
            className="inline-flex items-center justify-center px-5 py-2.5 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 rounded-xl shadow-xs transition-colors cursor-pointer"
          >
            {actionText}
          </Link>
        </div>
      )}

      {(actionText && !actionHref && onActionClick) && (
        <div className="mt-6">
          <button
            onClick={onActionClick}
            type="button"
            className="inline-flex items-center justify-center px-5 py-2.5 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 rounded-xl shadow-xs transition-colors cursor-pointer"
          >
            {actionText}
          </button>
        </div>
      )}
    </div>
  );
};

import React from 'react';
import { Link } from 'react-router-dom';
import { Wrench, Home, ArrowLeft } from 'lucide-react';

export const NotFound: React.FC = () => {
  return (
    <div className="min-h-[calc(100vh-10rem)] flex items-center justify-center p-4 bg-slate-50/50">
      <div className="text-center max-w-md mx-auto">
        <div className="w-16 h-16 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto mb-5 shadow-xs">
          <Wrench className="w-8 h-8 stroke-[1.8]" />
        </div>
        <span className="text-xs font-bold uppercase tracking-widest text-indigo-600 mb-1 block">
          404 Error
        </span>
        <h1 className="text-3xl font-extrabold text-slate-900 font-heading">
          Page Not Found
        </h1>
        <p className="mt-2 text-sm text-slate-600 leading-relaxed">
          The marketplace page or worker profile you are looking for does not exist or has moved.
        </p>

        <div className="mt-6 flex items-center justify-center gap-3">
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 rounded-xl shadow-xs transition-colors"
          >
            <Home className="w-4 h-4" />
            <span>Return Home</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

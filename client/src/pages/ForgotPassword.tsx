import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Loader2, Mail, Wrench } from 'lucide-react';
import toast from 'react-hot-toast';
import { authService } from '../services/authService';

export const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    setIsLoading(true);
    try {
      const message = await authService.forgotPassword(email.trim());
      setSubmitted(true);
      toast.success(message);
    } catch (requestError) {
      const message = requestError instanceof Error ? requestError.message : 'Could not send reset email.';
      setError(message);
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-5rem)] flex items-center justify-center p-4 bg-slate-50/50">
      <div className="w-full max-w-md bg-white rounded-2xl border border-slate-200 shadow-xl p-8 sm:p-10">
        <Link to="/login" className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-indigo-600">
          <ArrowLeft className="w-4 h-4" /> Back to login
        </Link>
        <div className="mt-8 flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-indigo-100 flex items-center justify-center">
            <Wrench className="w-5 h-5 text-indigo-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 font-heading">Forgot password?</h1>
            <p className="text-sm text-slate-500 mt-1">We will email you a secure reset link.</p>
          </div>
        </div>

        {submitted ? (
          <div className="mt-8 rounded-xl bg-emerald-50 border border-emerald-200 p-4 text-sm text-emerald-800">
            Check your inbox for the password reset link. The link expires in 15 minutes.
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            {error && <div className="rounded-xl bg-rose-50 border border-rose-200 p-3 text-sm text-rose-700">{error}</div>}
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">Email address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input type="email" required autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="name@example.com" className="w-full pl-10 pr-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-indigo-600 focus:outline-hidden" />
              </div>
            </div>
            <button type="submit" disabled={isLoading} className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl disabled:opacity-50">
              {isLoading ? <><Loader2 className="w-4 h-4 animate-spin" /> Sending...</> : 'Send reset link'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
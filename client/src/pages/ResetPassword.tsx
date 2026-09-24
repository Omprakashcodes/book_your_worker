import React, { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { ArrowLeft, Eye, EyeOff, Loader2, LockKeyhole, Wrench } from 'lucide-react';
import toast from 'react-hot-toast';
import { authService } from '../services/authService';

export const ResetPassword: React.FC = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token') || '';
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(token ? null : 'This reset link is missing or invalid.');

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    setIsLoading(true);
    try {
      const message = await authService.resetPassword(token, password);
      setSuccess(true);
      toast.success(message);
    } catch (requestError) {
      const message = requestError instanceof Error ? requestError.message : 'Could not reset password.';
      setError(message);
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-5rem)] flex items-center justify-center p-4 bg-slate-50/50">
      <div className="w-full max-w-md bg-white rounded-2xl border border-slate-200 shadow-xl p-8 sm:p-10">
        <Link to="/login" className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-indigo-600"><ArrowLeft className="w-4 h-4" /> Back to login</Link>
        <div className="mt-8 flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-indigo-100 flex items-center justify-center"><Wrench className="w-5 h-5 text-indigo-600" /></div>
          <div><h1 className="text-2xl font-bold text-slate-900 font-heading">Set new password</h1><p className="text-sm text-slate-500 mt-1">Choose a new password for your account.</p></div>
        </div>
        {success ? (
          <div className="mt-8 rounded-xl bg-emerald-50 border border-emerald-200 p-4 text-sm text-emerald-800">Your password has been reset. You can now sign in.</div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            {error && <div className="rounded-xl bg-rose-50 border border-rose-200 p-3 text-sm text-rose-700">{error}</div>}
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">New password</label>
              <div className="relative"><LockKeyhole className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" /><input type={showPassword ? 'text' : 'password'} required minLength={6} value={password} onChange={(event) => setPassword(event.target.value)} className="w-full pl-10 pr-10 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-indigo-600 focus:outline-hidden" /><button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" aria-label={showPassword ? 'Hide password' : 'Show password'}>{showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}</button></div>
            </div>
            <div><label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">Confirm password</label><input type={showPassword ? 'text' : 'password'} required minLength={6} value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-indigo-600 focus:outline-hidden" /></div>
            <button type="submit" disabled={isLoading || !token} className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl disabled:opacity-50">{isLoading ? <><Loader2 className="w-4 h-4 animate-spin" /> Updating...</> : 'Reset password'}</button>
          </form>
        )}
        {success && <Link to="/login" className="mt-6 block text-center text-sm font-semibold text-indigo-600 hover:text-indigo-800">Go to login</Link>}
      </div>
    </div>
  );
};
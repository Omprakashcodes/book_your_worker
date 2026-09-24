import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Wrench, Eye, EyeOff, Loader2, ShieldCheck, CheckCircle2, ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';

export const Login: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const from = (location.state as { from?: { pathname: string } })?.from?.pathname || '/';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email.trim() || !password) {
      setError('Please provide both email and password.');
      return;
    }

    setIsLoading(true);
    try {
      const userObj = await login({ email: email.trim(), password });
      toast.success('Welcome back! Successfully logged in.');
      
      const role = userObj?.role;
      if (from === '/' || !from) {
        if (role === 'admin') {
          navigate('/admin/dashboard', { replace: true });
        } else if (role === 'worker') {
          navigate('/worker/dashboard', { replace: true });
        } else {
          navigate('/', { replace: true });
        }
      } else {
        navigate(from, { replace: true });
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Invalid credentials. Please try again.';
      setError(msg);
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-5rem)] flex items-center justify-center p-4 sm:p-6 lg:p-8 bg-slate-50/50">
      <div className="w-full max-w-4xl bg-white rounded-2xl border border-slate-200/90 shadow-xl overflow-hidden grid grid-cols-1 lg:grid-cols-2">
        {/* Left Side: Brand & Value Prop */}
        <div className="bg-indigo-600 text-white p-8 sm:p-12 flex flex-col justify-between relative overflow-hidden">
          <div className="relative z-10">
            <Link to="/" className="inline-flex items-center gap-2.5 text-white mb-8">
              <div className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-md flex items-center justify-center">
                <Wrench className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-extrabold tracking-tight font-heading">
                SERVIGO
              </span>
            </Link>

            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight font-heading leading-tight">
              Access Your Bookings & Service History
            </h2>
            <p className="mt-3 text-indigo-100 text-sm leading-relaxed">
              Sign in to book verified technicians, manage active service orders, and schedule appointments on demand.
            </p>

            <div className="mt-8 space-y-3">
              <div className="flex items-center gap-2.5 text-xs sm:text-sm text-indigo-100">
                <CheckCircle2 className="w-4 h-4 text-indigo-300 shrink-0" />
                <span>Verified workers & transparent daily rates</span>
              </div>
              <div className="flex items-center gap-2.5 text-xs sm:text-sm text-indigo-100">
                <CheckCircle2 className="w-4 h-4 text-indigo-300 shrink-0" />
                <span>Instant status tracking & cancellation control</span>
              </div>
              <div className="flex items-center gap-2.5 text-xs sm:text-sm text-indigo-100">
                <ShieldCheck className="w-4 h-4 text-indigo-300 shrink-0" />
                <span>Secure token authentication</span>
              </div>
            </div>
          </div>

          <div className="relative z-10 pt-8 border-t border-indigo-500/40 text-xs text-indigo-200">
            <span>Fast, reliable doorstep services across top cities.</span>
          </div>

          {/* Decorative background accent */}
          <div className="absolute -bottom-16 -right-16 w-64 h-64 rounded-full bg-indigo-500/30 blur-2xl pointer-events-none" />
        </div>

        {/* Right Side: Login Form */}
        <div className="p-8 sm:p-12 flex flex-col justify-center">
          <div className="mb-6">
            <h3 className="text-2xl font-bold text-slate-900 font-heading">
              Welcome Back
            </h3>
            <p className="text-sm text-slate-500 mt-1">
              Enter your credentials to access your account.
            </p>
          </div>

          {error && (
            <div className="mb-6 p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 leading-relaxed">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Email Address
              </label>
              <input
                type="email"
                required
                autoComplete="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-indigo-600 focus:outline-hidden transition-colors"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">
                  Password
                </label>
                <Link to="/forgot-password" className="text-xs font-semibold text-indigo-600 hover:text-indigo-800">
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  autoComplete="current-password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-2.5 pr-10 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-indigo-600 focus:outline-hidden transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-2 inline-flex items-center justify-center gap-2 px-6 py-3 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 rounded-xl shadow-xs transition-all cursor-pointer disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Signing In...</span>
                </>
              ) : (
                <>
                    <span>Sign In</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 text-center text-xs sm:text-sm text-slate-500">
            <span>Don't have an account? </span>
            <Link
              to="/register"
              className="font-semibold text-indigo-600 hover:text-indigo-800 transition-colors"
            >
              Create an account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

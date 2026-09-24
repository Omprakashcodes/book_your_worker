import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Wrench, Eye, EyeOff, Loader2, User, Briefcase, ArrowRight, ShieldCheck } from 'lucide-react';
import toast from 'react-hot-toast';

export const Register: React.FC = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [role, setRole] = useState<'customer' | 'worker'>('customer');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Worker-specific fields
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('');
  const [skills, setSkills] = useState('');
  const [experience, setExperience] = useState('');
  const [dailyWage, setDailyWage] = useState('');

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name.trim() || !email.trim() || !password) {
      setError('Please fill in all required fields.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    if (role === 'worker' && !dailyWage) {
      setError('Please specify your expected daily wage rate.');
      return;
    }

    setIsLoading(true);
    try {
      const payload: any = {
        name: name.trim(),
        email: email.trim(),
        password,
        role,
      };

      payload.phone = `+91${phone.replace(/\D/g, '').slice(-10)}`;
      if (city.trim()) payload.city = city.trim();

      if (role === 'worker') {
        if (skills.trim()) {
          payload.skills = skills.split(',').map((s) => s.trim()).filter(Boolean);
        }
        if (experience.trim()) {
          payload.experience = Number(experience) || experience;
        }
        if (dailyWage) {
          payload.dailyWage = Number(dailyWage);
        }
      }

      await register(payload);
      toast.success('Account created successfully! Welcome to SERVIGO.');
      if (role === 'worker') {
        navigate('/worker/profile');
      } else {
        navigate('/');
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Registration failed. Please try again.';
      setError(msg);
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-5rem)] flex items-center justify-center p-4 sm:p-6 lg:p-8 bg-slate-50/50">
      <div className="w-full max-w-4xl bg-white rounded-2xl border border-slate-200/90 shadow-xl overflow-hidden grid grid-cols-1 lg:grid-cols-2">
        {/* Left Side: Brand Visual */}
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
              Join the Verified Home Services Network
            </h2>
            <p className="mt-3 text-indigo-100 text-sm leading-relaxed">
              Create an account as a customer to book top-tier professionals, or
              register as a skilled worker to receive direct booking requests.
            </p>

            <div className="mt-8 p-4 rounded-xl bg-white/10 backdrop-blur-md border border-white/15 text-xs text-indigo-100 space-y-2">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-300" />
                <span className="font-semibold text-white">Direct Marketplace Model</span>
              </div>
              <p className="text-indigo-200">
                Transparent daily wages, zero hidden commissions, and direct customer-worker coordination.
              </p>
            </div>
          </div>

          <div className="relative z-10 pt-8 border-t border-indigo-500/40 text-xs text-indigo-200">
            <span>Already have an account? </span>
            <Link to="/login" className="text-white font-semibold underline">
              Sign In
            </Link>
          </div>
        </div>

        {/* Right Side: Registration Form */}
        <div className="p-8 sm:p-10 flex flex-col justify-center">
          <div className="mb-5">
            <h3 className="text-2xl font-bold text-slate-900 font-heading">
              Create an Account
            </h3>
            <p className="text-sm text-slate-500 mt-1">
              Select your role and enter your details to get started.
            </p>
          </div>

          {/* Role Toggle */}
          <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 rounded-xl mb-5">
            <button
              type="button"
              onClick={() => setRole('customer')}
              className={`flex items-center justify-center gap-2 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                role === 'customer'
                  ? 'bg-white text-indigo-600 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <User className="w-3.5 h-3.5" />
              <span>Customer</span>
            </button>
            <button
              type="button"
              onClick={() => setRole('worker')}
              className={`flex items-center justify-center gap-2 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                role === 'worker'
                  ? 'bg-white text-indigo-600 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Briefcase className="w-3.5 h-3.5" />
              <span>Worker / Professional</span>
            </button>
          </div>

          {error && (
            <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3.5">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Full Name
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Ramesh Patel"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-indigo-600 focus:outline-hidden transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Email Address
              </label>
              <input
                type="email"
                required
                autoComplete="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-indigo-600 focus:outline-hidden transition-colors"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    autoComplete="new-password"
                    placeholder="Min 6 chars"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-3.5 py-2 pr-9 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-indigo-600 focus:outline-hidden transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Confirm Password
                </label>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="Repeat password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-indigo-600 focus:outline-hidden transition-colors"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  City / Location
                </label>
                <input
                  type="text"
                  placeholder="e.g. Bangalore"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-indigo-600 focus:outline-hidden transition-colors"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Mobile Number (with country code)
                </label>
                <div className="flex items-center w-full bg-slate-50 border border-slate-200 rounded-xl focus-within:bg-white focus-within:border-indigo-600 transition-colors">
                  <span className="pl-3.5 text-sm font-semibold text-slate-500">+91</span>
                  <input
                    type="tel"
                    required
                    inputMode="numeric"
                    maxLength={10}
                    placeholder="9876543210"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                    className="w-full px-2.5 py-2 text-sm bg-transparent focus:outline-hidden"
                  />
                </div>
              </div>
            </div>

            {/* Worker Specific Fields */}
            {role === 'worker' && (
              <div className="p-3.5 rounded-xl bg-indigo-50/50 border border-indigo-100 space-y-3">
                <span className="text-xs font-bold text-indigo-700 uppercase tracking-wider block">
                  Worker Professional Profile
                </span>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Skills (Comma separated)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Plumbing, Pipe Fitting, Water Tank"
                    value={skills}
                    onChange={(e) => setSkills(e.target.value)}
                    className="w-full px-3 py-1.5 text-sm bg-white border border-slate-200 rounded-lg focus:border-indigo-600 focus:outline-hidden"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Experience (Years)
                    </label>
                    <input
                      type="number"
                      min="0"
                      placeholder="e.g. 5"
                      value={experience}
                      onChange={(e) => setExperience(e.target.value)}
                      className="w-full px-3 py-1.5 text-sm bg-white border border-slate-200 rounded-lg focus:border-indigo-600 focus:outline-hidden"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Daily Wage (₹)
                    </label>
                    <input
                      type="number"
                      min="100"
                      required
                      placeholder="e.g. 750"
                      value={dailyWage}
                      onChange={(e) => setDailyWage(e.target.value)}
                      className="w-full px-3 py-1.5 text-sm bg-white border border-slate-200 rounded-lg focus:border-indigo-600 focus:outline-hidden"
                    />
                  </div>
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-2 inline-flex items-center justify-center gap-2 px-6 py-2.5 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 rounded-xl shadow-xs transition-all cursor-pointer disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Creating Account...</span>
                </>
              ) : (
                <>
                  <span>Create Account</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="mt-5 text-center text-xs text-slate-500">
            <span>Already registered? </span>
            <Link to="/login" className="font-semibold text-indigo-600 hover:text-indigo-800">
              Sign in to your account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

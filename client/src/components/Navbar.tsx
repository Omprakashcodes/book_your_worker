import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getInitials } from '../utils/formatters';
import { NotificationBell } from './notification/NotificationBell';
import {
  Wrench,
  Menu,
  X,
  Calendar,
  Briefcase,
  User as UserIcon,
  LogOut,
  ChevronDown,
  ShieldCheck,
  LayoutDashboard,
  Users,
  CheckCircle,
} from 'lucide-react';
import toast from 'react-hot-toast';

export const Navbar: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setUserDropdownOpen(false);
    setMobileMenuOpen(false);
    toast.success('Logged out successfully');
    navigate('/');
  };

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  const role = user?.role;
  const isCustomer = role === 'customer';
  const isWorker = role === 'worker';
  const isAdmin = role === 'admin';

  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b border-slate-200/80 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Brand Logo */}
          <Link
            to="/"
            className="flex items-center gap-2.5 text-slate-900 group shrink-0"
            onClick={() => setMobileMenuOpen(false)}
          >
            <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-xs group-hover:bg-indigo-700 transition-colors">
              <Wrench className="w-5 h-5 text-white stroke-[2.2]" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-extrabold tracking-tight text-slate-900 font-heading group-hover:text-indigo-600 transition-colors">
                SERVIGO
              </span>
              <span className="text-[10px] font-medium tracking-wide text-slate-500 uppercase -mt-1">
                Trusted Professionals
              </span>
            </div>
          </Link>

          {/* Center Navigation Links (Desktop) */}
          <nav className="hidden md:flex items-center gap-1 sm:gap-2">
            {/* Customer & Guest Nav */}
            {!isAdmin && !isWorker && (
              <>
                <Link
                  to="/"
                  className={`px-3.5 py-2 text-sm font-medium rounded-xl transition-colors ${
                    isActive('/') && location.pathname === '/'
                      ? 'text-indigo-600 bg-indigo-50/70 font-semibold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
                  }`}
                >
                  Home
                </Link>

                <a
                  href="/#workers-section"
                  className="px-3.5 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100/70 rounded-xl transition-colors"
                >
                  Workers
                </a>

                <a
                  href="/#how-it-works"
                  className="px-3.5 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100/70 rounded-xl transition-colors"
                >
                  How It Works
                </a>

                {isAuthenticated && isCustomer && (
                  <>
                    <Link
                      to="/my-bookings"
                      className={`px-3.5 py-2 text-sm font-medium rounded-xl transition-colors inline-flex items-center gap-1.5 ${
                        isActive('/my-bookings')
                          ? 'text-indigo-600 bg-indigo-50/70 font-semibold'
                          : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
                      }`}
                    >
                      <Calendar className="w-4 h-4 text-indigo-500" />
                      <span>My Bookings</span>
                    </Link>
                    <Link
                      to="/profile"
                      className={`px-3.5 py-2 text-sm font-medium rounded-xl transition-colors inline-flex items-center gap-1.5 ${
                        isActive('/profile')
                          ? 'text-indigo-600 bg-indigo-50/70 font-semibold'
                          : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
                      }`}
                    >
                      <UserIcon className="w-4 h-4 text-indigo-500" />
                      <span>Profile</span>
                    </Link>
                  </>
                )}
              </>
            )}

            {/* Worker Nav */}
            {isAuthenticated && isWorker && (
              <>
                <Link
                  to="/worker/dashboard"
                  className={`px-3.5 py-2 text-sm font-medium rounded-xl transition-colors inline-flex items-center gap-1.5 ${
                    isActive('/worker/dashboard')
                      ? 'text-indigo-600 bg-indigo-50/70 font-semibold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
                  }`}
                >
                  <LayoutDashboard className="w-4 h-4 text-indigo-500" />
                  <span>Dashboard</span>
                </Link>

                <Link
                  to="/worker/bookings"
                  className={`px-3.5 py-2 text-sm font-medium rounded-xl transition-colors inline-flex items-center gap-1.5 ${
                    isActive('/worker/bookings')
                      ? 'text-indigo-600 bg-indigo-50/70 font-semibold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
                  }`}
                >
                  <Briefcase className="w-4 h-4 text-indigo-500" />
                  <span>Bookings</span>
                </Link>

                <Link
                  to="/worker/profile"
                  className={`px-3.5 py-2 text-sm font-medium rounded-xl transition-colors inline-flex items-center gap-1.5 ${
                    isActive('/worker/profile')
                      ? 'text-indigo-600 bg-indigo-50/70 font-semibold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
                  }`}
                >
                  <ShieldCheck className="w-4 h-4 text-indigo-500" />
                  <span>Profile & Documents</span>
                </Link>
              </>
            )}

            {/* Admin Nav */}
            {isAuthenticated && isAdmin && (
              <>
                <Link
                  to="/admin/dashboard"
                  className={`px-3.5 py-2 text-sm font-medium rounded-xl transition-colors inline-flex items-center gap-1.5 ${
                    isActive('/admin/dashboard')
                      ? 'text-indigo-600 bg-indigo-50/70 font-semibold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
                  }`}
                >
                  <LayoutDashboard className="w-4 h-4 text-indigo-500" />
                  <span>Dashboard</span>
                </Link>

                <Link
                  to="/admin/workers"
                  className={`px-3.5 py-2 text-sm font-medium rounded-xl transition-colors inline-flex items-center gap-1.5 ${
                    isActive('/admin/workers') && location.search !== '?status=pending'
                      ? 'text-indigo-600 bg-indigo-50/70 font-semibold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
                  }`}
                >
                  <Briefcase className="w-4 h-4 text-indigo-500" />
                  <span>Workers</span>
                </Link>

                <Link
                  to="/admin/workers?status=pending"
                  className={`px-3.5 py-2 text-sm font-medium rounded-xl transition-colors inline-flex items-center gap-1.5 ${
                    location.pathname === '/admin/workers' && location.search === '?status=pending'
                      ? 'text-indigo-600 bg-indigo-50/70 font-semibold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
                  }`}
                >
                  <CheckCircle className="w-4 h-4 text-amber-500" />
                  <span>KYC Queue</span>
                </Link>

                <Link
                  to="/admin/users"
                  className={`px-3.5 py-2 text-sm font-medium rounded-xl transition-colors inline-flex items-center gap-1.5 ${
                    isActive('/admin/users')
                      ? 'text-indigo-600 bg-indigo-50/70 font-semibold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
                  }`}
                >
                  <Users className="w-4 h-4 text-indigo-500" />
                  <span>Users</span>
                </Link>
              </>
            )}
          </nav>

          {/* Right Area: Auth & CTAs (Desktop) */}
          <div className="hidden md:flex items-center gap-3">
            <NotificationBell />

            {!isAuthenticated ? (
              <>
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm font-semibold text-slate-700 hover:text-indigo-600 hover:bg-slate-100/70 rounded-xl transition-colors"
                >
                  Log In
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 text-sm font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-xl shadow-xs transition-colors"
                >
                  Register
                </Link>
              </>
            ) : (
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2.5 p-1.5 pl-2 pr-3 rounded-full hover:bg-slate-100 transition-colors border border-slate-200 cursor-pointer"
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-blue-600 text-white flex items-center justify-center font-bold text-xs shadow-xs">
                    {getInitials(user?.name)}
                  </div>
                  <div className="text-left">
                    <span className="text-xs font-bold text-slate-900 block leading-tight max-w-[110px] truncate">
                      {user?.name || 'My Account'}
                    </span>
                    <span className="text-[10px] text-slate-500 uppercase block tracking-wider font-semibold">
                      {user?.role || 'Customer'}
                    </span>
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </button>

                {/* Dropdown Menu */}
                {userDropdownOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-10"
                      onClick={() => setUserDropdownOpen(false)}
                    />
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-200 py-2 z-20">
                      <div className="px-4 py-2.5 border-b border-slate-100">
                        <p className="text-xs text-slate-400 font-medium">Signed in as</p>
                        <p className="text-sm font-bold text-slate-900 truncate">
                          {user?.email}
                        </p>
                      </div>

                      {isCustomer && (
                        <>
                          <Link
                            to="/my-bookings"
                            onClick={() => setUserDropdownOpen(false)}
                            className="flex items-center gap-2 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 hover:text-indigo-600 font-medium"
                          >
                            <Calendar className="w-4 h-4 text-slate-400" />
                            <span>My Bookings</span>
                          </Link>
                          <Link
                            to="/profile"
                            onClick={() => setUserDropdownOpen(false)}
                            className="flex items-center gap-2 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 hover:text-indigo-600 font-medium"
                          >
                            <UserIcon className="w-4 h-4 text-slate-400" />
                            <span>Profile Settings</span>
                          </Link>
                        </>
                      )}

                      {isWorker && (
                        <>
                          <Link
                            to="/worker/dashboard"
                            onClick={() => setUserDropdownOpen(false)}
                            className="flex items-center gap-2 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 hover:text-indigo-600 font-medium"
                          >
                            <LayoutDashboard className="w-4 h-4 text-slate-400" />
                            <span>Dashboard</span>
                          </Link>
                          <Link
                            to="/worker/bookings"
                            onClick={() => setUserDropdownOpen(false)}
                            className="flex items-center gap-2 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 hover:text-indigo-600 font-medium"
                          >
                            <Briefcase className="w-4 h-4 text-slate-400" />
                            <span>Job Requests</span>
                          </Link>
                          <Link
                            to="/worker/profile"
                            onClick={() => setUserDropdownOpen(false)}
                            className="flex items-center gap-2 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 hover:text-indigo-600 font-medium"
                          >
                            <ShieldCheck className="w-4 h-4 text-slate-400" />
                            <span>Profile & Verification</span>
                          </Link>
                        </>
                      )}

                      {isAdmin && (
                        <>
                          <Link
                            to="/admin/dashboard"
                            onClick={() => setUserDropdownOpen(false)}
                            className="flex items-center gap-2 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 hover:text-indigo-600 font-medium"
                          >
                            <LayoutDashboard className="w-4 h-4 text-slate-400" />
                            <span>Admin Dashboard</span>
                          </Link>
                          <Link
                            to="/admin/workers"
                            onClick={() => setUserDropdownOpen(false)}
                            className="flex items-center gap-2 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 hover:text-indigo-600 font-medium"
                          >
                            <Briefcase className="w-4 h-4 text-slate-400" />
                            <span>Manage Workers</span>
                          </Link>
                          <Link
                            to="/admin/workers?status=pending"
                            onClick={() => setUserDropdownOpen(false)}
                            className="flex items-center gap-2 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 hover:text-indigo-600 font-medium"
                          >
                            <CheckCircle className="w-4 h-4 text-amber-500" />
                            <span>KYC Verification Queue</span>
                          </Link>
                          <Link
                            to="/admin/users"
                            onClick={() => setUserDropdownOpen(false)}
                            className="flex items-center gap-2 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 hover:text-indigo-600 font-medium"
                          >
                            <Users className="w-4 h-4 text-slate-400" />
                            <span>User Accounts</span>
                          </Link>
                        </>
                      )}

                      <div className="border-t border-slate-100 mt-1 pt-1">
                        <button
                          type="button"
                          onClick={handleLogout}
                          className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-rose-600 hover:bg-rose-50 font-medium text-left cursor-pointer"
                        >
                          <LogOut className="w-4 h-4" />
                          <span>Log Out</span>
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center gap-2 md:hidden">
            <NotificationBell />
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-700 hover:text-slate-900 rounded-xl hover:bg-slate-100 transition-colors"
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-3 shadow-lg">
          {isAuthenticated && (
            <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl mb-2">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-blue-600 text-white flex items-center justify-center font-bold text-sm">
                {getInitials(user?.name)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-slate-900 truncate">{user?.name}</p>
                <p className="text-xs text-slate-500 truncate">{user?.email}</p>
              </div>
              <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-md bg-indigo-100 text-indigo-700">
                {user?.role}
              </span>
            </div>
          )}

          {/* Guest / Customer links */}
          {!isAdmin && !isWorker && (
            <>
              <Link
                to="/"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 text-sm font-semibold text-slate-800 hover:text-indigo-600 rounded-lg hover:bg-slate-50"
              >
                Home
              </Link>
              <a
                href="/#workers-section"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 text-sm font-semibold text-slate-800 hover:text-indigo-600 rounded-lg hover:bg-slate-50"
              >
                Workers
              </a>
              <a
                href="/#how-it-works"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 text-sm font-semibold text-slate-800 hover:text-indigo-600 rounded-lg hover:bg-slate-50"
              >
                How It Works
              </a>
              {isAuthenticated && isCustomer && (
                <>
                  <Link
                    to="/my-bookings"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-3 py-2 text-sm font-semibold text-slate-800 hover:text-indigo-600 rounded-lg hover:bg-slate-50"
                  >
                    My Bookings
                  </Link>
                  <Link
                    to="/profile"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-3 py-2 text-sm font-semibold text-slate-800 hover:text-indigo-600 rounded-lg hover:bg-slate-50"
                  >
                    Profile Settings
                  </Link>
                </>
              )}
            </>
          )}

          {/* Worker mobile links */}
          {isAuthenticated && isWorker && (
            <>
              <Link
                to="/worker/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 text-sm font-semibold text-slate-800 hover:text-indigo-600 rounded-lg hover:bg-slate-50"
              >
                Dashboard
              </Link>
              <Link
                to="/worker/bookings"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 text-sm font-semibold text-slate-800 hover:text-indigo-600 rounded-lg hover:bg-slate-50"
              >
                Job Requests
              </Link>
              <Link
                to="/worker/profile"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 text-sm font-semibold text-slate-800 hover:text-indigo-600 rounded-lg hover:bg-slate-50"
              >
                Profile & Verification
              </Link>
            </>
          )}

          {/* Admin mobile links */}
          {isAuthenticated && isAdmin && (
            <>
              <Link
                to="/admin/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 text-sm font-semibold text-slate-800 hover:text-indigo-600 rounded-lg hover:bg-slate-50"
              >
                Admin Dashboard
              </Link>
              <Link
                to="/admin/workers"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 text-sm font-semibold text-slate-800 hover:text-indigo-600 rounded-lg hover:bg-slate-50"
              >
                Manage Workers
              </Link>
              <Link
                to="/admin/workers?status=pending"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 text-sm font-semibold text-slate-800 hover:text-indigo-600 rounded-lg hover:bg-slate-50"
              >
                KYC Verification Queue
              </Link>
              <Link
                to="/admin/users"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 text-sm font-semibold text-slate-800 hover:text-indigo-600 rounded-lg hover:bg-slate-50"
              >
                User Accounts
              </Link>
            </>
          )}

          {/* Auth button on mobile */}
          <div className="pt-3 border-t border-slate-100 flex flex-col gap-2">
            {!isAuthenticated ? (
              <>
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full py-2.5 text-center text-sm font-semibold text-slate-700 bg-slate-100 rounded-xl hover:bg-slate-200"
                >
                  Log In
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full py-2.5 text-center text-sm font-semibold text-white bg-indigo-600 rounded-xl hover:bg-indigo-700 shadow-xs"
                >
                  Register
                </Link>
              </>
            ) : (
              <button
                type="button"
                onClick={handleLogout}
                className="w-full py-2.5 text-center text-sm font-semibold text-rose-600 bg-rose-50 rounded-xl hover:bg-rose-100"
              >
                Log Out
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

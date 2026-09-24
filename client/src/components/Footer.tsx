import React from 'react';
import { Link } from 'react-router-dom';
import { Wrench, Shield, Clock, HeartHandshake, CheckCircle2 } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-900 text-slate-300 pt-14 pb-10 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-slate-800">
          {/* Brand & Mission */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-indigo-500 text-white flex items-center justify-center shadow-xs">
                <Wrench className="w-5 h-5 text-white stroke-[2.2]" />
              </div>
              <span className="text-2xl font-extrabold text-white tracking-tight font-heading">
                SERVIGO
              </span>
            </div>
            <p className="text-sm text-slate-400 max-w-sm leading-relaxed">
              Trusted Professionals, Right at Your Doorstep. India's premier marketplace for discovering, vetting, and booking experienced home maintenance professionals, technicians, and manual workers.
            </p>

            <div className="pt-2 flex items-center gap-4 text-xs text-slate-400">
              <span className="inline-flex items-center gap-1.5">
                <Shield className="w-4 h-4 text-indigo-400" />
                <span>Verified Pros</span>
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-indigo-400" />
                <span>Transparent Rates</span>
              </span>
              <span className="inline-flex items-center gap-1.5">
                <HeartHandshake className="w-4 h-4 text-indigo-400" />
                <span>Direct Booking</span>
              </span>
            </div>
          </div>

          {/* Popular Services */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200 mb-4 font-heading">
              Popular Services
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <a href="/#workers-section" className="hover:text-white transition-colors">
                  Plumbing Services
                </a>
              </li>
              <li>
                <a href="/#workers-section" className="hover:text-white transition-colors">
                  Electricians & Wiring
                </a>
              </li>
              <li>
                <a href="/#workers-section" className="hover:text-white transition-colors">
                  Carpentry & Furniture
                </a>
              </li>
              <li>
                <a href="/#workers-section" className="hover:text-white transition-colors">
                  Painting & Wall Care
                </a>
              </li>
              <li>
                <a href="/#workers-section" className="hover:text-white transition-colors">
                  Deep Home Cleaning
                </a>
              </li>
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200 mb-4 font-heading">
              Quick Links
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/" className="hover:text-white transition-colors">
                  Home Marketplace
                </Link>
              </li>
              <li>
                <a href="/#workers-section" className="hover:text-white transition-colors">
                  Browse All Workers
                </a>
              </li>
              <li>
                <a href="/#how-it-works" className="hover:text-white transition-colors">
                  How Booking Works
                </a>
              </li>
              <li>
                <Link to="/my-bookings" className="hover:text-white transition-colors">
                  My Orders & Bookings
                </Link>
              </li>
            </ul>
          </div>

          {/* Worker / Account */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200 mb-4 font-heading">
              Get Started
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/login" className="hover:text-white transition-colors">
                  Customer Login
                </Link>
              </li>
              <li>
                <Link to="/register" className="hover:text-white transition-colors">
                  Register as Customer
                </Link>
              </li>
              <li>
                <Link to="/register" className="text-indigo-400 hover:text-indigo-300 font-semibold transition-colors flex items-center gap-1">
                  <span>Join as a Worker</span>
                  <CheckCircle2 className="w-3.5 h-3.5" />
                </Link>
              </li>
              <li>
                <Link to="/worker/bookings" className="hover:text-white transition-colors">
                  Worker Job Portal
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} SERVIGO. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <span>Secure JWT REST Architecture</span>
            <span>Zero Booking Hidden Charges</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

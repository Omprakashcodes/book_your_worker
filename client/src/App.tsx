import React, { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { ScrollToTop } from './components/ScrollToTop';
import { ProtectedRoute } from './components/ProtectedRoute';
import { Loader2 } from 'lucide-react';

const Home = lazy(() => import('./pages/Home').then((module) => ({ default: module.Home })));
const Login = lazy(() => import('./pages/Login').then((module) => ({ default: module.Login })));
const ForgotPassword = lazy(() => import('./pages/ForgotPassword').then((module) => ({ default: module.ForgotPassword })));
const ResetPassword = lazy(() => import('./pages/ResetPassword').then((module) => ({ default: module.ResetPassword })));
const Register = lazy(() => import('./pages/Register').then((module) => ({ default: module.Register })));
const WorkerProfile = lazy(() => import('./pages/WorkerProfile').then((module) => ({ default: module.WorkerProfile })));
const Booking = lazy(() => import('./pages/Booking').then((module) => ({ default: module.Booking })));
const MyBookings = lazy(() => import('./pages/MyBookings').then((module) => ({ default: module.MyBookings })));
const Profile = lazy(() => import('./pages/Profile').then((module) => ({ default: module.Profile })));
const WorkerDashboard = lazy(() => import('./pages/WorkerDashboard').then((module) => ({ default: module.WorkerDashboard })));
const WorkerProfileManage = lazy(() => import('./pages/WorkerProfileManage').then((module) => ({ default: module.WorkerProfileManage })));
const WorkerBookings = lazy(() => import('./pages/WorkerBookings').then((module) => ({ default: module.WorkerBookings })));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard').then((module) => ({ default: module.AdminDashboard })));
const AdminWorkers = lazy(() => import('./pages/AdminWorkers').then((module) => ({ default: module.AdminWorkers })));
const AdminUsers = lazy(() => import('./pages/AdminUsers').then((module) => ({ default: module.AdminUsers })));
const NotFound = lazy(() => import('./pages/NotFound').then((module) => ({ default: module.NotFound })));

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <ScrollToTop />
        <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 selection:bg-indigo-500 selection:text-white">
          <Navbar />
          <main className="flex-1">
            <Suspense
              fallback={(
                <div className="flex min-h-[50vh] items-center justify-center" role="status" aria-live="polite">
                  <Loader2 className="h-7 w-7 animate-spin text-indigo-600" aria-hidden="true" />
                  <span className="sr-only">Loading page...</span>
                </div>
              )}
            >
              <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/reset-password" element={<ResetPassword />} />
              <Route path="/register" element={<Register />} />
              <Route path="/workers/:id" element={<WorkerProfile />} />

              {/* Customer / Universal Authenticated Routes */}
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/book/:id"
                element={
                  <ProtectedRoute>
                    <Booking />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/my-bookings"
                element={
                  <ProtectedRoute allowedRoles={['customer', 'admin']}>
                    <MyBookings />
                  </ProtectedRoute>
                }
              />

              {/* Worker Routes */}
              <Route
                path="/worker/dashboard"
                element={
                  <ProtectedRoute allowedRoles={['worker', 'admin']}>
                    <WorkerDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/worker/profile"
                element={
                  <ProtectedRoute allowedRoles={['worker', 'admin']}>
                    <WorkerProfileManage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/worker/onboarding"
                element={
                  <ProtectedRoute allowedRoles={['worker', 'admin']}>
                    <WorkerProfileManage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/worker/bookings"
                element={
                  <ProtectedRoute allowedRoles={['worker', 'admin']}>
                    <WorkerBookings />
                  </ProtectedRoute>
                }
              />

              {/* Admin Routes */}
              <Route
                path="/admin/dashboard"
                element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <AdminDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/workers"
                element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <AdminWorkers />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/users"
                element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <AdminUsers />
                  </ProtectedRoute>
                }
              />

              {/* Catch-all 404 */}
              <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
          </main>
          <Footer />

          {/* Toast Notification Container */}
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#0f172a',
                color: '#f8fafc',
                fontSize: '13px',
                borderRadius: '12px',
                padding: '12px 16px',
                boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.2)',
              },
              success: {
                iconTheme: {
                  primary: '#10b981',
                  secondary: '#0f172a',
                },
              },
              error: {
                iconTheme: {
                  primary: '#f43f5e',
                  secondary: '#0f172a',
                },
              },
            }}
          />
        </div>
      </Router>
    </AuthProvider>
  );
}

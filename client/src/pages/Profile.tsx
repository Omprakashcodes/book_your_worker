import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { userService } from '../services/userService';
import { User } from '../types';
import { getInitials, getImageUrl } from '../utils/formatters';
import {
  User as UserIcon,
  Phone,
  MapPin,
  FileText,
  Save,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Mail,
  Shield,
} from 'lucide-react';
import toast from 'react-hot-toast';

export const Profile: React.FC = () => {
  const { user: authUser, updateUser } = useAuth();

  const [userProfile, setUserProfile] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form fields
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [bio, setBio] = useState('');
  const [profileImage, setProfileImage] = useState('');

  useEffect(() => {
    const loadProfile = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const profile = await userService.getCurrentUser();
        setUserProfile(profile);
        setPhone(profile.phone || '');
        setAddress(profile.address || '');
        setBio(profile.bio || '');
        setProfileImage(profile.profileImage || '');
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : 'Failed to load user profile');
      } finally {
        setIsLoading(false);
      }
    };

    loadProfile();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const updated = await userService.updateProfile({
        phone: phone.trim() || undefined,
        address: address.trim() || undefined,
        bio: bio.trim() || undefined,
        profileImage: profileImage.trim() || undefined,
      });

      setUserProfile(updated);
      updateUser(updated);
      toast.success('Profile updated successfully!');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Could not save profile';
      toast.error(msg);
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center gap-3 bg-slate-50/50">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
        <p className="text-sm text-slate-500 font-medium">Loading your profile...</p>
      </div>
    );
  }

  const name = userProfile?.name || authUser?.name || 'User';
  const email = userProfile?.email || authUser?.email || '';
  const role = userProfile?.role || authUser?.role || 'customer';
  const displayAvatar = getImageUrl(profileImage || userProfile?.profileImage);

  return (
    <div className="min-h-screen bg-slate-50/50 py-8 sm:py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 font-heading">
            Account Settings & Profile
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Manage your personal contact info and default service address for bookings.
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
            <span className="leading-relaxed">{error}</span>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* User overview left panel */}
          <div className="md:col-span-1 bg-white p-6 rounded-2xl border border-slate-200/90 text-center flex flex-col items-center">
            <div className="relative mb-4">
              {displayAvatar ? (
                <img
                  src={displayAvatar}
                  alt={name}
                  referrerPolicy="no-referrer"
                  className="w-24 h-24 rounded-2xl object-cover bg-slate-100 border border-slate-200"
                />
              ) : (
                <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-indigo-500 to-blue-600 text-white flex items-center justify-center font-bold text-3xl shadow-sm">
                  {getInitials(name)}
                </div>
              )}
            </div>

            <h3 className="text-lg font-bold text-slate-900 font-heading truncate max-w-full">
              {name}
            </h3>
            <p className="text-xs text-slate-500 truncate max-w-full mt-0.5">{email}</p>

            <div className="mt-4 pt-4 border-t border-slate-100 w-full flex items-center justify-between text-xs text-slate-600">
              <span className="text-slate-400">Account Type</span>
              <span className="capitalize font-bold px-2 py-0.5 bg-indigo-50 text-indigo-700 rounded-md">
                {role}
              </span>
            </div>
          </div>

          {/* Form right panel */}
          <div className="md:col-span-2 bg-white p-6 sm:p-8 rounded-2xl border border-slate-200/90">
            <form onSubmit={handleSave} className="space-y-5">
              <h2 className="text-base font-bold text-slate-900 font-heading border-b border-slate-100 pb-3">
                Contact & Address Details
              </h2>

              {/* Name (Read-only as per backend schema) */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  Full Name
                </label>
                <input
                  type="text"
                  disabled
                  value={name}
                  className="w-full px-4 py-2.5 text-sm bg-slate-100 text-slate-600 border border-slate-200 rounded-xl cursor-not-allowed"
                />
              </div>

              {/* Email (Read-only) */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                  <Mail className="w-3.5 h-3.5 text-slate-400" />
                  <span>Email Address</span>
                </label>
                <input
                  type="email"
                  disabled
                  value={email}
                  className="w-full px-4 py-2.5 text-sm bg-slate-100 text-slate-600 border border-slate-200 rounded-xl cursor-not-allowed"
                />
              </div>

              {/* Phone */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                  <Phone className="w-3.5 h-3.5 text-slate-400" />
                  <span>Phone Number</span>
                </label>
                <input
                  type="tel"
                  placeholder="+91 98765 43210"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-indigo-600 focus:outline-hidden transition-colors"
                />
              </div>

              {/* Default Address */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  <span>Primary Address</span>
                </label>
                <textarea
                  rows={3}
                  placeholder="House/Apartment number, Street, Landmark, Area, City"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-indigo-600 focus:outline-hidden transition-colors resize-none"
                />
              </div>

              {/* Bio */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                  <FileText className="w-3.5 h-3.5 text-slate-400" />
                  <span>About / Bio</span>
                </label>
                <textarea
                  rows={2}
                  placeholder="Brief note about yourself or service preferences."
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-indigo-600 focus:outline-hidden transition-colors resize-none"
                />
              </div>

              {/* Profile Image URL */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  Profile Image URL
                </label>
                <input
                  type="url"
                  placeholder="https://example.com/avatar.jpg"
                  value={profileImage}
                  onChange={(e) => setProfileImage(e.target.value)}
                  className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-indigo-600 focus:outline-hidden transition-colors"
                />
              </div>

              <div className="pt-4 border-t border-slate-100 flex justify-end">
                <button
                  type="submit"
                  disabled={isSaving}
                  className="inline-flex items-center gap-2 px-6 py-2.5 text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 rounded-xl shadow-xs transition-all cursor-pointer disabled:opacity-50"
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Saving Changes...</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      <span>Save Profile</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

import React, { useState, useEffect } from 'react';
import { WorkerProfile } from '../types';
import { workerService } from '../services/workerService';
import { getImageUrl, formatDate, formatCurrency } from '../utils/formatters';
import {
  ShieldCheck,
  Upload,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Clock,
  FileText,
  Save,
  Loader2,
  Plus,
  X,
  Phone,
  MapPin,
  Briefcase,
  DollarSign,
  AlertCircle,
  ExternalLink,
} from 'lucide-react';
import toast from 'react-hot-toast';

const POPULAR_SKILLS = [
  'Plumbing',
  'Electrical',
  'Carpentry',
  'Painting',
  'Deep Cleaning',
  'Appliance Repair',
  'Masonry',
  'Gardening',
  'Welding',
  'AC Repair & Servicing',
];

export const WorkerProfileManage: React.FC = () => {
  const [profile, setProfile] = useState<WorkerProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [isUploadingDocs, setIsUploadingDocs] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Profile Form fields
  const [phone, setPhone] = useState('');
  const [profileImage, setProfileImage] = useState('');
  const [skills, setSkills] = useState<string[]>([]);
  const [skillInput, setSkillInput] = useState('');
  const [experience, setExperience] = useState<number>(1);
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [dailyWage, setDailyWage] = useState<number>(750);

  // Document upload files
  const [aadhaarFile, setAadhaarFile] = useState<File | null>(null);
  const [panFile, setPanFile] = useState<File | null>(null);

  const loadProfile = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await workerService.getMyWorkerProfile();
      setProfile(data);
      if (data) {
        setPhone(data.phone || '');
        setProfileImage(data.profileImage || '');
        setSkills(Array.isArray(data.skills) ? data.skills : []);
        setExperience(Number(data.experience) || 0);
        setAddress(data.address || '');
        setCity(data.city || '');
        setState(data.state || '');
        setDailyWage(Number(data.dailyWage) || 500);
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Could not load worker profile');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadProfile();
  }, []);

  const handleAddSkill = (skillToAdd: string) => {
    const trimmed = skillToAdd.trim();
    if (trimmed && !skills.includes(trimmed)) {
      setSkills([...skills, trimmed]);
      setSkillInput('');
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setSkills(skills.filter((s) => s !== skillToRemove));
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!phone.trim()) {
      toast.error('Please provide a valid contact phone number.');
      return;
    }
    if (skills.length === 0) {
      toast.error('Please register at least one professional skill or trade.');
      return;
    }
    if (experience < 0) {
      toast.error('Experience years must be 0 or greater.');
      return;
    }
    if (!address.trim() || !city.trim() || !state.trim()) {
      toast.error('Please complete your address, city, and state details.');
      return;
    }
    if (dailyWage <= 0) {
      toast.error('Daily wage must be greater than 0.');
      return;
    }

    setIsSavingProfile(true);
    try {
      const updated = await workerService.updateWorkerProfile({
        phone: phone.trim(),
        profileImage: profileImage.trim() || undefined,
        skills,
        experience: Number(experience),
        address: address.trim(),
        city: city.trim(),
        state: state.trim(),
        dailyWage: Number(dailyWage),
      });

      setProfile(updated);
      toast.success('Worker profile updated successfully!');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to update profile';
      toast.error(msg);
    } finally {
      setIsSavingProfile(false);
    }
  };

  const handleUploadDocuments = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!aadhaarFile && !panFile) {
      toast.error('Please select at least one document (Aadhaar or PAN) to upload.');
      return;
    }

    setIsUploadingDocs(true);
    try {
      const formData = new FormData();
      if (aadhaarFile) {
        formData.append('aadhaarDocument', aadhaarFile);
      }
      if (panFile) {
        formData.append('panDocument', panFile);
      }

      const updated = await workerService.uploadDocuments(formData);
      setProfile(updated);
      setAadhaarFile(null);
      setPanFile(null);
      toast.success('Verification documents uploaded! Status is now pending review.');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to upload verification documents';
      toast.error(msg);
    } finally {
      setIsUploadingDocs(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center gap-3 bg-slate-50/50">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
        <p className="text-sm text-slate-500 font-medium">Loading worker profile...</p>
      </div>
    );
  }

  const verificationStatus = profile?.verificationStatus || 'pending';
  const aadhaarUrl = getImageUrl(profile?.aadhaarDocument);
  const panUrl = getImageUrl(profile?.panDocument);

  return (
    <div className="min-h-screen bg-slate-50/50 py-8 sm:py-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 font-heading">
            Professional Profile & Verification
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Configure your trade services, daily wage rates, and identity verification credentials.
          </p>
        </div>

        {error && (
          <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
            <span className="leading-relaxed">{error}</span>
          </div>
        )}

        {/* Verification Status Card */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-7">
          <h2 className="text-base font-bold text-slate-900 font-heading mb-4 pb-3 border-b border-slate-100 flex items-center justify-between">
            <span>Verification Status</span>
            <span className="text-xs text-slate-400 font-normal">
              Admin Compliance
            </span>
          </h2>

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              {verificationStatus === 'approved' ? (
                <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-6 h-6" />
                </div>
              ) : verificationStatus === 'rejected' ? (
                <div className="w-12 h-12 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center shrink-0">
                  <XCircle className="w-6 h-6" />
                </div>
              ) : (
                <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
                  <Clock className="w-6 h-6" />
                </div>
              )}

              <div>
                <div className="flex items-center gap-2">
                  <span className="text-base font-bold text-slate-900 capitalize">
                    {verificationStatus}
                  </span>
                  {profile?.verifiedAt && (
                    <span className="text-xs text-slate-400">
                      (Verified on {formatDate(profile.verifiedAt)})
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  {verificationStatus === 'approved'
                    ? 'Your documents have been verified and you are actively bookable by customers.'
                    : verificationStatus === 'rejected'
                    ? 'Your verification was declined. Review feedback below and resubmit documents.'
                    : 'Documents are awaiting administrative review. This usually takes 24 hours.'}
                </p>
              </div>
            </div>
          </div>

          {verificationStatus === 'rejected' && profile?.rejectionReason && (
            <div className="mt-4 p-4 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-800">
              <span className="font-bold block mb-1">Administrative Feedback / Rejection Reason:</span>
              <p className="leading-relaxed">{profile.rejectionReason}</p>
            </div>
          )}
        </div>

        {/* 1. Worker Profile Details Form */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-8">
          <form onSubmit={handleSaveProfile} className="space-y-6">
            <div className="border-b border-slate-100 pb-4">
              <h2 className="text-lg font-bold text-slate-900 font-heading">
                Trade Profile & Rates
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                These details are shown publicly on the marketplace to potential customers.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {/* Phone */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                  <Phone className="w-3.5 h-3.5 text-slate-400" />
                  <span>Contact Phone Number *</span>
                </label>
                <input
                  type="tel"
                  required
                  placeholder="+91 98765 43210"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-indigo-600 focus:outline-hidden transition-colors"
                />
              </div>

              {/* Daily Wage */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                  <DollarSign className="w-3.5 h-3.5 text-slate-400" />
                  <span>Daily Wage (INR / 8 Hours) *</span>
                </label>
                <input
                  type="number"
                  required
                  min={100}
                  step={50}
                  value={dailyWage}
                  onChange={(e) => setDailyWage(Number(e.target.value))}
                  className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-indigo-600 focus:outline-hidden transition-colors"
                />
              </div>

              {/* Experience */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                  <Briefcase className="w-3.5 h-3.5 text-slate-400" />
                  <span>Experience in Years *</span>
                </label>
                <input
                  type="number"
                  required
                  min={0}
                  max={50}
                  value={experience}
                  onChange={(e) => setExperience(Number(e.target.value))}
                  className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-indigo-600 focus:outline-hidden transition-colors"
                />
              </div>

              {/* Profile Image URL */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  Profile Photo URL (Optional)
                </label>
                <input
                  type="url"
                  placeholder="https://example.com/worker-photo.jpg"
                  value={profileImage}
                  onChange={(e) => setProfileImage(e.target.value)}
                  className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-indigo-600 focus:outline-hidden transition-colors"
                />
              </div>
            </div>

            {/* Skills & Services Selection */}
            <div className="pt-2">
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Registered Trade Skills *
              </label>

              {/* Active Skill Chips */}
              <div className="flex flex-wrap gap-2 mb-3 min-h-[36px] p-2.5 bg-slate-50 border border-slate-200 rounded-xl">
                {skills.length === 0 ? (
                  <span className="text-xs text-slate-400 italic">
                    No skills added yet. Select from below or type custom skills.
                  </span>
                ) : (
                  skills.map((skill) => (
                    <span
                      key={skill}
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold bg-indigo-600 text-white shadow-2xs"
                    >
                      <span>{skill}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveSkill(skill)}
                        className="hover:text-indigo-200"
                        title={`Remove ${skill}`}
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))
                )}
              </div>

              {/* Add custom skill input */}
              <div className="flex gap-2 mb-3">
                <input
                  type="text"
                  placeholder="Type a skill and press Enter or Add..."
                  value={skillInput}
                  onChange={(e) => setSkillInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddSkill(skillInput);
                    }
                  }}
                  className="flex-1 px-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-indigo-600 focus:outline-hidden"
                />
                <button
                  type="button"
                  onClick={() => handleAddSkill(skillInput)}
                  className="px-4 py-2 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl"
                >
                  Add Skill
                </button>
              </div>

              {/* Popular Skill shortcuts */}
              <div className="flex flex-wrap gap-1.5">
                <span className="text-[11px] text-slate-400 self-center mr-1">Quick Select:</span>
                {POPULAR_SKILLS.map((skill) => (
                  <button
                    key={skill}
                    type="button"
                    onClick={() => handleAddSkill(skill)}
                    disabled={skills.includes(skill)}
                    className={`text-[11px] px-2.5 py-1 rounded-lg border transition-colors ${
                      skills.includes(skill)
                        ? 'opacity-40 bg-slate-100 border-slate-200 cursor-not-allowed text-slate-400'
                        : 'bg-white border-slate-200 hover:border-indigo-300 text-slate-700 hover:text-indigo-600'
                    }`}
                  >
                    + {skill}
                  </button>
                ))}
              </div>
            </div>

            {/* Location Fields */}
            <div className="pt-4 border-t border-slate-100 space-y-4">
              <h3 className="text-sm font-bold text-slate-900 font-heading">
                Operational Location & Address
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    <span>City *</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Bangalore"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-indigo-600 focus:outline-hidden transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                    State *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Karnataka"
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-indigo-600 focus:outline-hidden transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  Detailed Street Address *
                </label>
                <textarea
                  rows={2}
                  required
                  placeholder="Base locality, area, street number"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-indigo-600 focus:outline-hidden transition-colors resize-none"
                />
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex justify-end">
              <button
                type="submit"
                disabled={isSavingProfile}
                className="inline-flex items-center gap-2 px-6 py-2.5 text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 rounded-xl shadow-xs transition-all cursor-pointer disabled:opacity-50"
              >
                {isSavingProfile ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Saving Profile...</span>
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    <span>Save Trade Profile</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* 2. Verification Document Upload Section */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-8">
          <form onSubmit={handleUploadDocuments} className="space-y-6">
            <div className="border-b border-slate-100 pb-4">
              <h2 className="text-lg font-bold text-slate-900 font-heading">
                Upload KYC Identity Documents
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Official documents verified strictly by SERVIGO administrators.
              </p>
            </div>

            {/* Warning about status reset */}
            <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-800 flex items-start gap-2.5">
              <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold">Important Notice:</span> Uploading or replacing your documents will reset your verification status to <strong>Pending</strong> until administrative review is finalized.
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Aadhaar File Upload */}
              <div className="p-5 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
                    Aadhaar Card Document
                  </span>
                  {aadhaarUrl && (
                    <a
                      href={aadhaarUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-[11px] text-indigo-600 hover:underline inline-flex items-center gap-1 font-semibold"
                    >
                      <span>View Current</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>

                <div className="relative border-2 border-dashed border-slate-300 hover:border-indigo-400 rounded-xl p-4 text-center cursor-pointer bg-white transition-colors">
                  <input
                    type="file"
                    accept="image/*,.pdf"
                    onChange={(e) => setAadhaarFile(e.target.files?.[0] || null)}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <Upload className="w-6 h-6 text-slate-400 mx-auto mb-1.5" />
                  <p className="text-xs font-semibold text-slate-700">
                    {aadhaarFile ? aadhaarFile.name : 'Choose Aadhaar Document (JPG, PNG, PDF)'}
                  </p>
                  <p className="text-[10px] text-slate-400 mt-0.5">Maximum file size 5MB</p>
                </div>
              </div>

              {/* PAN File Upload */}
              <div className="p-5 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
                    PAN Card Document
                  </span>
                  {panUrl && (
                    <a
                      href={panUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-[11px] text-indigo-600 hover:underline inline-flex items-center gap-1 font-semibold"
                    >
                      <span>View Current</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>

                <div className="relative border-2 border-dashed border-slate-300 hover:border-indigo-400 rounded-xl p-4 text-center cursor-pointer bg-white transition-colors">
                  <input
                    type="file"
                    accept="image/*,.pdf"
                    onChange={(e) => setPanFile(e.target.files?.[0] || null)}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <Upload className="w-6 h-6 text-slate-400 mx-auto mb-1.5" />
                  <p className="text-xs font-semibold text-slate-700">
                    {panFile ? panFile.name : 'Choose PAN Document (JPG, PNG, PDF)'}
                  </p>
                  <p className="text-[10px] text-slate-400 mt-0.5">Maximum file size 5MB</p>
                </div>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="submit"
                disabled={isUploadingDocs || (!aadhaarFile && !panFile)}
                className="inline-flex items-center gap-2 px-6 py-2.5 text-sm font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-xl shadow-xs transition-all cursor-pointer disabled:opacity-50"
              >
                {isUploadingDocs ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Uploading Documents...</span>
                  </>
                ) : (
                  <>
                    <Upload className="w-4 h-4" />
                    <span>Submit Documents for Review</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

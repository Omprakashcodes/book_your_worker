import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { adminService } from '../services/adminService';
import { WorkerProfile } from '../types';
import {
  formatCurrency,
  getWorkerDisplayName,
  getWorkerEmail,
  getImageUrl,
} from '../utils/formatters';
import {
  ShieldCheck,
  CheckCircle2,
  XCircle,
  Clock,
  ExternalLink,
  RefreshCw,
  Search,
  FileText,
  Loader2,
  Briefcase,
  MapPin,
  Phone,
  Mail,
  Eye,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { ConfirmationModal } from '../components/ConfirmationModal';
import { EmptyState } from '../components/EmptyState';
import { ErrorState } from '../components/ErrorState';

type StatusFilter = 'all' | 'pending' | 'approved' | 'rejected';

export const AdminWorkers: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  /*
   * IMPORTANT:
   *
   * /admin/workers
   * = Worker Directory
   * = Approved workers only
   *
   * /admin/workers?status=pending
   * = KYC Queue
   * = ALL workers
   *
   * We use the existing ?status=pending link for KYC Queue
   * so Navbar changes are not required.
   */
  const isKycQueue = searchParams.get('status') === 'pending';

  const [workers, setWorkers] = useState<WorkerProfile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Queue filters
  const [activeStatus, setActiveStatus] = useState<StatusFilter>(
    isKycQueue ? 'all' : 'approved'
  );

  const [searchQuery, setSearchQuery] = useState('');

  // Approve state
  const [approvingWorker, setApprovingWorker] =
    useState<WorkerProfile | null>(null);
  const [isApproving, setIsApproving] = useState(false);

  // Reject state
  const [rejectingWorker, setRejectingWorker] =
    useState<WorkerProfile | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [isRejecting, setIsRejecting] = useState(false);

  /*
   * Fetch all workers.
   *
   * Backend already provides:
   * GET /api/admin/workers
   */
  const fetchWorkers = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await adminService.getAllWorkers();
      setWorkers(data);
    } catch (err: unknown) {
      setError(
        err instanceof Error
          ? err.message
          : 'Failed to fetch workers list'
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchWorkers();
  }, []);

  /*
   * Keep active mode synchronized with URL.
   */
  useEffect(() => {
    if (isKycQueue) {
      setActiveStatus('all');
    } else {
      setActiveStatus('approved');
    }
  }, [isKycQueue]);

  /*
   * Change filter inside KYC Queue.
   */
  const handleTabChange = (status: StatusFilter) => {
    if (!isKycQueue) {
      return;
    }

    setActiveStatus(status);

    // Keep KYC Queue URL.
    setSearchParams({ status: 'pending' });
  };

  /*
   * APPROVE WORKER
   */
  const handleApproveConfirm = async () => {
    if (!approvingWorker) return;

    const workerId =
      approvingWorker._id || approvingWorker.id;

    if (!workerId) return;

    setIsApproving(true);

    try {
      await adminService.verifyWorker(workerId);

      toast.success(
        `Worker "${getWorkerDisplayName(
          approvingWorker
        )}" approved successfully!`
      );

      /*
       * Update local status immediately.
       */
      setWorkers((prev) =>
        prev.map((worker) =>
          worker._id === workerId ||
          worker.id === workerId
            ? {
                ...worker,
                verificationStatus: 'approved',
                rejectionReason: undefined,
              }
            : worker
        )
      );

      setApprovingWorker(null);
    } catch (err: unknown) {
      const message =
        err instanceof Error
          ? err.message
          : 'Failed to approve worker';

      toast.error(message);
    } finally {
      setIsApproving(false);
    }
  };

  /*
   * REJECT WORKER
   *
   * Works for:
   * Pending
   * Approved
   * Rejected
   */
  const handleRejectConfirm = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    if (!rejectingWorker) return;

    const workerId =
      rejectingWorker._id || rejectingWorker.id;

    if (!workerId) return;

    if (!rejectionReason.trim()) {
      toast.error(
        'Please enter a rejection reason.'
      );
      return;
    }

    setIsRejecting(true);

    try {
      await adminService.rejectWorker(
        workerId,
        rejectionReason.trim()
      );

      toast.success(
        `Worker "${getWorkerDisplayName(
          rejectingWorker
        )}" has been rejected.`
      );

      setWorkers((prev) =>
        prev.map((worker) =>
          worker._id === workerId ||
          worker.id === workerId
            ? {
                ...worker,
                verificationStatus: 'rejected',
                rejectionReason:
                  rejectionReason.trim(),
              }
            : worker
        )
      );

      setRejectingWorker(null);
      setRejectionReason('');
    } catch (err: unknown) {
      const message =
        err instanceof Error
          ? err.message
          : 'Failed to reject worker';

      toast.error(message);
    } finally {
      setIsRejecting(false);
    }
  };

  /*
   * Counts for KYC Queue.
   */
  const counts = useMemo(() => {
    const result = {
      all: workers.length,
      pending: 0,
      approved: 0,
      rejected: 0,
    };

    workers.forEach((worker) => {
      const status = (
        worker.verificationStatus || 'pending'
      ).toLowerCase();

      if (status === 'pending') {
        result.pending++;
      } else if (status === 'approved') {
        result.approved++;
      } else if (status === 'rejected') {
        result.rejected++;
      }
    });

    return result;
  }, [workers]);

  /*
   * Display logic:
   *
   * Worker Directory:
   *   ONLY approved workers.
   *
   * KYC Queue:
   *   ALL workers, with status filter.
   */
  const filteredWorkers = useMemo(() => {
    return workers.filter((worker) => {
      const status = (
        worker.verificationStatus || 'pending'
      ).toLowerCase();

      /*
       * Worker Directory
       */
      if (!isKycQueue && status !== 'approved') {
        return false;
      }

      /*
       * KYC Queue
       */
      if (
        isKycQueue &&
        activeStatus !== 'all' &&
        status !== activeStatus
      ) {
        return false;
      }

      const name =
        getWorkerDisplayName(worker).toLowerCase();

      const city =
        (worker.city || '').toLowerCase();

      const phone =
        (worker.phone || '').toLowerCase();

      const skills = Array.isArray(worker.skills)
        ? worker.skills.join(' ').toLowerCase()
        : '';

      const query =
        searchQuery.toLowerCase().trim();

      const matchesSearch =
        !query ||
        name.includes(query) ||
        city.includes(query) ||
        phone.includes(query) ||
        skills.includes(query);

      return matchesSearch;
    });
  }, [
    workers,
    isKycQueue,
    activeStatus,
    searchQuery,
  ]);

  return (
    <div className="min-h-screen bg-slate-50/50 py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">

        {/* HEADER */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Link
                to="/admin/dashboard"
                className="text-xs font-semibold text-slate-500 hover:text-indigo-600 transition-colors"
              >
                Admin Dashboard
              </Link>

              <span className="text-slate-300">
                /
              </span>

              <span className="text-xs font-semibold text-indigo-600">
                {isKycQueue
                  ? 'KYC Queue'
                  : 'Workers'}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 font-heading">
              {isKycQueue
                ? 'KYC Verification Queue'
                : 'Worker Directory'}
            </h1>

            <p className="text-sm text-slate-500 mt-1">
              {isKycQueue
                ? 'Review worker verification status and manage approved, pending, and rejected professionals.'
                : 'View all approved service professionals on the Servigo platform.'}
            </p>
          </div>

          <button
            type="button"
            onClick={fetchWorkers}
            disabled={isLoading}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl transition-colors cursor-pointer disabled:opacity-50"
          >
            <RefreshCw
              className={`w-3.5 h-3.5 ${
                isLoading ? 'animate-spin' : ''
              }`}
            />

            <span>Refresh</span>
          </button>
        </div>

        {/* ERROR */}
        {error && (
          <ErrorState
            title="Error Loading Worker Profiles"
            message={error}
            onRetry={fetchWorkers}
          />
        )}

        {/* FILTERS */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">

          {/* KYC QUEUE TABS */}
          {isKycQueue ? (
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">

              {[
                {
                  id: 'all',
                  label: 'All Workers',
                  count: counts.all,
                },
                {
                  id: 'pending',
                  label: 'Pending KYC',
                  count: counts.pending,
                },
                {
                  id: 'approved',
                  label: 'Approved',
                  count: counts.approved,
                },
                {
                  id: 'rejected',
                  label: 'Rejected',
                  count: counts.rejected,
                },
              ].map((tab) => {
                const active =
                  activeStatus === tab.id;

                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() =>
                      handleTabChange(
                        tab.id as StatusFilter
                      )
                    }
                    className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                      active
                        ? 'bg-slate-900 text-white shadow-2xs'
                        : 'bg-white text-slate-600 hover:text-slate-900 hover:bg-slate-100/80 border border-slate-200/90'
                    }`}
                  >
                    <span>{tab.label}</span>

                    <span
                      className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${
                        active
                          ? 'bg-white/20 text-white'
                          : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {tab.count}
                    </span>
                  </button>
                );
              })}
            </div>
          ) : (
            /* WORKER DIRECTORY LABEL */
            <div className="inline-flex items-center gap-2 px-3.5 py-2 bg-emerald-50 border border-emerald-200 rounded-xl text-xs font-semibold text-emerald-700">
              <ShieldCheck className="w-4 h-4" />
              <span>
                Approved Workers: {counts.approved}
              </span>
            </div>
          )}

          {/* SEARCH */}
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />

            <input
              type="text"
              placeholder="Search name, phone, city, skills..."
              value={searchQuery}
              onChange={(e) =>
                setSearchQuery(e.target.value)
              }
              className="w-full pl-9.5 pr-4 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:border-indigo-600 focus:outline-hidden transition-colors"
            />
          </div>
        </div>

        {/* WORKERS TABLE */}
        <div className="bg-white rounded-2xl border border-slate-200/90 overflow-hidden shadow-2xs">

          {isLoading ? (
            <div className="p-12 text-center space-y-3">
              <Loader2 className="w-8 h-8 animate-spin text-indigo-600 mx-auto" />

              <p className="text-xs text-slate-500 font-medium">
                Loading workers registry...
              </p>
            </div>
          ) : filteredWorkers.length === 0 ? (
            <div className="p-12">
              <EmptyState
                title={
                  isKycQueue
                    ? 'No workers found'
                    : 'No approved workers found'
                }
                message={
                  isKycQueue
                    ? 'No workers match the selected status or search.'
                    : 'There are currently no approved workers in the directory.'
                }
                icon={Briefcase}
              />
            </div>
          ) : (
            <div className="overflow-x-auto">

              <table className="w-full text-left text-xs">

                <thead className="bg-slate-50/80 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
                  <tr>
                    <th className="py-3.5 px-4 sm:px-6">
                      Worker & Contact
                    </th>

                    <th className="py-3.5 px-4">
                      Skills
                    </th>

                    <th className="py-3.5 px-4">
                      Location & Rate
                    </th>

                    <th className="py-3.5 px-4">
                      KYC Documents
                    </th>

                    <th className="py-3.5 px-4">
                      Status
                    </th>

                    <th className="py-3.5 px-4 sm:px-6 text-right">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">

                  {filteredWorkers.map((worker) => {
                    const id =
                      worker._id ||
                      worker.id ||
                      '';

                    const name =
                      getWorkerDisplayName(worker);

                    const email =
                      getWorkerEmail(worker);

                    const status =
                      (
                        worker.verificationStatus ||
                        'pending'
                      ).toLowerCase();

                    const aadhaarDoc =
                      worker.aadhaarDocument
                        ? getImageUrl(
                            worker.aadhaarDocument
                          )
                        : null;

                    const panDoc =
                      worker.panDocument
                        ? getImageUrl(
                            worker.panDocument
                          )
                        : null;

                    return (
                      <tr
                        key={id}
                        className="hover:bg-slate-50/60 transition-colors"
                      >

                        {/* WORKER */}
                        <td className="py-4 px-4 sm:px-6">
                          <div className="font-bold text-slate-900 text-sm">
                            {name}
                          </div>

                          {worker.phone && (
                            <div className="flex items-center gap-1 text-slate-500 mt-0.5">
                              <Phone className="w-3 h-3 text-slate-400" />
                              <span>
                                {worker.phone}
                              </span>
                            </div>
                          )}

                          {email && (
                            <div className="flex items-center gap-1 text-slate-400 mt-0.5">
                              <Mail className="w-3 h-3 text-slate-300" />
                              <span>
                                {email}
                              </span>
                            </div>
                          )}
                        </td>

                        {/* SKILLS */}
                        <td className="py-4 px-4">
                          <div className="flex flex-wrap gap-1 max-w-xs">

                            {Array.isArray(
                              worker.skills
                            ) &&
                            worker.skills.length > 0 ? (
                              worker.skills
                                .slice(0, 3)
                                .map(
                                  (
                                    skill,
                                    index
                                  ) => (
                                    <span
                                      key={index}
                                      className="px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700 font-medium text-[11px]"
                                    >
                                      {skill}
                                    </span>
                                  )
                                )
                            ) : (
                              <span className="text-slate-400 italic">
                                No skills listed
                              </span>
                            )}

                            {Array.isArray(
                              worker.skills
                            ) &&
                              worker.skills
                                .length > 3 && (
                                <span className="px-1.5 py-0.5 rounded-md bg-slate-100 text-slate-500 text-[10px]">
                                  +
                                  {worker.skills
                                    .length - 3}
                                </span>
                              )}
                          </div>

                          {worker.experience !==
                            undefined && (
                            <div className="text-[11px] text-slate-500 mt-1">
                              {worker.experience} yrs
                              experience
                            </div>
                          )}
                        </td>

                        {/* LOCATION */}
                        <td className="py-4 px-4">
                          <div className="font-semibold text-slate-900">
                            {formatCurrency(
                              worker.dailyWage
                            )}
                            /day
                          </div>

                          <div className="flex items-center gap-1 text-slate-500 mt-0.5">
                            <MapPin className="w-3 h-3 text-slate-400 shrink-0" />

                            <span className="truncate max-w-[140px]">
                              {[
                                worker.city,
                                worker.state,
                              ]
                                .filter(Boolean)
                                .join(', ') ||
                                'Not set'}
                            </span>
                          </div>
                        </td>

                        {/* KYC */}
                        <td className="py-4 px-4">
                          <div className="space-y-1">

                            {aadhaarDoc ? (
                              <a
                                href={aadhaarDoc}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center gap-1 text-[11px] text-indigo-600 hover:text-indigo-800 font-semibold hover:underline"
                              >
                                <FileText className="w-3.5 h-3.5" />
                                <span>
                                  Aadhaar
                                </span>
                                <ExternalLink className="w-2.5 h-2.5" />
                              </a>
                            ) : (
                              <span className="text-[11px] text-slate-400 block">
                                Aadhaar: Not
                                attached
                              </span>
                            )}

                            {panDoc ? (
                              <a
                                href={panDoc}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center gap-1 text-[11px] text-indigo-600 hover:text-indigo-800 font-semibold hover:underline"
                              >
                                <FileText className="w-3.5 h-3.5" />
                                <span>
                                  PAN
                                </span>
                                <ExternalLink className="w-2.5 h-2.5" />
                              </a>
                            ) : (
                              <span className="text-[11px] text-slate-400 block">
                                PAN: Not attached
                              </span>
                            )}
                          </div>
                        </td>

                        {/* STATUS */}
                        <td className="py-4 px-4">

                          {status ===
                          'approved' ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                              <ShieldCheck className="w-3.5 h-3.5" />
                              Approved
                            </span>
                          ) : status ===
                            'rejected' ? (
                            <div>
                              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200">
                                <XCircle className="w-3.5 h-3.5" />
                                Rejected
                              </span>

                              {worker.rejectionReason && (
                                <p className="text-[10px] text-rose-600 max-w-[150px] truncate mt-1">
                                  {
                                    worker.rejectionReason
                                  }
                                </p>
                              )}
                            </div>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                              <Clock className="w-3.5 h-3.5" />
                              Pending
                            </span>
                          )}
                        </td>

                        {/* ACTIONS */}
                        <td className="py-4 px-4 sm:px-6 text-right">

                          <div className="flex items-center justify-end gap-2">

                            {/*
                             * KYC QUEUE ONLY
                             *
                             * APPROVE:
                             * Pending or Rejected
                             *
                             * REJECT:
                             * Pending or Approved
                             *
                             * Already approved:
                             * Reject remains available.
                             */}
                            {isKycQueue && (
                              <>
                                {status !==
                                  'approved' && (
                                  <button
                                    type="button"
                                    onClick={() =>
                                      setApprovingWorker(
                                        worker
                                      )
                                    }
                                    className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-lg transition-colors cursor-pointer"
                                  >
                                    <CheckCircle2 className="w-3.5 h-3.5" />
                                    Approve
                                  </button>
                                )}

                                {status !==
                                  'rejected' && (
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setRejectingWorker(
                                        worker
                                      );
                                      setRejectionReason(
                                        worker.rejectionReason ||
                                          ''
                                      );
                                    }}
                                    className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-bold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-lg transition-colors cursor-pointer"
                                  >
                                    <XCircle className="w-3.5 h-3.5" />
                                    Reject
                                  </button>
                                )}

                                {status ===
                                  'rejected' && (
                                  <button
                                    type="button"
                                    onClick={() =>
                                      setApprovingWorker(
                                        worker
                                      )
                                    }
                                    className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-lg transition-colors cursor-pointer"
                                  >
                                    <CheckCircle2 className="w-3.5 h-3.5" />
                                    Approve
                                  </button>
                                )}
                              </>
                            )}

                            {/* PUBLIC PROFILE */}
                            <Link
                              to={`/workers/${id}`}
                              target="_blank"
                              className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100"
                              title="Preview Public Worker Profile"
                            >
                              <Eye className="w-4 h-4" />
                            </Link>

                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* APPROVE CONFIRMATION */}
      <ConfirmationModal
        isOpen={!!approvingWorker}
        title="Approve Worker Verification?"
        message={`Confirm approval of ${
          approvingWorker
            ? getWorkerDisplayName(
                approvingWorker
              )
            : 'this worker'
        }. This worker will become verified and bookable on the Servigo marketplace.`}
        confirmText="Yes, Approve Worker"
        cancelText="Cancel"
        confirmVariant="primary"
        isLoading={isApproving}
        onConfirm={handleApproveConfirm}
        onCancel={() =>
          setApprovingWorker(null)
        }
      />

      {/* REJECT MODAL */}
      {rejectingWorker && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">

          <div className="bg-white rounded-2xl border border-slate-200 shadow-xl max-w-md w-full p-6 space-y-4">

            <div className="flex items-center gap-3">

              <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center shrink-0">
                <XCircle className="w-5 h-5" />
              </div>

              <div>
                <h3 className="text-base font-bold text-slate-900 font-heading">
                  Reject Worker Verification
                </h3>

                <p className="text-xs text-slate-500">
                  {getWorkerDisplayName(
                    rejectingWorker
                  )}
                </p>
              </div>
            </div>

            <form
              onSubmit={handleRejectConfirm}
              className="space-y-4"
            >

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  Rejection Reason *
                </label>

                <textarea
                  required
                  rows={3}
                  value={rejectionReason}
                  onChange={(e) =>
                    setRejectionReason(
                      e.target.value
                    )
                  }
                  placeholder="e.g. Documents are unclear or invalid. Please upload valid documents."
                  className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-rose-500 focus:outline-hidden transition-colors resize-none"
                />

                <p className="text-[11px] text-slate-400 mt-1">
                  This reason will help the worker understand why their verification was rejected.
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2.5">

                <button
                  type="button"
                  onClick={() => {
                    setRejectingWorker(null);
                    setRejectionReason('');
                  }}
                  className="px-4 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={
                    isRejecting ||
                    !rejectionReason.trim()
                  }
                  className="px-4 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-xl transition-colors cursor-pointer disabled:opacity-50 inline-flex items-center gap-1.5"
                >
                  {isRejecting ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      Rejecting...
                    </>
                  ) : (
                    'Confirm Rejection'
                  )}
                </button>

              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
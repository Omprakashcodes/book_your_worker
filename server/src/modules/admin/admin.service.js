const Worker = require("../worker/worker.model");
const Auth = require("../auth/auth.model");

// Get all workers
const getAllWorkers = async (status) => {
  const filter = {};

  if (status && status !== "all") {
    filter.verificationStatus = status;
  }

  return await Worker.find(filter)
    .populate("userId", "name email role")
    .sort({ createdAt: -1 });
};

// Get pending workers
const getPendingWorkers = async () => {
  return await Worker.find({ verificationStatus: "pending" })
    .populate("userId", "name email role")
    .sort({ createdAt: -1 });
};

// Get worker by ID
const getWorkerById = async (id) => {
  return await Worker.findById(id)
    .populate("userId", "name email role");
};

// Approve worker
const approveWorker = async (id) => {
  return await Worker.findByIdAndUpdate(
    id,
    {
      verificationStatus: "approved",
      rejectionReason: null,
      verifiedAt: new Date(),
    },
    { new: true }
  ).populate("userId", "name email role");
};

// Reject worker
const rejectWorker = async (id, reason) => {
  return await Worker.findByIdAndUpdate(
    id,
    {
      verificationStatus: "rejected",
      rejectionReason: reason,
      verifiedAt: null,
    },
    { new: true }
  ).populate("userId", "name email role");
};

// Get ALL registered accounts
const getAllUsers = async () => {
  return await Auth.find()
    .select("-password")
    .sort({ createdAt: -1 });
};

module.exports = {
  getAllWorkers,
  getPendingWorkers,
  getWorkerById,
  approveWorker,
  rejectWorker,
  getAllUsers,
};
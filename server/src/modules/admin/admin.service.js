const Worker = require("../worker/worker.model");

const getPendingWorkers = async () => {
    const workers = await Worker.find({
        verificationStatus: "pending",
    })
        .populate("userId", "name email role")
        .sort({ createdAt: -1 });

    return workers;
};

const getWorkerById = async (workerId) => {
    const worker = await Worker.findById(workerId)
        .populate("userId", "name email role");

    if (!worker) {
        throw new Error("Worker not found");
    }

    return worker;
};

const getAllWorkers = async () => {
    const workers = await Worker.find()
        .populate("userId", "name email role")
        .sort({ createdAt: -1 });

    return workers;
};

const approveWorker = async (workerId) => {
    const worker = await Worker.findById(workerId);

    if (!worker) {
        throw new Error("Worker not found");
    }

    if (worker.verificationStatus === "approved") {
        throw new Error("Worker is already approved");
    }

    worker.verificationStatus = "approved";
    worker.rejectionReason = null;
    worker.verifiedAt = new Date();

    await worker.save();

    return worker;
};

const rejectWorker = async (workerId, rejectionReason) => {
    const worker = await Worker.findById(workerId);

    if (!worker) {
        throw new Error("Worker not found");
    }

    if (worker.verificationStatus === "approved") {
        throw new Error("Approved worker cannot be rejected");
    }

    if (!rejectionReason || !rejectionReason.trim()) {
        throw new Error("Rejection reason is required");
    }

    worker.verificationStatus = "rejected";
    worker.rejectionReason = rejectionReason.trim();
    worker.verifiedAt = null;

    await worker.save();

    return worker;
};

module.exports = {
    getPendingWorkers,
     getWorkerById,
     approveWorker,
     rejectWorker,
     getAllWorkers,
};


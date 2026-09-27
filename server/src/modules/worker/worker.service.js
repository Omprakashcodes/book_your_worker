const Worker = require("./worker.model");
const Auth = require("../auth/auth.model");
const Review = require("../review/review.model");
const notificationService = require("../notification/notification.service");

const getRatingSummaries = async (workerIds) => {
    const summaries = await Review.aggregate([
        { $match: { workerId: { $in: workerIds } } },
        {
            $group: {
                _id: "$workerId",
                averageRating: { $avg: "$rating" },
                reviewCount: { $sum: 1 },
            },
        },
    ]);

    return new Map(summaries.map((summary) => [String(summary._id), summary]));
};

const toPublicWorker = (worker) => {
    const { aadhaarDocument, panDocument, serviceLocation, ...publicWorker } = worker;
    return publicWorker;
};

const createOrUpdateWorkerProfile = async (userId, workerData) => {
    const authUser = await Auth.findById(userId);

    if (!authUser) {
        throw new Error("User not found");
    }

    if (authUser.role !== "worker") {
        throw new Error("Only workers can create a worker profile");
    }

    const {
        phone,
        profileImage,
        skills,
        experience,
        address,
        city,
        state,
        serviceLocation,
        dailyWage,
    } = workerData;

    const worker = await Worker.findOneAndUpdate(
        { userId },
        {
            phone,
            profileImage,
            skills,
            experience,
            address,
            city,
            state,
            serviceLocation,
            dailyWage,
        },
        {
            new: true,
            upsert: true,
            runValidators: true,
        }
    );

    return worker;
};

const getMyWorkerProfile = async (userId) => {
    const worker = await Worker.findOne({ userId });

    if (!worker) {
        throw new Error("Worker profile not found");
    }

    return worker;
};

const uploadWorkerDocuments = async (userId, files) => {
    const worker = await Worker.findOne({ userId });

    if (!worker) {
        throw new Error("Worker profile not found");
    }

    const aadhaarFile = files.aadhaarDocument?.[0];
    const panFile = files.panDocument?.[0];

    worker.aadhaarDocument = `/uploads/${aadhaarFile.filename}`;
    worker.panDocument = `/uploads/${panFile.filename}`;

    worker.verificationStatus = "pending";
    worker.rejectionReason = null;
    worker.verifiedAt = null;

    await worker.save();

    // Get worker's name
    const workerUser = await Auth.findById(userId).select("name");
    const workerName = workerUser?.name || "A professional";

    // Notify worker
    await notificationService.createNotification({
        userId,
        title: "KYC Submitted Successfully! 📄",
        message:
            "Your verification documents have been submitted. Our team will review your KYC and update you once the verification is complete.",
        type: "kyc_submitted",
        relatedId: worker._id,
    });

    // Find existing admin account
    const admin = await Auth.findOne({
        role: "admin",
    });

    // Notify admin
    if (admin) {
        await notificationService.createNotification({
            userId: admin._id,
            title: "New Verification Request! 🔔",
            message:
                `${workerName} has submitted KYC documents for verification. Review the profile and documents from the Admin Dashboard.`,
            type: "kyc_submitted",
            relatedId: worker._id,
        });
    }

    return worker;
};

const getApprovedWorkers = async () => {
    const workers = await Worker.find({
        verificationStatus: "approved",
    })
        .populate("userId", "name email role")
        .lean();

    const ratingSummaries = await getRatingSummaries(workers.map((worker) => worker._id));

    return workers
        .map((worker) => {
            const summary = ratingSummaries.get(String(worker._id));
            return {
                ...toPublicWorker(worker),
                averageRating: summary?.averageRating || 0,
                reviewCount: summary?.reviewCount || 0,
            };
        })
        .sort((first, second) =>
            second.averageRating - first.averageRating ||
            second.reviewCount - first.reviewCount ||
            new Date(second.createdAt) - new Date(first.createdAt)
        )
        .map((worker) => ({
            ...worker,
            averageRating: Number(worker.averageRating.toFixed(1)),
        }));
};

const getApprovedWorkerById = async (workerId) => {
    const worker = await Worker.findOne({
        _id: workerId,
        verificationStatus: "approved",
    })
        .populate("userId", "name email role")
        .lean();

    if (!worker) {
        return null;
    }

    const [ratingSummary, reviews] = await Promise.all([
        getRatingSummaries([worker._id]),
        Review.find({ workerId: worker._id })
            .select("rating comment createdAt customerId bookingId")
            .populate("customerId", "name")
            .populate("bookingId", "service")
            .sort({ createdAt: -1 })
            .limit(20)
            .lean(),
    ]);
    const summary = ratingSummary.get(String(worker._id));

    return {
        ...toPublicWorker(worker),
        averageRating: summary ? Number(summary.averageRating.toFixed(1)) : 0,
        reviewCount: summary?.reviewCount || 0,
        reviews,
    };
};

module.exports = {
    createOrUpdateWorkerProfile,
    getMyWorkerProfile,
    uploadWorkerDocuments,
    getApprovedWorkers,
    getApprovedWorkerById,
};
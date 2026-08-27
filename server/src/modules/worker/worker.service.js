const Worker = require("./worker.model");
const Auth = require("../auth/auth.model");

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

    return worker;
};


const getApprovedWorkers = async () => {
    const workers = await Worker.find({
        verificationStatus: "approved",
    })
        .populate("userId", "name email role")
        .sort({ createdAt: -1 });

    return workers;
};
module.exports = {
    createOrUpdateWorkerProfile,
    getMyWorkerProfile,
    uploadWorkerDocuments,
    getApprovedWorkers,
};
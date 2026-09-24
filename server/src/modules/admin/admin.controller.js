const adminService = require("./admin.service");

const getPendingWorkers = async (req, res) => {
    try {
        const workers = await adminService.getPendingWorkers();

        return res.status(200).json({
            success: true,
            message: "Pending workers fetched successfully",
            data: workers,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

const getWorkerById = async (req, res) => {
    try {
        const worker = await adminService.getWorkerById(
            req.params.id
        );

        return res.status(200).json({
            success: true,
            message: "Worker details fetched successfully",
            data: worker,
        });
    } catch (error) {
        return res.status(404).json({
            success: false,
            message: error.message,
        });
    }
};

const getAllWorkers = async (req, res) => {
    try {
        const workers = await adminService.getAllWorkers();

        return res.status(200).json({
            success: true,
            message: "All workers fetched successfully",
            data: workers,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

const approveWorker = async (req, res) => {
    try {
        const worker = await adminService.approveWorker(
            req.params.id
        );

        return res.status(200).json({
            success: true,
            message: "Worker approved successfully",
            data: worker,
        });
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};

const rejectWorker = async (req, res) => {
    try {
        const { rejectionReason } = req.body;

        const worker = await adminService.rejectWorker(
            req.params.id,
            rejectionReason
        );

        return res.status(200).json({
            success: true,
            message: "Worker rejected successfully",
            data: worker,
        });
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};

// Get all registered users for Admin
const getAllUsers = async (req, res) => {
    try {
        const users = await adminService.getAllUsers();

        return res.status(200).json({
            success: true,
            message: "All users fetched successfully",
            data: users,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

module.exports = {
    getPendingWorkers,
    getWorkerById,
    approveWorker,
    rejectWorker,
    getAllWorkers,
    getAllUsers,
};
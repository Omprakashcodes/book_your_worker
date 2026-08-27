const { validationResult } = require("express-validator");
const workerService = require("./worker.service");

const createOrUpdateWorkerProfile = async (req, res) => {
    try {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                errors: errors.array(),
            });
        }

        const userId = req.user.userId;

        const result =
            await workerService.createOrUpdateWorkerProfile(
                userId,
                req.body
            );

        return res.status(200).json({
            success: true,
            message: "Worker profile saved successfully",
            data: result,
        });
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};

const getMyWorkerProfile = async (req, res) => {
    try {
        const userId = req.user.userId;

        const result =
            await workerService.getMyWorkerProfile(userId);

        return res.status(200).json({
            success: true,
            message: "Worker profile fetched successfully",
            data: result,
        });
    } catch (error) {
        return res.status(404).json({
            success: false,
            message: error.message,
        });
    }
};

const uploadWorkerDocuments = async (req, res) => {
    try {
        const userId = req.user.userId;

        if (!req.files?.aadhaarDocument) {
            return res.status(400).json({
                success: false,
                message: "Aadhaar document is required",
            });
        }

        if (!req.files?.panDocument) {
            return res.status(400).json({
                success: false,
                message: "PAN document is required",
            });
        }

        const result = await workerService.uploadWorkerDocuments(
            userId,
            req.files
        );

        return res.status(200).json({
            success: true,
            message: "Documents uploaded successfully",
            data: result,
        });
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};
const getApprovedWorkers = async (req, res) => {
    try {
        const workers = await workerService.getApprovedWorkers();

        return res.status(200).json({
            success: true,
            message: "Approved workers fetched successfully",
            data: workers,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

module.exports = {
    createOrUpdateWorkerProfile,
    getMyWorkerProfile,
    uploadWorkerDocuments,
    getApprovedWorkers,
};
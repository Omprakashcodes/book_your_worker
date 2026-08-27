const express = require("express");

const {
    getPendingWorkers,
    getWorkerById,
    approveWorker,
    rejectWorker,
    getAllWorkers,
} = require("./admin.controller");

const authMiddleware = require("../../middleware/auth.middleware");
const adminMiddleware = require("../../middleware/admin.middleware");

const router = express.Router();

router.get(
    "/workers",
    authMiddleware,
    adminMiddleware,
    getAllWorkers
);

router.get(
    "/workers/pending",
    authMiddleware,
    adminMiddleware,
    getPendingWorkers
);

router.get(
    "/workers/:id",
    authMiddleware,
    adminMiddleware,
    getWorkerById
);

router.patch(
    "/workers/:id/approve",
    authMiddleware,
    adminMiddleware,
    approveWorker
);

router.patch(
    "/workers/:id/reject",
    authMiddleware,
    adminMiddleware,
    rejectWorker
);

module.exports = router;
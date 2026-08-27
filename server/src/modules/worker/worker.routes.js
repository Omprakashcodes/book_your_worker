const express = require("express");

const {
    createOrUpdateWorkerProfile,
    getMyWorkerProfile,
    uploadWorkerDocuments,
     getApprovedWorkers,
} = require("./worker.controller");

const authMiddleware = require("../../middleware/auth.middleware");

const {
    workerProfileValidation,
} = require("./worker.validation");

const upload = require("../../middleware/upload.middleware");

const router = express.Router();

router.patch(
    "/profile",
    authMiddleware,
    workerProfileValidation,
    createOrUpdateWorkerProfile
);

router.get(
    "/me",
    authMiddleware,
    getMyWorkerProfile
);

router.post(
    "/documents",
    authMiddleware,
    upload.fields([
        {
            name: "aadhaarDocument",
            maxCount: 1,
        },
        {
            name: "panDocument",
            maxCount: 1,
        },
    ]),
    uploadWorkerDocuments
);

router.get(
    "/",
    getApprovedWorkers
);

module.exports = router;
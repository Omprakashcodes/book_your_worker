const express = require("express");

const {
    createBooking,
    getWorkerBookings,
    acceptBooking,
    rejectBooking,
    getMyBookings,
    completeBooking,
    cancelBooking,
    updateLiveLocation,
    getLiveLocation,
    issueArrivalCode,
    verifyArrivalCode,
    addSolutionPhotos,
    getEvidenceFile,
} = require("./booking.controller");

const authMiddleware = require("../../middleware/auth.middleware");
const evidenceUpload = require("../../middleware/evidence-upload.middleware");

const router = express.Router();

router.post(
    "/",
    authMiddleware,
    evidenceUpload.uploadPhotos("problemPhotos"),
    createBooking
);
router.get(
    "/worker",
    authMiddleware,
    getWorkerBookings
);
router.patch(
    "/:id/accept",
    authMiddleware,
    acceptBooking
);

router.patch(
    "/:id/reject",
    authMiddleware,
    rejectBooking
);
router.get(
    "/my",
    authMiddleware,
    getMyBookings
);
router.patch(
    "/:id/complete",
    authMiddleware,
    completeBooking
);
router.patch(
    "/:id/cancel",
    authMiddleware,
    cancelBooking
);
router.patch(
    "/:id/live-location",
    authMiddleware,
    updateLiveLocation
);
router.get(
    "/:id/live-location",
    authMiddleware,
    getLiveLocation
);
router.post("/:id/arrival-code", authMiddleware, issueArrivalCode);
router.post("/:id/verify-arrival", authMiddleware, verifyArrivalCode);
router.post("/:id/solution-photos", authMiddleware, evidenceUpload.uploadPhotos("solutionPhotos"), addSolutionPhotos);
router.get("/:id/evidence/:kind/:filename", authMiddleware, getEvidenceFile);
module.exports = router;
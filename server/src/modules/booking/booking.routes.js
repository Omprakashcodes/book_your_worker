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
} = require("./booking.controller");

const authMiddleware = require("../../middleware/auth.middleware");

const router = express.Router();

router.post(
    "/",
    authMiddleware,
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
module.exports = router;
const express = require("express");

const {
    createBooking,
    getWorkerBookings,
    acceptBooking,
    rejectBooking,
    getMyBookings,
    completeBooking,
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
module.exports = router;
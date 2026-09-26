const express = require("express");
const authMiddleware = require("../../middleware/auth.middleware");
const adminMiddleware = require("../../middleware/admin.middleware");
const reviewController = require("./review.controller");

const router = express.Router();

router.post("/bookings/:bookingId", authMiddleware, reviewController.createReview);
router.get("/bookings/:bookingId", authMiddleware, reviewController.getBookingReview);
router.get("/admin/summary", authMiddleware, adminMiddleware, reviewController.getAdminReviewSummary);

module.exports = router;
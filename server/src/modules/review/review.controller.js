const reviewService = require("./review.service");

const createReview = async (req, res) => {
    try {
        const review = await reviewService.createReview(
            req.user.userId,
            req.params.bookingId,
            req.body
        );
        return res.status(201).json({ success: true, data: review });
    } catch (error) {
        return res.status(400).json({ success: false, message: error.message });
    }
};

const getBookingReview = async (req, res) => {
    try {
        const review = await reviewService.getBookingReview(req.user.userId, req.params.bookingId);
        return res.status(200).json({ success: true, data: review });
    } catch (error) {
        return res.status(404).json({ success: false, message: error.message });
    }
};

const getAdminReviewSummary = async (req, res) => {
    try {
        const summary = await reviewService.getAdminReviewSummary();
        return res.status(200).json({ success: true, data: summary });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = { createReview, getBookingReview, getAdminReviewSummary };
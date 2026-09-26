const Booking = require("../booking/booking.model");
const Auth = require("../auth/auth.model");
const Review = require("./review.model");

const createReview = async (customerId, bookingId, { rating, comment }) => {
    const customer = await Auth.findById(customerId).select("role");
    if (!customer || customer.role !== "customer") {
        throw new Error("Only customers can submit service feedback");
    }

    const booking = await Booking.findOne({ _id: bookingId, customerId });
    if (!booking) {
        throw new Error("Booking not found");
    }
    if (booking.status !== "completed") {
        throw new Error("Feedback is available after the service is completed");
    }
    if (!Number.isInteger(Number(rating)) || Number(rating) < 1 || Number(rating) > 5) {
        throw new Error("Choose a rating from 1 to 5 stars");
    }

    const existingReview = await Review.findOne({ bookingId });
    if (existingReview) {
        throw new Error("Feedback has already been submitted for this booking");
    }

    return Review.create({
        bookingId,
        customerId,
        workerId: booking.workerId,
        rating: Number(rating),
        comment: String(comment || "").trim(),
    });
};

const getBookingReview = async (customerId, bookingId) => {
    const booking = await Booking.findOne({ _id: bookingId, customerId }).select("_id");
    if (!booking) {
        throw new Error("Booking not found");
    }
    return Review.findOne({ bookingId, customerId });
};

const getAdminReviewSummary = async () => {
    const [summary] = await Review.aggregate([
        { $group: { _id: null, count: { $sum: 1 }, averageRating: { $avg: "$rating" } } },
    ]);
    const recent = await Review.find()
        .populate("customerId", "name email")
        .populate({ path: "workerId", populate: { path: "userId", select: "name" } })
        .sort({ createdAt: -1 })
        .limit(8);

    return {
        count: summary?.count || 0,
        averageRating: summary?.averageRating || 0,
        recent,
    };
};

module.exports = { createReview, getBookingReview, getAdminReviewSummary };
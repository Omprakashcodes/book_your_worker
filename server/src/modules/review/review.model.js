const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema(
    {
        bookingId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Booking",
            required: true,
            unique: true,
        },
        customerId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Auth",
            required: true,
        },
        workerId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Worker",
            required: true,
        },
        rating: {
            type: Number,
            required: true,
            min: 1,
            max: 5,
        },
        comment: {
            type: String,
            trim: true,
            maxlength: 1000,
            default: "",
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Review", reviewSchema);
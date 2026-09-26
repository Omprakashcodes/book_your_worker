const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
    {
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

        service: {
            type: String,
            required: true,
            trim: true,
        },

        bookingDate: {
            type: Date,
            required: true,
        },

        bookingTime: {
            type: String,
            required: true,
            trim: true,
        },

        address: {
            type: String,
            required: true,
            trim: true,
        },

        description: {
            type: String,
            trim: true,
            default: "",
        },

        problemPhotos: [{
            filename: { type: String, required: true },
            originalName: { type: String, required: true },
            mimeType: { type: String, required: true },
            size: { type: Number, required: true },
            uploadedAt: { type: Date, default: Date.now },
        }],

        solutionPhotos: [{
            filename: { type: String, required: true },
            originalName: { type: String, required: true },
            mimeType: { type: String, required: true },
            size: { type: Number, required: true },
            uploadedAt: { type: Date, default: Date.now },
        }],

        amount: {
            type: Number,
            required: true,
            min: 0,
        },

        paymentStatus: {
            type: String,
            enum: ["pending", "created", "paid", "failed", "refunded"],
            default: "pending",
        },

        razorpayOrderId: {
            type: String,
            default: null,
        },

        razorpayPaymentId: {
            type: String,
            default: null,
        },

        razorpaySignature: {
            type: String,
            default: null,
        },

        liveLocation: {
            latitude: { type: Number, min: -90, max: 90, default: null },
            longitude: { type: Number, min: -180, max: 180, default: null },
            updatedAt: { type: Date, default: null },
            isSharing: { type: Boolean, default: false },
        },

        arrivalOtpHash: { type: String, default: null, select: false },
        arrivalOtpExpiresAt: { type: Date, default: null, select: false },
        arrivalOtpAttempts: { type: Number, default: 0, select: false },
        arrivalOtpVerifiedAt: { type: Date, default: null },

        status: {
            type: String,
            enum: [
                "pending",
                "accepted",
                "rejected",
                "cancelled",
                "completed",
            ],
            default: "pending",
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("Booking", bookingSchema);
const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Auth",
            required: true,
            index: true,
        },

        title: {
            type: String,
            required: true,
            trim: true,
        },

        message: {
            type: String,
            required: true,
            trim: true,
        },

        type: {
            type: String,
            enum: [
                "welcome",
                "kyc_submitted",
                "kyc_approved",
                "kyc_rejected",
                "booking_created",
                "booking_accepted",
                "booking_rejected",
                "booking_completed",
                "booking_cancelled",
            ],
            required: true,
        },

        isRead: {
            type: Boolean,
            default: false,
        },

        relatedId: {
            type: mongoose.Schema.Types.ObjectId,
            default: null,
        },
    },
    {
        timestamps: true,
    }
);

const Notification = mongoose.model(
    "Notification",
    notificationSchema
);

module.exports = Notification;
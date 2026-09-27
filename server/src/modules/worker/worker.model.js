const mongoose = require("mongoose");

const workerSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Auth",
            required: true,
            unique: true,
        },

        phone: {
            type: String,
            trim: true,
        },

        profileImage: {
            type: String,
            default: null,
        },

        skills: [
            {
                type: String,
                trim: true,
            },
        ],

        experience: {
            type: Number,
            min: 0,
            default: 0,
        },

        address: {
            type: String,
            trim: true,
        },

        city: {
            type: String,
            trim: true,
        },

        state: {
            type: String,
            trim: true,
        },

        serviceLocation: {
            latitude: { type: Number, min: -90, max: 90, required: true },
            longitude: { type: Number, min: -180, max: 180, required: true },
        },

        dailyWage: {
            type: Number,
            min: 0,
        },

        aadhaarDocument: {
            type: String,
            default: null,
        },

        panDocument: {
            type: String,
            default: null,
        },

        verificationStatus: {
            type: String,
            enum: ["pending", "approved", "rejected"],
            default: "pending",
        },

        rejectionReason: {
            type: String,
            default: null,
        },

        verifiedAt: {
            type: Date,
            default: null,
        },
    },
    {
        timestamps: true,
    }
);

const Worker = mongoose.model("Worker", workerSchema);

module.exports = Worker;
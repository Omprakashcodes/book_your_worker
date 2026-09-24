const mongoose = require("mongoose");

const authSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },

        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
        },

        phone: {
            type: String,
            trim: true,
            unique: true,
            sparse: true,
        },

        password: {
            type: String,
            required: true,
            minlength: 6,
        },

        role: {
            type: String,
            enum: ["customer", "worker", "admin"],
            default: "customer",
        },

        passwordResetTokenHash: { type: String, default: null },
        passwordResetExpiresAt: { type: Date, default: null },

    },
    {
        timestamps: true,
    }
);

const Auth = mongoose.model("Auth", authSchema);

module.exports = Auth;
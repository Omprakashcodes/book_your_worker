const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const Auth = require("./auth.model");
const notificationService = require("../notification/notification.service");
const { sendPasswordResetEmail } = require("../../utils/mailer");

const createTokenResponse = (user) => ({
    user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
    },
    token: jwt.sign(
        { userId: user._id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: "7d" }
    ),
});

const registerUser = async ({ name, email, phone, password, role }) => {
    const existingUser = await Auth.findOne({ email });

    if (existingUser) {
        throw new Error("User with this email already exists");
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await Auth.create({
        name,
        email,
        phone,
        password: hashedPassword,
        role: role || "customer",
    });

    // Create welcome notification only once during registration
  await notificationService.createNotification({
    userId: user._id,
    title: "Welcome to Servigo!",
    message:
        "Your Servigo account has been created successfully. Welcome aboard!",
    type: "welcome",
});

    return createTokenResponse(user);
};

const loginUser = async ({ email, password }) => {
    const user = await Auth.findOne({ email });

    if (!user) {
        throw new Error("Invalid email or password");
    }

    const isPasswordMatch = await bcrypt.compare(
        password,
        user.password
    );

    if (!isPasswordMatch) {
        throw new Error("Invalid email or password");
    }

    return createTokenResponse(user);
};

const requestPasswordReset = async (email) => {
    const user = await Auth.findOne({ email: email.trim().toLowerCase() });

    if (!user) {
        return;
    }

    const resetToken = crypto.randomBytes(32).toString("hex");
    user.passwordResetTokenHash = crypto
        .createHash("sha256")
        .update(resetToken)
        .digest("hex");
    user.passwordResetExpiresAt = new Date(Date.now() + 15 * 60 * 1000);
    await user.save();

    const clientUrl = process.env.CLIENT_URL || "http://localhost:3000";
    const resetUrl = `${clientUrl}/reset-password?token=${resetToken}`;
    await sendPasswordResetEmail({ to: user.email, resetUrl });
};

const resetPassword = async ({ token, password }) => {
    const tokenHash = crypto.createHash("sha256").update(token).digest("hex");
    const user = await Auth.findOne({
        passwordResetTokenHash: tokenHash,
        passwordResetExpiresAt: { $gt: new Date() },
    });

    if (!user) {
        throw new Error("This password reset link is invalid or expired");
    }

    user.password = await bcrypt.hash(password, 10);
    user.passwordResetTokenHash = null;
    user.passwordResetExpiresAt = null;
    await user.save();
};

module.exports = {
    registerUser,
    loginUser,
    requestPasswordReset,
    resetPassword,
};
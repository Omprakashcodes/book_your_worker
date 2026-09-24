const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const helmet = require("helmet");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");

// Routes
const authRoutes = require("./modules/auth/auth.routes");
const userRoutes = require("./modules/user/user.routes");
const workerRoutes = require("./modules/worker/worker.routes");
const adminRoutes = require("./modules/admin/admin.routes");
const bookingRoutes = require("./modules/booking/booking.routes");
const notificationRoutes = require("./modules/notification/notification.routes");
const paymentRoutes = require("./modules/payment/payment.routes");
const app = express();

// =========================
// Security Middleware
// =========================

app.use(helmet());

app.use(
    cors({
        origin: true,
        credentials: true,
    })
);

// =========================
// General Middleware
// =========================

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(morgan("dev"));

// =========================
// Rate Limiter
// =========================

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 300,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        success: false,
        message: "Too many requests, please try again later.",
    },
});

app.use("/api", limiter);

// =========================
// Static Files
// =========================

app.use("/uploads", express.static("src/uploads"));

// =========================
// API Routes
// =========================

app.use("/api/auth", authRoutes);

app.use("/api/users", userRoutes);

app.use("/api/workers", workerRoutes);

app.use("/api/admin", adminRoutes);

app.use("/api/bookings", bookingRoutes);

app.use("/api/notifications", notificationRoutes);

app.use("/api/payments", paymentRoutes);

// =========================
// Health Check
// =========================

app.get("/", (req, res) => {
    res.status(200).json({
        success: true,
        message: "BookMyWorker API is running",
    });
});

// =========================
// 404 Handler
// =========================

app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: `Route not found: ${req.method} ${req.originalUrl}`,
    });
});

// =========================
// Global Error Handler
// =========================

app.use((err, req, res, next) => {
    console.error("ERROR:", err);

    res.status(err.status || 500).json({
        success: false,
        message: err.message || "Internal Server Error",
    });
});

module.exports = app;
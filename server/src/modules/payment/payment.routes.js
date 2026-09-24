const express = require("express");
const authMiddleware = require("../../middleware/auth.middleware");
const { createOrder, verifyPayment } = require("./payment.controller");

const router = express.Router();

router.post("/bookings/:bookingId/order", authMiddleware, createOrder);
router.post("/bookings/:bookingId/verify", authMiddleware, verifyPayment);

module.exports = router;
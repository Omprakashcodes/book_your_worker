const crypto = require("crypto");
const Razorpay = require("razorpay");
const Booking = require("../booking/booking.model");

const getRazorpay = () => {
    if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
        throw new Error("Razorpay is not configured. Add RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET to server/.env");
    }

    return new Razorpay({
        key_id: process.env.RAZORPAY_KEY_ID,
        key_secret: process.env.RAZORPAY_KEY_SECRET,
    });
};

const createOrder = async (customerId, bookingId) => {
    const booking = await Booking.findOne({
        _id: bookingId,
        customerId,
    });

    if (!booking) {
        throw new Error("Booking not found");
    }

    if (!["pending", "created"].includes(booking.paymentStatus)) {
        throw new Error("This booking is not available for payment");
    }

    if (["cancelled", "rejected"].includes(booking.status)) {
        throw new Error("Cancelled or rejected bookings cannot be paid");
    }

    const razorpay = getRazorpay();
    const order = await razorpay.orders.create({
        amount: Math.round(booking.amount * 100),
        currency: "INR",
        receipt: `booking_${booking._id}`,
        notes: {
            bookingId: booking._id.toString(),
            customerId: customerId.toString(),
        },
    });

    booking.paymentStatus = "created";
    booking.razorpayOrderId = order.id;
    await booking.save();

    return {
        keyId: process.env.RAZORPAY_KEY_ID,
        orderId: order.id,
        amount: order.amount,
        currency: order.currency,
        bookingId: booking._id,
    };
};

const verifyPayment = async (customerId, bookingId, paymentData) => {
    const { razorpayOrderId, razorpayPaymentId, razorpaySignature } = paymentData;
    const booking = await Booking.findOne({ _id: bookingId, customerId });

    if (!booking) {
        throw new Error("Booking not found");
    }

    if (!razorpayOrderId || !razorpayPaymentId || !razorpaySignature) {
        throw new Error("Payment verification details are incomplete");
    }

    if (booking.razorpayOrderId !== razorpayOrderId) {
        throw new Error("Payment order does not match this booking");
    }

    if (!process.env.RAZORPAY_KEY_SECRET) {
        throw new Error("Razorpay is not configured. Add RAZORPAY_KEY_SECRET to server/.env");
    }

    const expectedSignature = crypto
        .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
        .update(`${razorpayOrderId}|${razorpayPaymentId}`)
        .digest("hex");

    const expectedBuffer = Buffer.from(expectedSignature);
    const receivedBuffer = Buffer.from(razorpaySignature);
    const isValidSignature =
        expectedBuffer.length === receivedBuffer.length &&
        crypto.timingSafeEqual(expectedBuffer, receivedBuffer);

    if (!isValidSignature) {
        booking.paymentStatus = "failed";
        await booking.save();
        throw new Error("Payment signature verification failed");
    }

    booking.paymentStatus = "paid";
    booking.razorpayPaymentId = razorpayPaymentId;
    booking.razorpaySignature = razorpaySignature;
    await booking.save();

    return booking;
};

module.exports = {
    createOrder,
    verifyPayment,
};
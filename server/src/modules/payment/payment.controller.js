const paymentService = require("./payment.service");

const createOrder = async (req, res) => {
    try {
        const order = await paymentService.createOrder(
            req.user.userId,
            req.params.bookingId
        );

        return res.status(201).json({ success: true, data: order });
    } catch (error) {
        return res.status(400).json({ success: false, message: error.message });
    }
};

const verifyPayment = async (req, res) => {
    try {
        const booking = await paymentService.verifyPayment(
            req.user.userId,
            req.params.bookingId,
            req.body
        );

        return res.status(200).json({
            success: true,
            message: "Payment verified successfully",
            data: booking,
        });
    } catch (error) {
        return res.status(400).json({ success: false, message: error.message });
    }
};

module.exports = {
    createOrder,
    verifyPayment,
};
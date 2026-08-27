const bookingService = require("./booking.service");

const createBooking = async (req, res) => {
    try {
        const booking = await bookingService.createBooking(
            req.user.userId,
            req.body
        );

        return res.status(201).json({
            success: true,
            message: "Booking created successfully",
            data: booking,
        });
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};
const getWorkerBookings = async (req, res) => {
    try {
        const bookings = await bookingService.getWorkerBookings(
            req.user.userId
        );

        return res.status(200).json({
            success: true,
            message: "Worker bookings fetched successfully",
            data: bookings,
        });
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};

const acceptBooking = async (req, res) => {
    try {
        const booking = await bookingService.acceptBooking(
            req.user.userId,
            req.params.id
        );

        return res.status(200).json({
            success: true,
            message: "Booking accepted successfully",
            data: booking,
        });
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};

const rejectBooking = async (req, res) => {
    try {
        const booking = await bookingService.rejectBooking(
            req.user.userId,
            req.params.id
        );

        return res.status(200).json({
            success: true,
            message: "Booking rejected successfully",
            data: booking,
        });
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};
const getMyBookings = async (req, res) => {
    try {
        const bookings = await bookingService.getMyBookings(
            req.user.userId
        );

        return res.status(200).json({
            success: true,
            message: "My bookings fetched successfully",
            data: bookings,
        });
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};
const completeBooking = async (req, res) => {
    try {
        const booking = await bookingService.completeBooking(
            req.user.userId,
            req.params.id
        );

        return res.status(200).json({
            success: true,
            message: "Booking completed successfully",
            data: booking,
        });
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};
module.exports = {
    createBooking,
    getWorkerBookings,
    acceptBooking,
    rejectBooking,
    getMyBookings,
    completeBooking,
};
const bookingService = require("./booking.service");

const createBooking = async (req, res) => {
    try {
        const booking = await bookingService.createBooking(
            req.user.userId,
            req.body,
            req.files || []
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
const cancelBooking = async (req, res) => {
    try {
        const booking = await bookingService.cancelBooking(
            req.user.userId,
            req.params.id
        );

        return res.status(200).json({
            success: true,
            message: "Booking cancelled successfully",
            data: booking,
        });
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};
const updateLiveLocation = async (req, res) => {
    try {
        const location = await bookingService.updateLiveLocation(
            req.user.userId,
            req.params.id,
            req.body
        );
        return res.status(200).json({ success: true, data: location });
    } catch (error) {
        return res.status(400).json({ success: false, message: error.message });
    }
};

const getLiveLocation = async (req, res) => {
    try {
        const location = await bookingService.getLiveLocation(
            req.user.userId,
            req.params.id
        );
        return res.status(200).json({ success: true, data: location });
    } catch (error) {
        return res.status(400).json({ success: false, message: error.message });
    }
};

const issueArrivalCode = async (req, res) => {
    try {
        const result = await bookingService.issueArrivalCode(req.user.userId, req.params.id);
        return res.status(200).json({ success: true, data: result });
    } catch (error) {
        return res.status(400).json({ success: false, message: error.message });
    }
};

const verifyArrivalCode = async (req, res) => {
    try {
        const booking = await bookingService.verifyArrivalCode(
            req.user.userId,
            req.params.id,
            req.body.code
        );
        return res.status(200).json({ success: true, data: booking });
    } catch (error) {
        return res.status(400).json({ success: false, message: error.message });
    }
};

const addSolutionPhotos = async (req, res) => {
    try {
        if (!req.files?.length) {
            return res.status(400).json({ success: false, message: "Choose at least one solution photo" });
        }
        const photos = await bookingService.addSolutionPhotos(
            req.user.userId,
            req.params.id,
            req.files
        );
        return res.status(200).json({ success: true, data: photos });
    } catch (error) {
        return res.status(400).json({ success: false, message: error.message });
    }
};

const getEvidenceFile = async (req, res) => {
    try {
        const evidence = await bookingService.getEvidenceFile(
            req.user.userId,
            req.params.id,
            req.params.kind,
            req.params.filename
        );
        res.set("Cache-Control", "private, no-store");
        res.set("X-Content-Type-Options", "nosniff");
        return res.type(evidence.mimeType).send(evidence.buffer);
    } catch (error) {
        const status = error.message.includes("authorized") ? 403 : 404;
        return res.status(status).json({ success: false, message: error.message });
    }
};
module.exports = {
    createBooking,
    getWorkerBookings,
    acceptBooking,
    rejectBooking,
    getMyBookings,
    completeBooking,
    cancelBooking,
    updateLiveLocation,
    getLiveLocation,
    issueArrivalCode,
    verifyArrivalCode,
    addSolutionPhotos,
    getEvidenceFile,
};
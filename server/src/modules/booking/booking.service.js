const Booking = require("./booking.model");
const Worker = require("../worker/worker.model");

const createBooking = async (customerId, bookingData) => {
    const {
        workerId,
        service,
        bookingDate,
        bookingTime,
        address,
        description,
        amount,
    } = bookingData;

    const worker = await Worker.findById(workerId);

    if (!worker) {
        throw new Error("Worker not found");
    }

    if (worker.verificationStatus !== "approved") {
        throw new Error("Worker is not approved");
    }

    if (!service || !bookingDate || !bookingTime || !address || amount === undefined) {
        throw new Error("Required booking fields are missing");
    }

    const booking = await Booking.create({
        customerId,
        workerId,
        service,
        bookingDate,
        bookingTime,
        address,
        description,
        amount,
        status: "pending",
    });

    return booking;
};

const getWorkerBookings = async (workerUserId) => {
    const worker = await Worker.findOne({
        userId: workerUserId,
    });

    if (!worker) {
        throw new Error("Worker profile not found");
    }

    const bookings = await Booking.find({
        workerId: worker._id,
    })
        .populate("customerId", "name email")
        .populate("workerId", "phone skills dailyWage")
        .sort({ createdAt: -1 });

    return bookings;
};

const acceptBooking = async (workerUserId, bookingId) => {
    const worker = await Worker.findOne({
        userId: workerUserId,
    });

    if (!worker) {
        throw new Error("Worker profile not found");
    }

    const booking = await Booking.findById(bookingId);

    if (!booking) {
        throw new Error("Booking not found");
    }

    if (booking.workerId.toString() !== worker._id.toString()) {
        throw new Error("You are not authorized to accept this booking");
    }

    if (booking.status !== "pending") {
        throw new Error("Only pending bookings can be accepted");
    }

    booking.status = "accepted";

    await booking.save();

    return booking;
};
const rejectBooking = async (workerUserId, bookingId) => {
    const worker = await Worker.findOne({
        userId: workerUserId,
    });

    if (!worker) {
        throw new Error("Worker profile not found");
    }

    const booking = await Booking.findById(bookingId);

    if (!booking) {
        throw new Error("Booking not found");
    }

    if (booking.workerId.toString() !== worker._id.toString()) {
        throw new Error("You are not authorized to reject this booking");
    }

    if (booking.status !== "pending") {
        throw new Error("Only pending bookings can be rejected");
    }

    booking.status = "rejected";

    await booking.save();

    return booking;
};
const getMyBookings = async (customerId) => {
    const bookings = await Booking.find({
        customerId,
    })
        .populate("workerId", "phone skills dailyWage userId")
        .populate("customerId", "name email")
        .sort({ createdAt: -1 });

    return bookings;
};
const completeBooking = async (workerUserId, bookingId) => {
    const worker = await Worker.findOne({
        userId: workerUserId,
    });

    if (!worker) {
        throw new Error("Worker profile not found");
    }

    const booking = await Booking.findById(bookingId);

    if (!booking) {
        throw new Error("Booking not found");
    }

    if (booking.workerId.toString() !== worker._id.toString()) {
        throw new Error("You are not authorized to complete this booking");
    }

    if (booking.status !== "accepted") {
        throw new Error("Only accepted bookings can be completed");
    }

    booking.status = "completed";

    await booking.save();

    return booking;
};
module.exports = {
    createBooking,
    getWorkerBookings,
    acceptBooking,
    rejectBooking,
    getMyBookings,
    completeBooking,
};
const Booking = require("./booking.model");
const Worker = require("../worker/worker.model");
const Auth = require("../auth/auth.model");
const notificationService = require("../notification/notification.service");
const crypto = require("crypto");
const fs = require("fs/promises");
const path = require("path");
const { evidenceDirectory, toEvidenceRecord } = require("../../middleware/evidence-upload.middleware");

const removeUploadedFiles = async (files = []) => {
    await Promise.all(files.map((file) => fs.unlink(file.path).catch(() => {})));
};

const createBooking = async (customerId, bookingData, problemPhotos = []) => {
    const discardUploads = () => removeUploadedFiles(problemPhotos);
    const customer = await Auth.findById(customerId);

    if (!customer) {
        await discardUploads();
        throw new Error("User not found");
    }

    if (customer.role !== "customer") {
        await discardUploads();
        throw new Error("Only customers can create bookings");
    }

    const {
        workerId,
        service,
        bookingDate,
        bookingTime,
        address,
        description,
    } = bookingData;

    const worker = await Worker.findById(workerId);

    if (!worker) {
        await discardUploads();
        throw new Error("Worker not found");
    }

    if (worker.verificationStatus !== "approved") {
        await discardUploads();
        throw new Error("Worker is not approved");
    }

    if (
        !service ||
        !bookingDate ||
        !bookingTime ||
        !address
    ) {
        await discardUploads();
        throw new Error("Required booking fields are missing");
    }

    const amount = Number(worker.dailyWage);

    if (!Number.isFinite(amount) || amount <= 0) {
        await discardUploads();
        throw new Error("Worker pricing is not configured");
    }

    const booking = await Booking.create({
        customerId,
        workerId,
        service,
        bookingDate,
        bookingTime,
        address,
        description,
        problemPhotos: problemPhotos.map(toEvidenceRecord),
        amount,
        status: "pending",
    });

    // Notify worker about the new booking
    await notificationService.createNotification({
        userId: worker.userId,
        title: "New Booking Request! 🔔",
        message:
            `A customer has requested your ${service} service. Review the booking and respond now.`,
        type: "booking_created",
        relatedId: booking._id,
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
        .select("-arrivalOtpHash -arrivalOtpExpiresAt")
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
    booking.arrivalOtpVerifiedAt = null;
    booking.arrivalOtpHash = null;
    booking.arrivalOtpExpiresAt = null;

    await booking.save();

    // Notify customer about accepted booking
    await notificationService.createNotification({
        userId: booking.customerId,
        title: "Booking Accepted! 🎉",
        message:
            `Your ${booking.service} booking has been accepted by the professional. You're all set!`,
        type: "booking_accepted",
        relatedId: booking._id,
    });

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

    // Notify customer about rejected booking
    await notificationService.createNotification({
        userId: booking.customerId,
        title: "Booking Update",
        message:
            `Unfortunately, your ${booking.service} booking could not be accepted. Explore other trusted professionals on Servigo.`,
        type: "booking_rejected",
        relatedId: booking._id,
    });

    return booking;
};

const getMyBookings = async (customerId) => {
    const bookings = await Booking.find({
        customerId,
    })
        .populate("workerId", "phone skills dailyWage userId")
        .populate("customerId", "name email")
        .select("-arrivalOtpHash -arrivalOtpExpiresAt")
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

    if (!booking.arrivalOtpVerifiedAt) {
        throw new Error("Verify the customer's arrival code before completing this booking");
    }
    if (!booking.solutionPhotos?.length) {
        throw new Error("Upload at least one solution photo before completing this booking");
    }

    booking.status = "completed";

    await booking.save();

    // Notify customer
    await notificationService.createNotification({
        userId: booking.customerId,
        title: "Service Completed! ⭐",
        message:
            `Your ${booking.service} service has been successfully completed. Thank you for choosing Servigo!`,
        type: "booking_completed",
        relatedId: booking._id,
    });

    // Notify worker
    await notificationService.createNotification({
        userId: worker.userId,
        title: "Service Completed! ✅",
        message:
            `The ${booking.service} booking has been successfully completed. Great work!`,
        type: "booking_completed",
        relatedId: booking._id,
    });

    return booking;
};

const cancelBooking = async (customerId, bookingId) => {
    const booking = await Booking.findById(bookingId);

    if (!booking) {
        throw new Error("Booking not found");
    }

    if (booking.customerId.toString() !== customerId.toString()) {
        throw new Error("You are not authorized to cancel this booking");
    }

    if (booking.status !== "pending") {
        throw new Error("Only pending bookings can be cancelled");
    }

    booking.status = "cancelled";

    await booking.save();

    // Get worker so we can notify them
    const worker = await Worker.findById(booking.workerId);

    if (worker) {
        await notificationService.createNotification({
            userId: worker.userId,
            title: "Booking Cancelled",
            message:
                `The customer has cancelled the ${booking.service} booking.`,
            type: "booking_cancelled",
            relatedId: booking._id,
        });
    }

    return booking;
};

const updateLiveLocation = async (workerUserId, bookingId, locationData) => {
    const worker = await Worker.findOne({ userId: workerUserId });
    const booking = await Booking.findById(bookingId);

    if (!worker || !booking || booking.workerId.toString() !== worker._id.toString()) {
        throw new Error("You are not authorized to share location for this booking");
    }

    if (booking.status !== "accepted") {
        throw new Error("Live location is available only for accepted bookings");
    }

    const latitude = Number(locationData.latitude);
    const longitude = Number(locationData.longitude);

    if (!Number.isFinite(latitude) || latitude < -90 || latitude > 90 ||
        !Number.isFinite(longitude) || longitude < -180 || longitude > 180) {
        throw new Error("Valid latitude and longitude are required");
    }

    booking.liveLocation = {
        latitude,
        longitude,
        updatedAt: new Date(),
        isSharing: locationData.isSharing !== false,
    };
    await booking.save();
    return booking.liveLocation;
};

const getLiveLocation = async (customerId, bookingId) => {
    const booking = await Booking.findOne({ _id: bookingId, customerId }).select("status liveLocation");

    if (!booking) {
        throw new Error("Booking not found");
    }

    if (!booking.liveLocation?.isSharing || booking.liveLocation.latitude === null) {
        return { isSharing: false, latitude: null, longitude: null, updatedAt: null };
    }

    return booking.liveLocation;
};

const issueArrivalCode = async (customerId, bookingId) => {
    const booking = await Booking.findOne({ _id: bookingId, customerId });

    if (!booking) {
        throw new Error("Booking not found");
    }
    if (booking.status !== "accepted") {
        throw new Error("Arrival codes are available for accepted bookings only");
    }
    if (booking.arrivalOtpVerifiedAt) {
        throw new Error("Arrival has already been verified");
    }

    const code = crypto.randomInt(100000, 1000000).toString();
    booking.arrivalOtpHash = crypto.createHash("sha256").update(code).digest("hex");
    booking.arrivalOtpExpiresAt = new Date(Date.now() + 4 * 60 * 60 * 1000);
    booking.arrivalOtpAttempts = 0;
    await booking.save();

    return { code, expiresAt: booking.arrivalOtpExpiresAt };
};

const verifyArrivalCode = async (workerUserId, bookingId, code) => {
    const worker = await Worker.findOne({ userId: workerUserId });
    const booking = await Booking.findById(bookingId).select("+arrivalOtpHash +arrivalOtpExpiresAt +arrivalOtpAttempts");

    if (!worker || !booking || booking.workerId.toString() !== worker._id.toString()) {
        throw new Error("You are not authorized to verify this booking's arrival code");
    }
    if (booking.status !== "accepted") {
        throw new Error("Arrival can only be verified for accepted bookings");
    }
    if (!/^\d{6}$/.test(String(code || ""))) {
        throw new Error("Enter the 6-digit arrival code");
    }
    if (!booking.arrivalOtpHash || !booking.arrivalOtpExpiresAt || booking.arrivalOtpExpiresAt <= new Date()) {
        throw new Error("Arrival code is missing or expired. Ask the customer to generate a new code");
    }
    if (booking.arrivalOtpAttempts >= 5) {
        throw new Error("Too many incorrect attempts. Ask the customer to generate a new code");
    }

    const submittedHash = crypto.createHash("sha256").update(String(code)).digest();
    const storedHash = Buffer.from(booking.arrivalOtpHash, "hex");
    if (submittedHash.length !== storedHash.length || !crypto.timingSafeEqual(submittedHash, storedHash)) {
        booking.arrivalOtpAttempts += 1;
        if (booking.arrivalOtpAttempts >= 5) {
            booking.arrivalOtpHash = null;
            booking.arrivalOtpExpiresAt = null;
        }
        await booking.save();
        throw new Error("Incorrect arrival code");
    }

    booking.arrivalOtpVerifiedAt = new Date();
    booking.arrivalOtpHash = null;
    booking.arrivalOtpExpiresAt = null;
    booking.arrivalOtpAttempts = 0;
    await booking.save();
    return booking;
};

const addSolutionPhotos = async (workerUserId, bookingId, photoFiles) => {
    const cleanup = () => removeUploadedFiles(photoFiles);
    const worker = await Worker.findOne({ userId: workerUserId });
    const booking = await Booking.findById(bookingId);

    if (!worker || !booking || booking.workerId.toString() !== worker._id.toString()) {
        await cleanup();
        throw new Error("You are not authorized to upload evidence for this booking");
    }
    if (booking.status !== "accepted" || !booking.arrivalOtpVerifiedAt) {
        await cleanup();
        throw new Error("Verify arrival before uploading solution photos");
    }
    if (booking.solutionPhotos.length + photoFiles.length > 5) {
        await cleanup();
        throw new Error("A maximum of five solution photos is allowed per booking");
    }

    booking.solutionPhotos.push(...photoFiles.map(toEvidenceRecord));
    await booking.save();
    return booking.solutionPhotos;
};

const getEvidenceFile = async (userId, bookingId, kind, filename) => {
    if (!["problem", "solution"].includes(kind) || !/^[a-f0-9-]+\.(jpg|jpeg|png|webp|gif)$/i.test(filename)) {
        throw new Error("Evidence file not found");
    }

    const booking = await Booking.findById(bookingId).select("customerId workerId problemPhotos solutionPhotos");
    if (!booking) {
        throw new Error("Booking not found");
    }

    const user = await Auth.findById(userId).select("role");
    let isAuthorized = booking.customerId.toString() === userId.toString();
    if (!isAuthorized && user?.role === "worker") {
        const worker = await Worker.findOne({ userId });
        isAuthorized = Boolean(worker && booking.workerId.toString() === worker._id.toString());
    }
    if (!isAuthorized) {
        throw new Error("You are not authorized to view this evidence");
    }

    const photoList = kind === "problem" ? booking.problemPhotos : booking.solutionPhotos;
    const photo = photoList.find((item) => item.filename === filename);
    if (!photo) {
        throw new Error("Evidence file not found");
    }

    return {
        filePath: path.join(evidenceDirectory, filename),
        mimeType: photo.mimeType,
    };
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
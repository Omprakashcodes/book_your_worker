const Booking = require("./booking.model");
const Worker = require("../worker/worker.model");
const Auth = require("../auth/auth.model");
const notificationService = require("../notification/notification.service");
const crypto = require("crypto");
const {
    uploadEvidenceFiles,
    deleteEvidenceFiles,
    getAuthenticatedEvidence,
} = require("../../middleware/evidence-upload.middleware");

const MAX_BOOKING_DISTANCE_KM = 50;
const URGENT_BOOKING_SURCHARGE_RATE = 0.2;

const getDistanceInKm = (first, second) => {
    const toRadians = (degrees) => degrees * Math.PI / 180;
    const latitudeDelta = toRadians(second.latitude - first.latitude);
    const longitudeDelta = toRadians(second.longitude - first.longitude);
    const firstLatitude = toRadians(first.latitude);
    const secondLatitude = toRadians(second.latitude);
    const haversine = Math.sin(latitudeDelta / 2) ** 2 +
        Math.cos(firstLatitude) * Math.cos(secondLatitude) * Math.sin(longitudeDelta / 2) ** 2;
    const normalizedHaversine = Math.min(1, Math.max(0, haversine));
    return 6371 * 2 * Math.atan2(Math.sqrt(normalizedHaversine), Math.sqrt(1 - normalizedHaversine));
};

const createBooking = async (customerId, bookingData, problemPhotos = []) => {
    const customer = await Auth.findById(customerId);

    if (!customer) {
        throw new Error("User not found");
    }

    if (customer.role !== "customer") {
        throw new Error("Only customers can create bookings");
    }

    const {
        workerId,
        service,
        bookingDate,
        bookingTime,
        address,
        description,
        customerLatitude,
        customerLongitude,
        isUrgent: urgentValue,
    } = bookingData;
    const isUrgent = urgentValue === true || urgentValue === "true";

    const worker = await Worker.findById(workerId);

    if (!worker) {
        throw new Error("Worker not found");
    }

    if (worker.verificationStatus !== "approved") {
        throw new Error("Worker is not approved");
    }

    const customerLocation = {
        latitude: Number(customerLatitude),
        longitude: Number(customerLongitude),
    };
    if (!Number.isFinite(customerLocation.latitude) || customerLocation.latitude < -90 || customerLocation.latitude > 90 ||
        !Number.isFinite(customerLocation.longitude) || customerLocation.longitude < -180 || customerLocation.longitude > 180) {
        throw new Error("Share your current location to check the 50 km booking area");
    }
    if (!Number.isFinite(worker.serviceLocation?.latitude) || !Number.isFinite(worker.serviceLocation?.longitude)) {
        throw new Error("This worker has not set a service location yet. Please choose another worker or ask them to update their profile");
    }

    const distance = getDistanceInKm(customerLocation, worker.serviceLocation);
    if (distance > MAX_BOOKING_DISTANCE_KM) {
        throw new Error(`This worker is about ${Math.round(distance)} km away. You can only book workers within 50 km`);
    }

    if (
        !service ||
        !bookingDate ||
        !bookingTime ||
        !address
    ) {
        throw new Error("Required booking fields are missing");
    }

    const baseAmount = Number(worker.dailyWage);

    if (!Number.isFinite(baseAmount) || baseAmount <= 0) {
        throw new Error("Worker pricing is not configured");
    }

    const urgencyFee = isUrgent ? Math.round(baseAmount * URGENT_BOOKING_SURCHARGE_RATE) : 0;
    const amount = baseAmount + urgencyFee;

    const storedProblemPhotos = await uploadEvidenceFiles(problemPhotos);
    let booking;
    try {
        booking = await Booking.create({
            customerId,
            workerId,
            service,
            bookingDate,
            bookingTime,
            address,
            description,
            problemPhotos: storedProblemPhotos,
            baseAmount,
            urgencyFee,
            isUrgent,
            amount,
            status: "pending",
        });
    } catch (error) {
        await deleteEvidenceFiles(storedProblemPhotos);
        throw error;
    }

    // Notify worker about the new booking
    await notificationService.createNotification({
        userId: worker.userId,
        title: isUrgent ? "Urgent Booking Request! ⚡" : "New Booking Request! 🔔",
        message: isUrgent
            ? `A customer marked their ${service} booking urgent. Please prioritize this request.`
            : `A customer has requested your ${service} service. Review the booking and respond now.`,
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
    const worker = await Worker.findOne({ userId: workerUserId });
    const booking = await Booking.findById(bookingId);

    if (!worker || !booking || booking.workerId.toString() !== worker._id.toString()) {
        throw new Error("You are not authorized to upload evidence for this booking");
    }
    if (booking.status !== "accepted" || !booking.arrivalOtpVerifiedAt) {
        throw new Error("Verify arrival before uploading solution photos");
    }
    if (booking.solutionPhotos.length + photoFiles.length > 5) {
        throw new Error("A maximum of five solution photos is allowed per booking");
    }

    const storedPhotos = await uploadEvidenceFiles(photoFiles);
    booking.solutionPhotos.push(...storedPhotos);
    try {
        await booking.save();
    } catch (error) {
        await deleteEvidenceFiles(storedPhotos);
        throw error;
    }
    return booking.solutionPhotos;
};

const addProblemPhotos = async (customerId, bookingId, photoFiles) => {
    const booking = await Booking.findOne({ _id: bookingId, customerId });

    if (!booking) {
        throw new Error("Booking not found");
    }
    if (!["pending", "accepted"].includes(booking.status)) {
        throw new Error("Problem photos can only be added to active bookings");
    }
    if (booking.problemPhotos.length + photoFiles.length > 5) {
        throw new Error("A maximum of five problem photos is allowed per booking");
    }

    const storedPhotos = await uploadEvidenceFiles(photoFiles);
    booking.problemPhotos.push(...storedPhotos);
    try {
        await booking.save();
    } catch (error) {
        await deleteEvidenceFiles(storedPhotos);
        throw error;
    }
    return booking.problemPhotos;
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

    return getAuthenticatedEvidence(photo);
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
    addProblemPhotos,
    getEvidenceFile,
};
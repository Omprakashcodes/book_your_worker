const multer = require("multer");
const path = require("path");
const fs = require("fs");
const crypto = require("crypto");

const evidenceDirectory = process.env.BOOKING_UPLOAD_DIR
    ? path.resolve(process.env.BOOKING_UPLOAD_DIR)
    : path.resolve(__dirname, "../../private_uploads/booking-evidence");

fs.mkdirSync(evidenceDirectory, { recursive: true });

const storage = multer.diskStorage({
    destination: (_req, _file, callback) => callback(null, evidenceDirectory),
    filename: (_req, file, callback) => {
        const extension = path.extname(file.originalname).toLowerCase();
        callback(null, `${crypto.randomUUID()}${extension}`);
    },
});

const allowedImageTypes = new Map([
    ["image/jpeg", new Set([".jpg", ".jpeg"])],
    ["image/png", new Set([".png"])],
    ["image/webp", new Set([".webp"])],
    ["image/gif", new Set([".gif"])],
]);

const upload = multer({
    storage,
    fileFilter: (_req, file, callback) => {
        const allowedExtensions = allowedImageTypes.get(file.mimetype);
        const extension = path.extname(file.originalname).toLowerCase();
        if (!allowedExtensions?.has(extension)) {
            return callback(new Error("Upload a JPG, PNG, WebP or GIF image"));
        }
        callback(null, true);
    },
    limits: { fileSize: 8 * 1024 * 1024, files: 5 },
});

const uploadPhotos = (fieldName) => (req, res, next) => {
    upload.array(fieldName, 5)(req, res, (error) => {
        if (error) {
            return res.status(400).json({ success: false, message: error.message });
        }
        next();
    });
};

const toEvidenceRecord = (file) => ({
    filename: file.filename,
    originalName: path.basename(file.originalname).slice(0, 180),
    mimeType: file.mimetype,
    size: file.size,
    uploadedAt: new Date(),
});

module.exports = { uploadPhotos, toEvidenceRecord, evidenceDirectory };
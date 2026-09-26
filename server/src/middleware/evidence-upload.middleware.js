const multer = require("multer");
const path = require("path");
const crypto = require("crypto");
const { Readable } = require("stream");
const cloudinary = require("cloudinary").v2;

const allowedImageTypes = new Map([
    ["image/jpeg", new Set([".jpg", ".jpeg"])],
    ["image/png", new Set([".png"])],
    ["image/webp", new Set([".webp"])],
    ["image/gif", new Set([".gif"])],
]);

const upload = multer({
    storage: multer.memoryStorage(),
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
    publicId: file.publicId,
    version: file.version,
    originalName: path.basename(file.originalname).slice(0, 180),
    mimeType: file.mimetype,
    size: file.size,
    uploadedAt: new Date(),
});

const configureCloudinary = () => {
    const requiredSettings = ["CLOUDINARY_CLOUD_NAME", "CLOUDINARY_API_KEY", "CLOUDINARY_API_SECRET"];
    const missingSetting = requiredSettings.find((setting) => !process.env[setting]);
    if (missingSetting) {
        throw new Error(`Photo storage is not configured. Missing ${missingSetting}`);
    }

    cloudinary.config({
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET,
        secure: true,
    });
    return cloudinary;
};

const uploadEvidenceFiles = async (files = []) => {
    if (!files.length) return [];
    const client = configureCloudinary();
    const uploadedAssets = [];

    try {
        for (const file of files) {
            const publicId = crypto.randomUUID();
            const result = await new Promise((resolve, reject) => {
                const uploadStream = client.uploader.upload_stream({
                    resource_type: "image",
                    type: "authenticated",
                    folder: "booking-evidence",
                    public_id: publicId,
                    tags: ["booking-evidence"],
                    context: { original_name: path.basename(file.originalname).slice(0, 180) },
                }, (error, uploadResult) => {
                    if (error) return reject(error);
                    resolve(uploadResult);
                });
                Readable.from(file.buffer).pipe(uploadStream);
            });

            const extension = path.extname(file.originalname).toLowerCase();
            uploadedAssets.push({
                ...file,
                filename: `${publicId}${extension}`,
                publicId: result.public_id,
                version: result.version,
            });
        }
        return uploadedAssets.map(toEvidenceRecord);
    } catch (error) {
        await Promise.all(uploadedAssets.map((asset) => client.uploader.destroy(asset.publicId, {
            resource_type: "image",
            type: "authenticated",
            invalidate: true,
        }).catch(() => {})));
        throw error;
    }
};

const deleteEvidenceFiles = async (photos = []) => {
    if (!photos.length) return;
    const client = configureCloudinary();
    await Promise.all(photos.filter((photo) => photo.publicId).map((photo) => client.uploader.destroy(photo.publicId, {
        resource_type: "image",
        type: "authenticated",
        invalidate: true,
    }).catch(() => {})));
};

const getAuthenticatedEvidence = async (photo) => {
    if (!photo.publicId) {
        throw new Error("This photo uses the old storage format and is no longer available");
    }

    const client = configureCloudinary();
    const signedUrl = client.url(photo.publicId, {
        resource_type: "image",
        type: "authenticated",
        sign_url: true,
        secure: true,
        version: photo.version,
    });
    const response = await fetch(signedUrl);
    if (!response.ok) {
        throw new Error(`Could not retrieve evidence photo from Cloudinary (${response.status})`);
    }

    return {
        buffer: Buffer.from(await response.arrayBuffer()),
        mimeType: response.headers.get("content-type") || photo.mimeType,
    };
};

module.exports = { uploadPhotos, uploadEvidenceFiles, deleteEvidenceFiles, getAuthenticatedEvidence, toEvidenceRecord };
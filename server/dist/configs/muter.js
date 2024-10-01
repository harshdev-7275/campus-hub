"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadMultiple = exports.uploadSingle = void 0;
const multer_1 = __importDefault(require("multer"));
// Multer setup for in-memory file handling
const storage = multer_1.default.memoryStorage();
// Multer filter for limiting the allowed file types
const fileFilter = (req, file, cb) => {
    const allowedMimeTypes = [
        "image/jpeg",
        "image/png",
        "image/gif",
        "video/mp4",
    ];
    if (allowedMimeTypes.includes(file.mimetype)) {
        cb(null, true);
    }
    else {
        cb(new Error("Invalid file type! Only images and videos are allowed."));
    }
};
// Create Multer instance with defined storage and file filter
const upload = (0, multer_1.default)({
    storage,
    fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024, // Limit file size to 5MB
    },
});
// Handle both single and multiple file uploads
const uploadSingle = upload.single("file"); // For profile picture
exports.uploadSingle = uploadSingle;
const uploadMultiple = upload.array("mediaFiles", 10); // For multiple file uploads (e.g., for posts)
exports.uploadMultiple = uploadMultiple;

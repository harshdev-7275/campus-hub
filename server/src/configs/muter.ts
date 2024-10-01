import multer from "multer";
import { Request } from "express";
import path from "path";

// Multer setup for in-memory file handling
const storage = multer.memoryStorage();

// Multer filter for limiting the allowed file types
const fileFilter = (req: Request, file: Express.Multer.File, cb: any) => {
  const allowedMimeTypes = [
    "image/jpeg",
    "image/png",
    "image/gif",
    "video/mp4",
  ];
  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Invalid file type! Only images and videos are allowed."));
  }
};

// Create Multer instance with defined storage and file filter
const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // Limit file size to 5MB
  },
});

// Handle both single and multiple file uploads
const uploadSingle = upload.single("file"); // For profile picture
const uploadMultiple = upload.array("mediaFiles", 10); // For multiple file uploads (e.g., for posts)

// Export the middleware
export { uploadSingle, uploadMultiple };

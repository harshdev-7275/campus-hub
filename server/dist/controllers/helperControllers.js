"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCompleteUserDataWithProfile = exports.uploadImage = exports.getAllColleges = void 0;
const prisma_1 = require("../configs/prisma");
const client_s3_1 = require("@aws-sdk/client-s3");
const s3Config_1 = require("../configs/s3Config");
const uuid_1 = require("uuid");
const path_1 = __importDefault(require("path"));
const getAllColleges = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const colleges = yield prisma_1.prisma.college.findMany({});
        if (!colleges) {
            return res.status(204).json({
                success: false,
                message: "No colleges found",
            });
        }
        return res.status(200).json({
            success: true,
            colleges: colleges,
        });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
});
exports.getAllColleges = getAllColleges;
const uploadImage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log("req.file", req);
        // Check if a file is uploaded (via multer's single upload)
        if (req.file) {
            const fileExtension = path_1.default.extname(req.file.originalname);
            const fileName = `${(0, uuid_1.v4)()}${fileExtension}`;
            const uploadParams = {
                Bucket: process.env.AWS_S3_BUCKET,
                Key: fileName,
                Body: req.file.buffer,
                ContentType: req.file.mimetype,
            };
            const command = new client_s3_1.PutObjectCommand(uploadParams);
            const result = yield s3Config_1.s3Client.send(command);
            console.log("--------result", result);
            const s3Url = `https://${uploadParams.Bucket}.s3.amazonaws.com/${fileName}`;
            console.log("--------s3 url", s3Url);
            return res.status(200).json({
                success: true,
                data: s3Url,
                message: "Image uploaded successfully",
            });
        }
        // If no file is uploaded, just update the bio
        return res.status(500).json({
            success: false,
            message: "Error updating profile",
        });
    }
    catch (error) {
        console.error("Error updating profile:", error);
        return res.status(500).json({ message: "Error updating profile" });
    }
});
exports.uploadImage = uploadImage;
const getCompleteUserDataWithProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const users = yield prisma_1.prisma.user.findFirst({
            where: {
                id: (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId,
            },
            include: {
                userProfile: true, // This includes the user profile if it exists
            },
        });
        if (!users) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }
        return res.status(200).json({
            success: true,
            data: users,
        });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
});
exports.getCompleteUserDataWithProfile = getCompleteUserDataWithProfile;

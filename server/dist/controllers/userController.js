"use strict";
// src/controllers/userController.ts
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
exports.updateUserProfile = exports.getUserProfile = exports.getCompleteUserData = exports.updateUser = exports.checkUsername = exports.getUserData = void 0;
const prisma_1 = require("../configs/prisma");
const client_s3_1 = require("@aws-sdk/client-s3");
const s3Config_1 = require("../configs/s3Config");
const uuid_1 = require("uuid");
const path_1 = __importDefault(require("path"));
const getUserData = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.user) {
            return res.status(404).json({
                success: false,
                message: "Not found!",
            });
        }
        return res.status(200).json({
            success: true,
            message: "User fetched successfully",
            data: req.user,
        });
    }
    catch (error) {
        console.log(error);
        return res.status(501).json({
            success: false,
            message: "Internal server error!",
        });
    }
});
exports.getUserData = getUserData;
const checkUsername = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { username } = req.query;
        if (!username) {
            return res.status(400).json({
                success: false,
                message: "Please provide username",
            });
        }
        const usernameExist = yield prisma_1.prisma.user.findUnique({
            where: {
                username: String(username),
            },
        });
        if (usernameExist) {
            return res.status(409).json({
                success: false,
                message: "Username not available!",
            });
        }
        return res.status(200).json({
            success: true,
            message: "Username is available",
        });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
});
exports.checkUsername = checkUsername;
const getCompleteUserData = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
        if (!userId) {
            return res
                .status(400)
                .json({ success: false, message: "User ID not provided" });
        }
        const user = yield prisma_1.prisma.user.findUnique({
            where: {
                id: userId,
            },
            select: {
                id: true,
                email: true,
                name: true,
                username: true,
                college: true,
                type: true,
                location: true,
            },
        });
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }
        return res.status(200).json({
            success: true,
            data: user,
        });
    }
    catch (error) {
        console.error("Error fetching user data:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error!",
        });
    }
});
exports.getCompleteUserData = getCompleteUserData;
const getUserProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const userProfileExist = yield prisma_1.prisma.userProfile.findUnique({
            where: {
                userId: (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId,
            },
        });
        if (!userProfileExist) {
            return res.status(200).json({
                success: false,
                message: "UserProfile not created yet",
            });
        }
        return res.status(200).json({
            success: true,
            data: userProfileExist,
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
exports.getUserProfile = getUserProfile;
const updateUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    console.log("for cors");
    try {
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
        if (!userId) {
            return res.status(400).json({
                success: false,
                message: "User ID not provided",
            });
        }
        const { name, username, bio, avatarUrl, type, collegename: college, location } = req.body;
        const existingUser = yield prisma_1.prisma.user.findUnique({
            where: { id: userId },
        });
        if (!existingUser) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }
        const userUpdateData = {};
        if (name !== undefined)
            userUpdateData.name = name;
        if (username !== undefined)
            userUpdateData.username = username;
        if (college !== undefined)
            userUpdateData.college = college;
        if (location !== undefined)
            userUpdateData.location = location;
        if (type !== undefined)
            userUpdateData.type = type;
        const userProfileUpdateData = {};
        if (bio !== undefined)
            userProfileUpdateData.bio = bio;
        if (avatarUrl !== undefined)
            userProfileUpdateData.avatarUrl = avatarUrl;
        const updatedUser = yield prisma_1.prisma.$transaction((prisma) => __awaiter(void 0, void 0, void 0, function* () {
            if (Object.keys(userUpdateData).length > 0) {
                yield prisma.user.update({
                    where: { id: userId },
                    data: userUpdateData,
                });
            }
            if (Object.keys(userProfileUpdateData).length > 0) {
                yield prisma.userProfile.upsert({
                    where: { userId: userId },
                    update: userProfileUpdateData,
                    create: {
                        userId: userId,
                        bio: bio || null,
                        avatarUrl: avatarUrl || null,
                    },
                });
            }
            const updatedUserData = yield prisma.user.findUnique({
                where: { id: userId },
                select: {
                    id: true,
                    googleId: true,
                    email: true,
                    name: true,
                    username: true,
                    accessToken: true,
                    college: true,
                    type: true,
                    location: true,
                    isVerified: true,
                    createdAt: true,
                },
            });
            return updatedUserData;
        }));
        return res.status(200).json({
            success: true,
            message: "User and profile updated successfully",
            data: updatedUser,
        });
    }
    catch (error) {
        console.log("Error updating user and profile:", error);
        if (error.code === "P2002") {
            const duplicatedField = (_b = error.meta) === null || _b === void 0 ? void 0 : _b.target;
            return res.status(409).json({
                success: false,
                message: `${duplicatedField} already exists.`,
            });
        }
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message,
        });
    }
});
exports.updateUser = updateUser;
const updateUserProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user; // Use 'id' from 'req.user'
    try {
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
            const s3Url = `https://${uploadParams.Bucket}.s3.amazonaws.com/${fileName}`;
            // Update the user's profile with the new avatar URL and bio
            const updatedUserProfile = yield prisma_1.prisma.userProfile.update({
                where: {
                    userId: user === null || user === void 0 ? void 0 : user.userId,
                },
                data: {
                    avatarUrl: s3Url, // The S3 URL for the avatar image
                },
            });
            return res.status(200).json({
                success: true,
                message: "Profile updated successfully",
                data: updatedUserProfile,
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
exports.updateUserProfile = updateUserProfile;

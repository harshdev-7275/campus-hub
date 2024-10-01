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
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadImage = exports.getAllColleges = void 0;
const prisma_1 = require("../configs/prisma");
const client_s3_1 = require("@aws-sdk/client-s3");
const s3_request_presigner_1 = require("@aws-sdk/s3-request-presigner");
const s3Config_1 = require("../configs/s3Config");
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
    const { fileName, fileType } = req.body;
    console.log("in upload image", fileName, fileType);
    // Generate a pre-signed URL
    const params = {
        Bucket: process.env.AWS_S3_BUCKET,
        Key: fileName,
        ContentType: fileType,
    };
    try {
        // Use `getSignedUrl` with `PutObjectCommand`
        const command = new client_s3_1.PutObjectCommand(params);
        const signedUrl = yield (0, s3_request_presigner_1.getSignedUrl)(s3Config_1.s3Client, command, { expiresIn: 60 });
        const url = `https://${process.env.AWS_S3_BUCKET}.s3.amazonaws.com/${fileName}`;
        res.status(200).json({
            success: true,
            signedUrl,
            url,
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Error generating signed URL",
        });
    }
});
exports.uploadImage = uploadImage;

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
exports.createPost = exports.getAllPostByCollege = void 0;
const prisma_1 = require("../configs/prisma");
const getAllPostByCollege = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const user = yield prisma_1.prisma.user.findUnique({
            where: {
                id: (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId,
            },
        });
        const posts = yield prisma_1.prisma.post.findMany({
            where: {
                college: String(user === null || user === void 0 ? void 0 : user.college),
            },
            orderBy: {
                createdAt: "asc",
            },
        });
        return res.status(200).json({
            success: true,
            posts: posts,
            length: posts.length,
        });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Internal server error!",
        });
    }
});
exports.getAllPostByCollege = getAllPostByCollege;
const createPost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _b, _c;
    try {
        const { content, college, imageUrl, videoUrl } = req.body;
        console.log(college);
        const user = yield prisma_1.prisma.user.findUnique({
            where: {
                id: (_b = req.user) === null || _b === void 0 ? void 0 : _b.userId,
            },
        });
        if (!user) {
            return res.status(400).json({
                success: false,
                message: "User not found",
            });
        }
        if (!college) {
            return res.status(400).json({
                success: false,
                message: "college is required",
            });
        }
        const payload = {
            content: content || "",
            college: college,
            imageUrl: imageUrl || "",
            videoUrl: videoUrl || "",
            authorId: (_c = req.user) === null || _c === void 0 ? void 0 : _c.userId,
            user: user.name,
            username: user.username,
        };
        const post = yield prisma_1.prisma.post.create({
            data: Object.assign({}, payload),
        });
        return res.status(200).json({
            success: true,
            post: post,
            message: "Post created successfully",
        });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Internal server error!",
        });
    }
});
exports.createPost = createPost;

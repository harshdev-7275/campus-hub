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
const __1 = require("..");
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
    var _a, _b, _c;
    try {
        const { content, college, imageUrl, videoUrl } = req.body;
        console.log(college);
        const user = yield prisma_1.prisma.user.findUnique({
            where: {
                id: (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId,
            },
            include: {
                userProfile: true
            }
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
            authorId: (_b = req.user) === null || _b === void 0 ? void 0 : _b.userId,
            user: user.name,
            username: user.username,
            userProfileUrl: ((_c = user === null || user === void 0 ? void 0 : user.userProfile) === null || _c === void 0 ? void 0 : _c.avatarUrl) || ""
        };
        const post = yield prisma_1.prisma.post.create({
            data: Object.assign({}, payload),
        });
        yield __1.producer.connect();
        yield __1.producer.send({
            topic: "notifications_topic",
            messages: [{ value: JSON.stringify({ userId: user.id, college: user === null || user === void 0 ? void 0 : user.college, message: `New post by ${user.name}` }) }],
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

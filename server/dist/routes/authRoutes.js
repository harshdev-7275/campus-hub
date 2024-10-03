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
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const axios_1 = __importDefault(require("axios"));
const express_1 = __importDefault(require("express"));
const prisma_1 = require("../configs/prisma");
const router = express_1.default.Router();
router.get("/google", (req, res) => {
    const redirectUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${process.env.GOOGLE_CLIENT_ID}&redirect_uri=${process.env.GOOGLE_REDIRECT_URI}&response_type=code&scope=openid email profile`;
    res.redirect(redirectUrl);
});
router.get("/google/callback", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { code } = req.query;
    try {
        // Exchange code for access token
        const tokenResponse = yield axios_1.default.post("https://oauth2.googleapis.com/token", {
            code,
            client_id: process.env.GOOGLE_CLIENT_ID,
            client_secret: process.env.GOOGLE_CLIENT_SECRET,
            redirect_uri: process.env.GOOGLE_REDIRECT_URI,
            grant_type: "authorization_code",
        });
        const { access_token, id_token } = tokenResponse.data;
        // Get user information using the access token
        const userResponse = yield axios_1.default.get(`https://www.googleapis.com/oauth2/v2/userinfo?access_token=${access_token}`);
        const { id, email, name } = userResponse.data;
        let user = yield prisma_1.prisma.user.findUnique({ where: { googleId: id } });
        if (!user) {
            user = yield prisma_1.prisma.user.create({
                data: {
                    googleId: id,
                    email,
                    name,
                    accessToken: access_token,
                },
            });
        }
        else {
            yield prisma_1.prisma.user.update({
                where: { googleId: id },
                data: { accessToken: access_token },
            });
        }
        const jwtToken = jsonwebtoken_1.default.sign({ userId: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: "1h" });
        res.cookie("token", jwtToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            maxAge: 3600000, // 1 hour expiration
            sameSite: "strict",
        });
        res.redirect(`http://localhost:5173/?token=${jwtToken}`);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Authentication failed" });
    }
}));
router.get("/logout", (req, res) => {
    try {
        res.clearCookie("token");
        res.status(201).json({
            status: true,
            message: "Logout successfully",
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Internal server error",
        });
    }
});
exports.default = router;

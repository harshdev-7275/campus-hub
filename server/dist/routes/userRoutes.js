"use strict";
// src/routes/userRoutes.ts
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authMiddleware_1 = require("../middlewares/authMiddleware");
const userController_1 = require("../controllers/userController");
const muter_1 = require("../configs/muter");
const router = express_1.default.Router();
// Getting user data for Redux
router.get("/user-data", authMiddleware_1.authenticateJWT, userController_1.getUserData);
// Getting complete user data with user profile
router.get("/get-complete-data", authMiddleware_1.authenticateJWT, userController_1.getCompleteUserData);
// Username availability check
router.get("/username-check", authMiddleware_1.authenticateJWT, userController_1.checkUsername);
// Getting user profile
router.get("/get-user-profile", authMiddleware_1.authenticateJWT, userController_1.getUserProfile);
// Updating user and user profile
router.patch("/update-user", authMiddleware_1.authenticateJWT, userController_1.updateUser);
router.patch("/update-user-profile", authMiddleware_1.authenticateJWT, muter_1.uploadSingle, userController_1.updateUserProfile);
exports.default = router;

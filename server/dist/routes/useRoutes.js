"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authMiddleware_1 = require("../middlewares/authMiddleware");
const userController_1 = require("../controllers/userController");
const router = express_1.default.Router();
//getting user data for redux
router.get("/user-data", authMiddleware_1.authenticateJWT, userController_1.getUserData);
//getting 
exports.default = router;

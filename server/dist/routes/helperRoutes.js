"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authMiddleware_1 = require("../middlewares/authMiddleware");
const helperControllers_1 = require("../controllers/helperControllers");
const router = express_1.default.Router();
router.get("/get-all-colleges", authMiddleware_1.authenticateJWT, helperControllers_1.getAllColleges);
router.post("/upload-image", authMiddleware_1.authenticateJWT, helperControllers_1.uploadImage);
exports.default = router;

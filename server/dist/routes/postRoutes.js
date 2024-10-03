"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const postControllers_1 = require("../controllers/postControllers");
const authMiddleware_1 = require("../middlewares/authMiddleware");
const router = express_1.default.Router();
router.get("/get-allPost-by-College", authMiddleware_1.authenticateJWT, postControllers_1.getAllPostByCollege);
router.post("/create-post", authMiddleware_1.authenticateJWT, postControllers_1.createPost);
exports.default = router;

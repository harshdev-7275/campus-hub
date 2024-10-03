"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticateJWT = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const authenticateJWT = (req, res, next) => {
    // Extract the JWT token from the cookies
    const token = req.cookies.token; // assuming your JWT is stored in a cookie named 'token'
    // Check if the token exists
    if (!token) {
        return res.status(401).json({
            success: false,
            message: "Unauthorized. Please login again."
        }); // Unauthorized
    }
    try {
        // Verify the token
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        if (decoded) {
            req.user = decoded || {};
            return next();
        }
    }
    catch (error) {
        // If there's an error in token verification (e.g., invalid or expired token)
        return res.status(403).json({
            success: false,
            message: "Forbidden. Invalid or expired token."
        });
    }
    // If no token or verification fails
    return res.status(401).json({
        success: false,
        message: "Unauthorized. Please login again."
    });
};
exports.authenticateJWT = authenticateJWT;

// src/routes/userRoutes.ts

import express from "express";
import { authenticateJWT } from "../middlewares/authMiddleware";
import {
  checkUsername,
  getUserData,
  getCompleteUserData,
  getUserProfile,
  updateUser,
  updateUserProfile,
} from "../controllers/userController";
import { uploadMultiple, uploadSingle } from "../configs/muter";

const router = express.Router();

// Getting user data for Redux
router.get("/user-data", authenticateJWT, getUserData);

// Getting complete user data with user profile
router.get("/get-complete-data", authenticateJWT, getCompleteUserData);

// Username availability check
router.get("/username-check", authenticateJWT, checkUsername);

// Getting user profile
router.get("/get-user-profile", authenticateJWT, getUserProfile);

// Updating user and user profile
router.patch("/update-user", authenticateJWT, updateUser);

router.patch(
  "/update-user-profile",
  authenticateJWT,
  uploadSingle,
  updateUserProfile
);

export default router;

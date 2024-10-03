import express from "express";
import { authenticateJWT } from "../middlewares/authMiddleware";
import {
  getAllColleges,
  uploadImage,
  getCompleteUserDataWithProfile,
} from "../controllers/helperControllers";
import { uploadSingle } from "../configs/muter";

const router = express.Router();

router.get("/get-all-colleges", authenticateJWT, getAllColleges);

router.post("/upload-image", authenticateJWT, uploadSingle, uploadImage);

router.get(
  "/get-complete-user-data",
  authenticateJWT,
  getCompleteUserDataWithProfile
);

export default router;

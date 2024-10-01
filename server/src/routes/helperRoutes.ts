import express from "express";
import { authenticateJWT } from "../middlewares/authMiddleware";
import { getAllColleges, uploadImage } from "../controllers/helperControllers";

const router = express.Router();

router.get("/get-all-colleges", authenticateJWT, getAllColleges);

router.post("/upload-image", authenticateJWT, uploadImage);

export default router;

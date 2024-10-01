import express from "express"
import { getAllPostByCollege } from "../controllers/postControllers";
import { authenticateJWT } from "../middlewares/authMiddleware";

const router = express.Router()


router.get("/get-allPost-by-College",authenticateJWT, getAllPostByCollege);


export default router;
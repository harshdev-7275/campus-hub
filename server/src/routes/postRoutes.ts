import express from "express"
import { getAllPostByCollege,createPost } from "../controllers/postControllers";
import { authenticateJWT, } from "../middlewares/authMiddleware";

const router = express.Router()


router.get("/get-allPost-by-College",authenticateJWT, getAllPostByCollege);

router.post("/create-post", authenticateJWT, createPost)


export default router;
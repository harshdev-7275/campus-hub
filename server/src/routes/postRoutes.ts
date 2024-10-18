import express from "express"
import { getAllPostByCollege,createPost, getSinglePostById, likePost } from "../controllers/postControllers";
import { authenticateJWT, } from "../middlewares/authMiddleware";

const router = express.Router()

//get routes
router.get("/get-allPost-by-College",authenticateJWT, getAllPostByCollege);
router.get("/get-single-post", getSinglePostById)

router.post("/create-post", authenticateJWT, createPost)
router.post("/like-post", authenticateJWT, likePost)


export default router;
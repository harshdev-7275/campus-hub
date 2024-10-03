import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import authRoutes from "./routes/authRoutes";
import userRoutes from "./routes/userRoutes";
import helperRoutes from "./routes/helperRoutes";
import postRoutes from "./routes/postRoutes";
import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
dotenv.config();

const app = express();
const port = 5000;
app.use(cookieParser());
app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use("/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/helper", helperRoutes);

//posts
app.use("/api/posts", postRoutes);

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

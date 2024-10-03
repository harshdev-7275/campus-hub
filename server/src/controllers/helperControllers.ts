import { Request, Response } from "express";
import { prisma } from "../configs/prisma";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { s3Client } from "../configs/s3Config";
import { v4 as uuidv4 } from "uuid";
import path from "path";

const getAllColleges = async (req: Request, res: Response) => {
  try {
    const colleges = await prisma.college.findMany({});
    if (!colleges) {
      return res.status(204).json({
        success: false,
        message: "No colleges found",
      });
    }
    return res.status(200).json({
      success: true,
      colleges: colleges,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const uploadImage = async (req: Request, res: Response) => {
  try {
    // Check if a file is uploaded (via multer's single upload)
    if (req.file) {
      const fileExtension = path.extname(req.file.originalname);
      const fileName = `${uuidv4()}${fileExtension}`;

      const uploadParams = {
        Bucket: process.env.AWS_S3_BUCKET,
        Key: fileName,
        Body: req.file.buffer,
        ContentType: req.file.mimetype,
      };

      const command = new PutObjectCommand(uploadParams);
      const result = await s3Client.send(command);


      const s3Url = `https://${uploadParams.Bucket}.s3.amazonaws.com/${fileName}`;

      return res.status(200).json({
        success: true,
        data: s3Url,
        message: "Image uploaded successfully",
      });
    }
    // If no file is uploaded, just update the bio

    return res.status(500).json({
      success: false,
      message: "Error updating profile",
    });
  } catch (error) {
    console.error("Error updating profile:", error);
    return res.status(500).json({ message: "Error updating profile" });
  }
};
const getCompleteUserDataWithProfile = async (req: Request, res: Response) => {
  try {
    const users = await prisma.user.findFirst({
      where: {
        id: req.user?.userId,
      },
      include: {
        userProfile: true, // This includes the user profile if it exists
      },
    });
    if (!users) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: users,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export { getAllColleges, uploadImage, getCompleteUserDataWithProfile };

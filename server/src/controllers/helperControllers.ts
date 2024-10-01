import { Request, Response } from "express";
import { prisma } from "../configs/prisma";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { s3Client } from "../configs/s3Config";

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
  const { fileName, fileType } = req.body;
  console.log("in upload image", fileName, fileType);
  // Generate a pre-signed URL
  const params = {
    Bucket: process.env.AWS_S3_BUCKET,
    Key: fileName,
    ContentType: fileType,
  };

  try {
    // Use `getSignedUrl` with `PutObjectCommand`
    const command = new PutObjectCommand(params);
    const signedUrl = await getSignedUrl(s3Client, command, { expiresIn: 60 });
    const url = `https://${process.env.AWS_S3_BUCKET}.s3.amazonaws.com/${fileName}`;

    res.status(200).json({
      success: true,
      signedUrl,
      url,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Error generating signed URL",
    });
  }
};

export { getAllColleges, uploadImage };

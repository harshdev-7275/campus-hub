// src/controllers/userController.ts

import { Request, Response } from "express";
import { prisma } from "../configs/prisma";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { s3Client } from "../configs/s3Config";
import { v4 as uuidv4 } from "uuid";
import path from "path";

const getUserData = async (req: Request, res: Response) => {
  try {
    console.log(req.user);
    if (!req.user) {
      return res.status(404).json({
        success: false,
        message: "Not found!",
      });
    }
    return res.status(200).json({
      success: true,
      message: "User fetched successfully",
      data: req.user,
    });
  } catch (error) {
    console.log(error);
    return res.status(501).json({
      success: false,
      message: "Internal server error!",
    });
  }
};

const checkUsername = async (req: Request, res: Response) => {
  try {
    const { username } = req.query;
    if (!username) {
      return res.status(400).json({
        success: false,
        message: "Please provide username",
      });
    }
    const usernameExist = await prisma.user.findUnique({
      where: {
        username: String(username),
      },
    });
    if (usernameExist) {
      return res.status(409).json({
        success: false,
        message: "Username not available!",
      });
    }
    return res.status(200).json({
      success: true,
      message: "Username is available",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const getCompleteUserData = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      return res
        .status(400)
        .json({ success: false, message: "User ID not provided" });
    }

    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        id: true,
        email: true,
        name: true,
        username: true,
        college: true,
        type: true,
        location: true,
      },
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    console.error("Error fetching user data:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error!",
    });
  }
};

const getUserProfile = async (req: Request, res: Response) => {
  try {
    const userProfileExist = await prisma.userProfile.findUnique({
      where: {
        userId: req.user?.userId,
      },
    });
    if (!userProfileExist) {
      return res.status(200).json({
        success: false,
        message: "UserProfile not created yet",
      });
    }
    return res.status(200).json({
      success: true,
      data: userProfileExist,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const updateUser = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User ID not provided",
      });
    }

    const { name, username, bio, avatarUrl } = req.body;

    const existingUser = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!existingUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const userUpdateData: any = {};
    if (name !== undefined) userUpdateData.name = name;
    if (username !== undefined) userUpdateData.username = username;

    const userProfileUpdateData: any = {};
    if (bio !== undefined) userProfileUpdateData.bio = bio;
    if (avatarUrl !== undefined) userProfileUpdateData.avatarUrl = avatarUrl;

    const updatedUser = await prisma.$transaction(async (prisma) => {
      if (Object.keys(userUpdateData).length > 0) {
        await prisma.user.update({
          where: { id: userId },
          data: userUpdateData,
        });
      }

      if (Object.keys(userProfileUpdateData).length > 0) {
        await prisma.userProfile.upsert({
          where: { userId: userId },
          update: userProfileUpdateData,
          create: {
            userId: userId,
            bio: bio || null,
            avatarUrl: avatarUrl || null,
          },
        });
      }

      const updatedUserData = await prisma.user.findUnique({
        where: { id: userId },
        select: {
          id: true,
          googleId: true,
          email: true,
          name: true,
          username: true,
          accessToken: true,
          college: true,
          type: true,
          location: true,
          isVerified: true,
          createdAt: true,
        },
      });

      return updatedUserData;
    });

    return res.status(200).json({
      success: true,
      message: "User and profile updated successfully",
      data: updatedUser,
    });
  } catch (error: any) {
    console.log("Error updating user and profile:", error);

    if (error.code === "P2002") {
      const duplicatedField = error.meta?.target;
      return res.status(409).json({
        success: false,
        message: `${duplicatedField} already exists.`,
      });
    }

    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};
const updateUserProfile = async (req: Request, res: Response) => {
  const user = req.user; // Use 'id' from 'req.user'

  console.log("--------userid url", user?.userId);
  console.log("req.file", req.file);
  try {
    // Check if a file is uploaded (via multer's single upload)
    if (req.file) {
      const fileExtension = path.extname(req.file.originalname);
      const fileName = `${uuidv4()}${fileExtension}`;
      console.log("--------fle", fileExtension, fileName);

      const uploadParams = {
        Bucket: process.env.AWS_S3_BUCKET,
        Key: fileName,
        Body: req.file.buffer,
        ContentType: req.file.mimetype,
      };

      const command = new PutObjectCommand(uploadParams);
      const result = await s3Client.send(command);

      console.log("--------result", result);

      const s3Url = `https://${uploadParams.Bucket}.s3.amazonaws.com/${fileName}`;
      console.log("--------s3 url", s3Url);
      // Update the user's profile with the new avatar URL and bio
      const updatedUserProfile = await prisma.userProfile.update({
        where: {
          userId: user?.userId,
        },
        data: {
          // Optional bio
          avatarUrl: s3Url, // The S3 URL for the avatar image
        },
      });

      return res.status(200).json({
        success: true,
        message: "Profile updated successfully",
        data: updatedUserProfile,
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

export {
  getUserData,
  checkUsername,
  updateUser,
  getCompleteUserData,
  getUserProfile,
  updateUserProfile,
};

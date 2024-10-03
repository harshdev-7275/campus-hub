import express, { Request, Response } from "express";
import { prisma } from "../configs/prisma";
import { producer } from "..";


const getAllPostByCollege = async (req: Request, res: Response) => {
  try {
    const user = await prisma.user.findUnique({
      where: {
        id: req.user?.userId,
      },
    });

    const posts = await prisma.post.findMany({
      where: {
        college: String(user?.college),
        
      },
    
      
      orderBy: {
        createdAt: "asc",
      },
     
    });
    return res.status(200).json({
      success: true,
      posts: posts,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Internal server error!",
    });
  }
};

const createPost = async (req: Request, res: Response) => {
  try {
    const { content, college, imageUrl, videoUrl } = req.body;
    console.log(college);
    const user = await prisma.user.findUnique({
      where: {
        id: req.user?.userId,
      },
      include:{
        userProfile:true
      }
      

    });
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User not found",
      });
    }
    if (!college) {
      return res.status(400).json({
        success: false,
        message: "college is required",
      });
    }
    const payload = {
      content: content || "",
      college: college,
      imageUrl: imageUrl || "",
      videoUrl: videoUrl || "",
      authorId: req.user?.userId,
      user: user.name,
      username: user.username,
      userProfileUrl: user?.userProfile?.avatarUrl || ""
    };
    const post = await prisma.post.create({
      data: {
        ...payload,
      },
    });
    await producer.connect();
    await producer.send({
      topic: "notifications_topic",
      messages: [{ value: JSON.stringify({ userId: user.id,college:user?.college, message: `New post by ${user.name}` }) }],
    });

    return res.status(200).json({
      success: true,
      post: post,
      message: "Post created successfully",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Internal server error!",
    });
  }
};

export { getAllPostByCollege, createPost };

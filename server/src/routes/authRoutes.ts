import jwt from "jsonwebtoken";
import axios from "axios";
import express, { Router, Request, Response } from "express";
import { prisma } from "../configs/prisma";
import { authenticateJWT } from "../middlewares/authMiddleware";

const router = express.Router();

router.get("/google", (req: Request, res: Response) => {
  const redirectUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${process.env.GOOGLE_CLIENT_ID}&redirect_uri=${process.env.GOOGLE_REDIRECT_URI}&response_type=code&scope=openid email profile`;
  res.redirect(redirectUrl);
});
router.get("/google/callback", async (req: Request, res: Response) => {
  const { code } = req.query;
  try {
    // Exchange code for access token
    const tokenResponse = await axios.post(
      "https://oauth2.googleapis.com/token",
      {
        code,
        client_id: process.env.GOOGLE_CLIENT_ID,
        client_secret: process.env.GOOGLE_CLIENT_SECRET,
        redirect_uri: process.env.GOOGLE_REDIRECT_URI,
        grant_type: "authorization_code",
      }
    );

    const { access_token, id_token } = tokenResponse.data;

    // Get user information using the access token
    const userResponse = await axios.get(
      `https://www.googleapis.com/oauth2/v2/userinfo?access_token=${access_token}`
    );
    const { id, email, name } = userResponse.data;

    let user = await prisma.user.findUnique({ where: { googleId: id } });

    if (!user) {
      console.log("access token", access_token);
      user = await prisma.user.create({
        data: {
          googleId: id,
          email,
          name,
          accessToken: access_token,
        },
      });
    } else {
      console.log("access token", access_token);
      await prisma.user.update({
        where: { googleId: id },
        data: { accessToken: access_token },
      });
    }

    const jwtToken = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET!,
      { expiresIn: "1h" }
    );
    res.cookie("token", jwtToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 3600000, // 1 hour expiration
      sameSite: "strict",
    });

    res.redirect(`http://localhost:5173/?token=${jwtToken}`);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Authentication failed" });
  }
});

router.get("/logout",(req: Request, res: Response) => {
  console.log("in logout");
  try {
    res.clearCookie("token");
    res.status(201).json({
      status: true,
      message: "Logout successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
});

export default router;

import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export const authenticateJWT = (req: Request, res: Response, next: NextFunction) => {
    // Extract the JWT token from the cookies
    const token = req.cookies.token; // assuming your JWT is stored in a cookie named 'token'

    // Check if the token exists
    if (!token) {
        return res.status(401).json({
            success: false,
            message: "Unauthorized. Please login again."
        }); // Unauthorized
    }

    try {
        // Verify the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
        if (decoded) {
            // console.log("Decoded:", decoded);
            // Attach the decoded user info to the request object
            req.user = decoded as any || {}; 
            return next(); // Exit the function after calling next()
        }
    } catch (error) {
        // If there's an error in token verification (e.g., invalid or expired token)
        return res.status(403).json({
            success: false,
            message: "Forbidden. Invalid or expired token."
        });
    }

    // If no token or verification fails
    return res.status(401).json({
        success: false,
        message: "Unauthorized. Please login again."
    });
};

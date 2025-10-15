import jwt from "jsonwebtoken";
import { User } from "../Models/userModel.js";// your User model

// Middleware to protect routes
export const authMiddleware = async (req, res, next) => {
  try {
    // Get token from Authorization header
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Unauthorized: No token provided" });
    }

    const token = authHeader.split(" ")[1];

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    

    // Attach user to request
    const user = await User.findById(decoded.id).select("-password"); // exclude password
    if (!user) {
      return res.status(401).json({ message: "Unauthorized: User not found" });
    }


    req.user = user;
    next();
  } catch (error) {
    console.error("Auth middleware error:", error.message);
    return res.status(401).json({ message: "Unauthorized: Invalid token" });
  }
};

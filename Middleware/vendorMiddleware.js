import jwt from "jsonwebtoken"
import { Vendor } from "../Models/vendorModel.js"


export const vendorMiddleware = async (req,res,next) =>{
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Unauthorized: No token provided" });
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const vendor = await Vendor.findById(decoded.id).select("-password");

    if(!vendor){
        return res.status(401).json({ message: "Unauthorized: Vendor not found" });
    }

    req.vendor = vendor;
    next();


  } catch (error) {
    console.error("Auth middleware error:", error.message);
    return res.status(401).json({ message: "Unauthorized: Invalid token" });
  }
}
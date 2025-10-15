import express from "express";
import {
  addToWishlist,
  getWishlist,
  removeFromWishlist,
  clearWishlist,
} from "../Controllers/wishlistController.js";
import { authMiddleware } from "../Middleware/authMiddleware.js"; // assuming you have auth middleware

const wishlistRouter = express.Router();

// ✅ Get Wishlist
wishlistRouter.get("/", authMiddleware, getWishlist);

// ✅ Add to Wishlist
wishlistRouter.post("/add", authMiddleware, addToWishlist);

// ✅ Remove Item from Wishlist
wishlistRouter.post("/remove", authMiddleware, removeFromWishlist);

// ✅ Clear Wishlist
wishlistRouter.post("/clear", authMiddleware, clearWishlist);

export default wishlistRouter;

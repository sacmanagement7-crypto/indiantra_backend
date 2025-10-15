import express from "express";
import {
  addToCart,
  getCart,
  removeFromCart,
  updateQuantity,
  clearCart
} from "../Controllers/cartController.js";

import {authMiddleware} from "../Middleware/authMiddleware.js"

export const cartRouter = express.Router();

// ✅ Get Cart
cartRouter.get("/", authMiddleware, getCart);

// ✅ Add to Cart
cartRouter.post("/add", authMiddleware, addToCart);

// ✅ Remove Item from Cart
cartRouter.post("/remove", authMiddleware, removeFromCart);

// ✅ Update Quantity
cartRouter.post("/update", authMiddleware, updateQuantity);

// ✅ Clear Cart
cartRouter.post("/clear",authMiddleware, clearCart);

export default cartRouter;

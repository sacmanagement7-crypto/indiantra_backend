// routes/productRoutes.js
import express from "express";
import {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
} from "../Controllers/productController.js";
import upload from "../Config/multer.js";
import { vendorMiddleware } from "../Middleware/vendorMiddleware.js";

export const productRouter = express.Router();

// 📌 Create product
productRouter.post("/products", upload.array("images", 10),vendorMiddleware,createProduct);

// 📌 Get all products
productRouter.get("/products", getProducts);

// 📌 Get single product by ID
productRouter.get("/products/:id", getProductById);

// 📌 Update product by ID
productRouter.patch("/products/:id",upload.array("images", 10), updateProduct);

// 📌 Delete product by ID
productRouter.delete("/products/:id", deleteProduct);

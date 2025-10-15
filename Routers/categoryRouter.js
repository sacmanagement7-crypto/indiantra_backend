import express from "express";
import upload from "../Config/multer.js";
import { createCategory, deleteCategory, getCategories } from "../Controllers/categoryController.js";

export const categoryRouter = express.Router();

// ✅ Single image upload
categoryRouter.post("/", upload.single("image"), createCategory);
categoryRouter.get("/categories",getCategories);
categoryRouter.delete("/category/:id",deleteCategory);

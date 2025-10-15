import { Category } from "../Models/CategoryModel.js";
import fs from 'fs';
import path from 'path';
import {Product} from "../Models/productModel.js"

// Create Category
export const createCategory = async (req, res) => {
  try {
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ message: "Name is required" });
    }

    if (!req.file) {
      return res.status(400).json({ message: "Image is required" });
    }

    // Build full URL
    const imageUrl = `${process.env.FRONTEND_URL}/uploads/${req.file.filename}`;
   
    const category = await Category.create({
      name,
      image: imageUrl, // full URL
    });

    res.status(201).json({
      success: true,
      message: "Category created successfully",
      category,
    });
  } catch (error) {
    console.log(error)
    res.status(500).json({ success: false, message: error.message });
  }
};


// Get All Categories
export const getCategories = async (req, res) => {
  try {
    const categories = await Category.find({});
    res.status(200).json({ success: true, categories });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete Category
export const deleteCategory = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);

    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    // 🧹 Delete the associated category image (if it exists)
    if (category.image) {
      const imagePath = path.join('uploads', category.image); // adjust if your uploads path is different
      try {
        fs.unlink(imagePath,(err)=>{
          console.log("error occured")
        });
        console.log("Category image deleted:", category.image);
      } catch (err) {
        console.warn("Failed to delete category image:", err.message);
        // continue without throwing
      }
    }

    // 🧹 Delete all products linked to this category by _id
    const deletedProducts = await Product.deleteMany({ category: category.name });
    console.log(`Deleted ${deletedProducts.deletedCount} product(s) associated with category.`);

    // 🧹 Delete the category itself
    await category.deleteOne();

    res.status(200).json({
      success: true,
      message: "Category and associated products deleted successfully",
    });

  } catch (error) {
    console.error("Error deleting category:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

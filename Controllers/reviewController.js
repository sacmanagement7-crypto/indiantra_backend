import { Review } from "../Models/reviewModel.js";
import mongoose from "mongoose";

export const createReview = async (req, res) => {
  try {
    const userId = req.user._id;
    const { productId } = req.params; // extract as string
    const { rating, comment, date } = req.body;

    // Validate
    if (!rating || !comment) {
      return res.status(400).json({ message: "Rating and comment are required" });
    }

    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({ message: "Invalid productId" });
    }

    const review = await Review.create({
      userId,
      productId: new mongoose.Types.ObjectId(productId), // convert to ObjectId
      rating,
      comment,
      date: date ? new Date(date) : new Date(), // ensure it's a Date object
    });

    res.status(201).json({ message: "Review sent successfully", review });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getAllReviewsByProductId = async (req, res) => {
  try {
    const { productId } = req.params; // ✅ extract productId

    // Find reviews and populate userId
    const reviews = await Review.find({ productId }).populate("userId", "name email"); 
    // populated with only name and email, adjust as needed

    if (reviews.length === 0) {
      return res.status(404).json({ message: "No reviews found" });
    }

    res.status(200).json({ message: "Success", reviews });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
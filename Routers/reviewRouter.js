import express from "express";
import { createReview ,getAllReviewsByProductId} from "../Controllers/reviewController.js";
import { authMiddleware } from "../Middleware/authMiddleware.js";
export const reviewRouter = express.Router();

reviewRouter.post('/:productId/review',authMiddleware,createReview);
reviewRouter.get('/:productId/review',getAllReviewsByProductId);


import express from "express";
import { checkout ,getOrdersByUserId, getOrdersByVendorId, updateOrderStatus} from "../Controllers/orderController.js";
import { authMiddleware } from "../Middleware/authMiddleware.js";
import { vendorMiddleware } from "../Middleware/vendorMiddleware.js";

export const orderRouter = express.Router();

orderRouter.post('/checkout',authMiddleware,checkout);
orderRouter.get('/',authMiddleware,getOrdersByUserId);
orderRouter.get('/vendor',vendorMiddleware, getOrdersByVendorId);
orderRouter.patch('/update',vendorMiddleware,updateOrderStatus);


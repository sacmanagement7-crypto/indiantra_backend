import express from "express";
import { loginUser, registerUser,addAddress ,updateAddress,removeAddress,setDefaultAddress,getAddress, getAllUsers} from "../Controllers/userController.js";
import {authMiddleware} from "../Middleware/authMiddleware.js"

export const userRouter = express();

userRouter.post('/auth/register',registerUser);
userRouter.post('/auth/login',loginUser);
userRouter.get('/user',getAllUsers);
userRouter.post('/user/address',authMiddleware,addAddress);
userRouter.put('/user/address/:addressId',authMiddleware,updateAddress);
userRouter.delete('/user/address/:addressId',authMiddleware,removeAddress);
userRouter.patch('/user/address/:addressId',authMiddleware,setDefaultAddress);
userRouter.get('/user/address',authMiddleware,getAddress);


import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    productId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Product"
    },
    rating:{
        type:Number,
        default:0
    },
    comment:{
        type:String
    },
    date:{
        type:Date,
    }
},{
    timestamps:true
})

export const Review = mongoose.model("Review",reviewSchema);
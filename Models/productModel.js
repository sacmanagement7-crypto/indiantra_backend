// models/Product.js;
import mongoose from "mongoose";

const specificationSchema = new mongoose.Schema({
  label: { type: String, required: true }, // e.g., "Weight"
  value: { type: String, required: true }  // e.g., "500g"
});

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    price: {
      type: Number,
      required: true,
    },
    oldPrice: {
      type: Number,
    },
    discount: {
      type: String, // e.g., "17% OFF"
    },
    category: {
      type: String,
      required: true,
    },
    images: {
      type: [String], // store image URLs or filenames
      default: [],
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    isBestDeal: {
      type: Boolean,
      default: false,
    },
    isRecommended: {
      type: Boolean,
      default: false,
    },
    inStock:{
      type:Boolean,
      default:true
    },
    specifications: {
      type: [specificationSchema], // array of {label, value}
      default: [],
    },
    shortdescription:{
      type:String,
      
    },
    longdescription:{
      type:String,
    },
    vendorId:{
      type:mongoose.Schema.Types.ObjectId,
      ref:"Vendor"
    },
    offerEndsAt: {
      type: Date, // store the exact timestamp when offer ends
    },
  },
  {
    timestamps: true, // adds createdAt & updatedAt
  }
);

export const Product = mongoose.model("Product", productSchema);

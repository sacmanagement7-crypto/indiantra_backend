import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    items: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
        },
        price: {
          type: Number,
          required: true,
        },
      },
    ],
    totalAmount: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ["Pending", "Paid", "Shipped", "Completed", "Approved"], // added Approved
      default: "Pending",
    },

    paymentMethod: {
      type: String,
    },
    // 👇 store shipping address snapshot inside order
    shippingAddress: {
      name: String,
      phone: String,
      street: String,
      city: String,
      state: String,
      zip: String,
      country: { type: String, default: "India" },
    },
  },
  {
    timestamps: true,
  }
);

export const Order = mongoose.model("Order", orderSchema);

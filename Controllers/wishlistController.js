import { Wishlist } from "../Models/wishlistModel.js";
import { Product } from "../Models/productModel.js";

// 1️⃣ Add to Wishlist
export const addToWishlist = async (req, res) => {
  try {
    const userId = req.user._id;
    const { productId } = req.body;

    const product = await Product.findById(productId);
    
    if (!product) return res.status(404).json({ message: "Product not found" });

    let wishlist = await Wishlist.findOne({ userId });

    if (wishlist) {
      const exists = wishlist.items.find(
        (item) => item.productId.toString() === productId
      );
      if (!exists) {
        wishlist.items.push({ productId });
      } // else do nothing if already exists
    } else {
      wishlist = new Wishlist({ userId, items: [{ productId }] });
    }

    await wishlist.save();
    res.status(200).json(wishlist);
  } catch (error) {
    res.status(500).json({ message: "Failed to add to wishlist", error: error.message });
  }
};

// 2️⃣ Get Wishlist
export const getWishlist = async (req, res) => {
  try {
    const userId = req.user._id;
    const wishlist = await Wishlist.findOne({ userId }).populate("items.productId");
    if (!wishlist) return res.status(200).json({ items: [] });
    res.status(200).json(wishlist);
  } catch (error) {
    res.status(500).json({ message: "Failed to get wishlist", error: error.message });
  }
};

// 3️⃣ Remove Item from Wishlist
export const removeFromWishlist = async (req, res) => {
  try {
    const userId = req.user._id;
    const { productId } = req.body;

    const wishlist = await Wishlist.findOne({ userId });
    if (!wishlist) return res.status(404).json({ message: "Wishlist not found" });

    wishlist.items = wishlist.items.filter(
      (item) => item.productId.toString() !== productId
    );
    await wishlist.save();

    res.status(200).json({message:"removed from wishlist",wishlist:wishlist});
  } catch (error) {
    res.status(500).json({ message: "Failed to remove item", error: error.message });
  }
};

// 4️⃣ Clear Wishlist
export const clearWishlist = async (req, res) => {
  try {
    const userId = req.user._id;
    const wishlist = await Wishlist.findOne({ userId });
    if (!wishlist) return res.status(404).json({ message: "Wishlist not found" });

    wishlist.items = [];
    await wishlist.save();

    res.status(200).json(wishlist);
  } catch (error) {
    res.status(500).json({ message: "Failed to clear wishlist", error: error.message });
  }
};

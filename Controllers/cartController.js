import { Cart } from "../Models/cartModel.js";
import { Product } from "../Models/productModel.js";

// 1️⃣ Add to Cart
export const addToCart = async (req, res) => {
  try {
    const userId = req.user._id;
    const { productId, quantity = 1 } = req.body;

    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: "Product not found" });

    let cart = await Cart.findOne({ userId });

    if (cart) {
      const itemIndex = cart.items.findIndex(item => item.productId.toString() === productId);
      if (itemIndex > -1) {
        cart.items[itemIndex].quantity += quantity;
      } else {
        cart.items.push({ productId, quantity });
      }
    } else {
      cart = new Cart({ userId, items: [{ productId, quantity }] });
    }

    await cart.save();
    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ message: "Failed to add to cart", error: error.message });
  }
};

// 2️⃣ Get Cart
export const getCart = async (req, res) => {
  try {
    const userId = req.user._id;
    const cart = await Cart.findOne({ userId }).populate("items.productId");
    if (!cart) return res.status(200).json({ items: [] });
    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ message: "Failed to get cart", error: error.message });
  }
};

// 3️⃣ Remove Item from Cart
export const removeFromCart = async (req, res) => {
  try {
    const userId = req.user._id;
    const { productId } = req.body;

    const cart = await Cart.findOne({ userId });
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    cart.items = cart.items.filter(item => item.productId.toString() !== productId);
    await cart.save();

    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ message: "Failed to remove item", error: error.message });
  }
};

// 4️⃣ Update Quantity
export const updateQuantity = async (req, res) => {
  try {
    const userId = req.user._id;
    const { productId, quantity } = req.body;

    const cart = await Cart.findOne({ userId });
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    const itemIndex = cart.items.findIndex(item => item.productId.toString() === productId);
    if (itemIndex === -1) return res.status(404).json({ message: "Product not in cart" });

    if (quantity <= 0) {
      cart.items.splice(itemIndex, 1); // remove if quantity <= 0
    } else {
      cart.items[itemIndex].quantity = quantity;
    }

    await cart.save();
    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ message: "Failed to update quantity", error: error.message });
  }
};

// 5️⃣ Clear Cart
export const clearCart = async (req, res) => {
  try {
    const userId = req.user._id;
    const cart = await Cart.findOne({ userId });
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    cart.items = [];
    await cart.save();

    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ message: "Failed to clear cart", error: error.message });
  }
};

// controllers/productController.js
import { Product } from "../Models/productModel.js"

// 📌 Create new product
// 📌 Create new product with multiple images
// 📌 Create new product with multiple images
export const createProduct = async (req, res) => {
  try {
    const {
      name,
      price,
      oldPrice,
      category,
      isFeatured,
      isBestDeal,
      isRecommended,
      inStock,
      shortdescription,
      longdescription,
      specifications,
      offerEndsAt // ✅ add this
    } = req.body;

    // Images
    const imagePaths = req.files
      ? req.files.map((file) => `${process.env.FRONTEND_URL}/uploads/${file.filename}`)
      : [];

    // Discount calculation
    let discount = "";
    if (oldPrice && price) {
      const discountPercent = Math.round(((oldPrice - price) / oldPrice) * 100);
      discount = `${discountPercent}% OFF`;
    }

    // Parse specifications if it's a JSON string
    let parsedSpecifications = [];
    if (specifications) {
      try {
        parsedSpecifications = typeof specifications === 'string'
          ? JSON.parse(specifications)
          : specifications;
      } catch (error) {
        console.error("Failed to parse specifications:", error);
      }
    }

    // Vendor ID
    const vendorId = req.vendor?._id || req.user?._id;
    if (!vendorId) {
      return res.status(401).json({ message: "Unauthorized: Vendor not found" });
    }

    const product = new Product({
      name,
      price,
      oldPrice,
      discount,
      category,
      images: imagePaths,
      isFeatured,
      isBestDeal,
      isRecommended,
      inStock: inStock !== undefined ? inStock : true,
      shortdescription,
      longdescription,
      specifications: parsedSpecifications,
      offerEndsAt: offerEndsAt ? new Date(offerEndsAt) : null, // ✅ add offerEndsAt
      vendorId,
    });

    const savedProduct = await product.save();
    res.status(201).json(savedProduct);
  } catch (error) {
    console.error("Create Product Error:", error);
    res.status(500).json({ message: "Failed to create product", error: error.message });
  }
};





// 📌 Get all products
export const getProducts = async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.json({ products: products });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch products", error: error.message });
  }
};

// 📌 Get single product by ID
export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch product", error: error.message });
  }
};

// 📌 Update product
export const updateProduct = async (req, res) => {
  try {
    const {
      name,
      price,
      oldPrice,
      category,
      images,
      isFeatured,
      isBestDeal,
      isRecommended,
      offerEndsAt // ✅ add offerEndsAt
    } = req.body;

    // Recalculate discount if price & oldPrice exist
    let discount = "";
    if (oldPrice && price) {
      const discountPercent = Math.round(((oldPrice - price) / oldPrice) * 100);
      discount = `${discountPercent}% OFF`;
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      {
        name,
        price,
        oldPrice,
        discount,
        category,
        images,
        isFeatured,
        isBestDeal,
        isRecommended,
        offerEndsAt: offerEndsAt ? new Date(offerEndsAt) : undefined, // ✅ update offerEndsAt if provided
      },
      { new: true } // return the updated document
    );

    if (!updatedProduct)
      return res.status(404).json({ message: "Product not found" });

    res.json(updatedProduct);
  } catch (error) {
    res.status(500).json({ message: "Failed to update product", error: error.message });
  }
};


// 📌 Delete product
export const deleteProduct = async (req, res) => {
  try {
    const deletedProduct = await Product.findByIdAndDelete(req.params.id);
    if (!deletedProduct) return res.status(404).json({ message: "Product not found" });

    res.json({ message: "Product deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete product", error: error.message });
  }
};

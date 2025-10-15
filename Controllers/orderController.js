import { Order } from "../Models/orderModel.js";
import { Cart } from "../Models/cartModel.js";
import { Product } from "../Models/productModel.js";
import { User } from "../Models/userModel.js";

export const checkout = async (req, res) => {
    try {
        const userId = req.user._id;
        let { addressId, paymentMethod = "COD" } = req.body;

        // if frontend sends nested object, unwrap it
        if (addressId && typeof addressId === "object" && addressId.addressId) {
            paymentMethod = addressId.paymentMethod || paymentMethod;
            addressId = addressId.addressId;
        }


        const cart = await Cart.findOne({ userId }).populate("items.productId");
        if (!cart || cart.items.length === 0) {
            return res.status(400).json({ message: "Cart is empty" });
        }

        // find selected address
        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ message: "User not found" });

        console.log("addressId", addressId)

        const address = user.addresses.find(
            (addr) => addr._id.toString() === addressId
        );

        if (!address)
            return res.status(400).json({ message: "Invalid address selected" });

        // calculate total
        let totalAmount = 0;
        const orderItems = cart.items.map((item) => {
            totalAmount += item.quantity * item.productId.price;
            return {
                productId: item.productId._id,
                quantity: item.quantity,
                price: item.productId.price,
            };
        });

        // create order
        const order = new Order({
            userId,
            items: orderItems,
            totalAmount,
            paymentMethod,
            shippingAddress: {
                name: address.name,
                phone: address.phone,
                street: address.street,
                city: address.city,
                state: address.state,
                zip: address.zip,
                country: address.country || "India",
            },
        });

        await order.save();

        // empty cart after order
        cart.items = [];
        await cart.save();

        res.status(200).json({ message: "Order placed successfully", order });
    } catch (error) {
        console.error("Checkout failed:", error);
        res.status(500).json({ message: "Checkout failed", error: error.message });
    }
};

export const getOrdersByUserId = async (req, res) => {
    try {
        const userId = req.user._id;

        if (!userId) {
            return res.status(400).json({ message: "UserId is required" })
        }

        const orders = await Order.find({ userId }).populate({
            path: "items.productId",
            select: "name price images category"
        }).sort({ createdAt: -1 });

        if (!orders || orders.length === 0) {
            return res.status(400).json({ message: "No Product Found" })
        }

        res.status(200).json({ success: true, orders: orders });


    } catch (error) {
        console.error("Not able to fetch Data");
        res.status(500).json({ message: "Unable to fetch Orders" });
    }
}

export const getOrdersByVendorId = async (req, res) => {
    try {
        const vendorId = req.vendor._id;

        if (!vendorId) {
            return res.status(400).json({ message: "Vendor Id is required" });
        }

        const vendorProducts = await Product.find({ vendorId }).select("id");

        if (vendorProducts.length === 0) {
            return res.status(200).json({ message: "No products found for this vendor", orders: [] });
        }

        const productIds = vendorProducts.map(p => p._id);

        const orders = await Order.find({ "items.productId": { $in: productIds } }).populate({
            path: "items.productId",
            select: "name price images vendorId",
            populate: { path: "vendorId", select: "name email" }
        }).populate("userId", "name email")
            .sort({ createdAt: -1 });

        const filteredOrders = orders.map(order => ({
            ...order.toObject(),
            items: order.items.filter(item =>
                productIds.some(id => id.equals(item.productId?._id))
            ),
        })).filter(order => order.items.length > 0);

        res.status(200).json({ success: true, orders: filteredOrders });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" })
    }
}

export const updateOrderStatus = async (req, res) => {
    try {
        const { orderId, status } = req.body;

        if (!["Pending", "Paid", "Shipped", "Completed", "Approved"].includes(status)) {
            return res.status(400).json({ message: "Invalid status" });
        }

        const order = await Order.findByIdAndUpdate(orderId, { status }, { new: true });
        res.json({ message: "Status updated", order });
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "Internal Server Error" });
    }
};

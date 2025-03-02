const Cart = require("../models/Cart"); // Assuming you have a Cart model

// Get user's cart items
exports.getCart = async (req, res) => {
    try {
        const userId = req.session.userId; // Ensure session-based authentication
        if (!userId) {
            return res.status(401).json({ message: "User not authenticated" });
        }

        const cartItems = await Cart.find({ userId });
        res.json(cartItems);
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};

// Add item to cart
exports.addToCart = async (req, res) => {
    try {
        const userId = req.session.userId;
        if (!userId) {
            return res.status(401).json({ message: "User not authenticated" });
        }

        const { productId, name, price, quantity, image, gst } = req.body;

        let cartItem = await Cart.findOne({ userId, productId });

        if (cartItem) {
            cartItem.quantity += quantity;
            await cartItem.save();
        } else {
            cartItem = new Cart({ userId, productId, name, price, quantity, image, gst });
            await cartItem.save();
        }

        res.status(201).json({ message: "Item added to cart", cartItem });
    } catch (error) {
        res.status(500).json({ message: "Error adding to cart", error });
    }
};

// Remove item from cart
exports.removeFromCart = async (req, res) => {
    try {
        const userId = req.session.userId;
        if (!userId) {
            return res.status(401).json({ message: "User not authenticated" });
        }

        const { productId } = req.params;

        await Cart.findOneAndDelete({ userId, productId });

        res.json({ message: "Item removed from cart" });
    } catch (error) {
        res.status(500).json({ message: "Error removing item", error });
    }
};

// Clear entire cart
exports.clearCart = async (req, res) => {
    try {
        const userId = req.session.userId;
        if (!userId) {
            return res.status(401).json({ message: "User not authenticated" });
        }

        await Cart.deleteMany({ userId });

        res.json({ message: "Cart cleared successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error clearing cart", error });
    }
};

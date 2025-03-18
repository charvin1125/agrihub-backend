const { v4: uuidv4 } = require("uuid");
const User = require("../models/User");


const registerUser = async (req, res) => {
  try {
    const { firstName, lastName, mobile, securityQuestion, securityAnswer } = req.body;

    // Generate username and use mobile as password
    const username = `CUST-${uuidv4().slice(0, 8).toUpperCase()}`;
    const password = mobile;

    const newUser = new User({
      firstName,
      lastName,
      mobile,
      username,
      password,
      securityQuestion,
      securityAnswer,
      isAdmin: false,
    });
    await newUser.save();

    res.status(201).json({ message: "User registered successfully", username });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const loginUser = async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ username });

        if (!user || user.password !== password) {
            return res.status(401).json({ message: "Invalid username or password" });
        }

        req.session.user = { id: user._id, username: user.username, isAdmin: user.isAdmin };
        res.status(200).json({ message: "Login successful", user: req.session.user });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};



const logoutUser = async (req, res) => {
  try {
    req.session.destroy((err) => {
      if (err) {
        console.error("Session destruction error:", err);
        return res.status(500).json({ error: "Logout failed" });
      }
      res.clearCookie("connect.sid", {
        httpOnly: true,
        secure: false, // Set to true if using HTTPS in production
        sameSite: "lax",
      });
      res.status(200).json({ message: "Logged out successfully" });
    });
  } catch (error) {
    console.error("Logout error:", error);
    res.status(500).json({ error: "Logout failed" });
  }
};

const getUserProfile = async (req, res) => {
    if (!req.session.user) {
        return res.status(401).json({ message: "Unauthorized. Please log in." });
    }
    try {
        const user = await User.findById(req.session.user.id).select("-password");
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
const getUserDetails = (req, res) => {
  if (!req.session.user) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  res.json(req.session.user);
};
const changePassword = async (req, res) => {
    const { currentPassword, newPassword } = req.body;
    try {
      const user = await User.findById(req.user._id); // Assuming user is set by auth middleware
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
  
      // Verify current password (plain text comparison)
      if (currentPassword !== user.password) {
        return res.status(400).json({ message: "Current password is incorrect" });
      }
  
      // Update password directly
      user.password = newPassword;
      await user.save();
  
      res.status(200).json({ message: "Password changed successfully" });
    } catch (error) {
      console.error("Error changing password:", error);
      res.status(500).json({ message: "Server error" });
    }
  };
  
const forgotPassword = async (req, res) => {
    const { mobile, securityQuestion, securityAnswer, newPassword } = req.body;
  
    try {
      const user = await User.findOne({ mobile });
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
  
      if (
        user.securityQuestion !== securityQuestion ||
        user.securityAnswer !== securityAnswer
      ) {
        return res.status(400).json({ error: "Incorrect security question or answer" });
      }
  
      // Update password (assuming plain text for now as per your setup)
      user.password = newPassword;
      await user.save();
  
      res.json({ message: "Password reset successful! Please login with your new password." });
    } catch (error) {
      res.status(500).json({ error: "Server error" });
    }
  };

const getAllCustomers = async (req, res) => {
    try {
      // Check if the requesting user is an admin
      if (!req.session.user || !req.session.user.isAdmin) {
        return res.status(403).json({ message: "Unauthorized: Admin access required" });
      }
  
      // Fetch all users who are not admins
      const customers = await User.find({ isAdmin: false }).select("-password -securityAnswer");
      
      res.status(200).json({
        message: "Customers retrieved successfully",
        customers: customers
      });
    } catch (error) {
      console.error("Error fetching customers:", error);
      res.status(500).json({ error: "Server error" });
    }
  };

const deleteCustomer = async (req, res) => {
    try {
      if (!req.session.user || !req.session.user.isAdmin) {
        return res.status(403).json({ message: "Unauthorized: Admin access required" });
      }
  
      const customerId = req.params.id;
      const customer = await User.findById(customerId);
  
      if (!customer) {
        return res.status(404).json({ message: "Customer not found" });
      }
  
      if (customer.isAdmin) {
        return res.status(403).json({ message: "Cannot delete admin users" });
      }
  
      await User.findByIdAndDelete(customerId);
      res.status(200).json({ message: "Customer deleted successfully" });
    } catch (error) {
      console.error("Error deleting customer:", error);
      res.status(500).json({ error: "Server error" });
    }
  };
  
const addToWishlist = async (req, res) => {
    const userId = req.session.user?.id;
    const { productId } = req.body;
  
    if (!userId) {
      return res.status(401).json({ success: false, message: "Not authenticated" });
    }
    if (!productId) {
      return res.status(400).json({ success: false, message: "Product ID is required" });
    }
  
    try {
      const user = await User.findById(userId);
      if (!user.wishlist.includes(productId)) {
        user.wishlist.push(productId);
        await user.save();
      }
      res.status(200).json({ success: true, message: "Product added to wishlist" });
    } catch (error) {
      console.error("Error adding to wishlist:", error);
      res.status(500).json({ success: false, message: "Server error" });
    }
  };
  
  // Remove product from wishlist
const removeFromWishlist = async (req, res) => {
    const userId = req.session.user?.id;
    const { productId } = req.body;
  
    if (!userId) {
      return res.status(401).json({ success: false, message: "Not authenticated" });
    }
    if (!productId) {
      return res.status(400).json({ success: false, message: "Product ID is required" });
    }
  
    try {
      const user = await User.findById(userId);
      user.wishlist = user.wishlist.filter((id) => id.toString() !== productId);
      await user.save();
      res.status(200).json({ success: true, message: "Product removed from wishlist" });
    } catch (error) {
      console.error("Error removing from wishlist:", error);
      res.status(500).json({ success: false, message: "Server error" });
    }
  };
const getUserById = async (req, res) => {
    const { userId } = req.params;
    try {
      if (!req.session.user) {
        return res.status(403).json({ success: false, message: "Not authenticated" });
      }
      const user = await User.findById(userId).select("firstName lastName");
      if (!user) {
        return res.status(404).json({ success: false, message: "User not found" });
      }
      res.status(200).json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ success: false, message: "Server error" });
    }
};
  // Get user's wishlist
const getWishlist = async (req, res) => {
    const userId = req.session.user?.id;
  
    if (!userId) {
      return res.status(401).json({ success: false, message: "Not authenticated" });
    }
  
    try {
      const user = await User.findById(userId).populate("wishlist", "name images category brand variants");
      res.status(200).json({ success: true, wishlist: user.wishlist });
    } catch (error) {
      console.error("Error fetching wishlist:", error);
      res.status(500).json({ success: false, message: "Server error" });
    }
  };
  module.exports = {
    registerUser,
    loginUser,
    logoutUser,
    getUserProfile,
    getUserDetails,
    changePassword,
    forgotPassword,
    getAllCustomers,
    deleteCustomer,
    // addToWishlist,
    // removeFromWishlist,
    // getWishlist,
    // getUserById,
  };
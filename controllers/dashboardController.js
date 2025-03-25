const User = require("../models/User");
const Order = require("../models/Order");

exports.getTotalUsers = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    res.json({ totalUsers });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getTotalRevenue = async (req, res) => {
  try {
    const orders = await Order.aggregate([
      { $group: { _id: null, totalRevenue: { $sum: "$totalAmount" } } },
    ]);
    res.json({ totalRevenue: orders[0]?.totalRevenue || 0 });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getTotalOrders = async (req, res) => {
  try {
    const totalOrders = await Order.countDocuments();
    res.json({ totalOrders });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
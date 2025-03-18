// const Order = require("../models/Order");
// const Product = require("../models/Product");
// const User = require("../models/User");
// const Vendor = require("../models/Vendor"); 

// // Dashboard overview stats
// exports.getDashboardStats = async (req, res) => {
//   try {
//     const totalUsers = await User.countDocuments();
//     const totalOrders = await Order.countDocuments();
//     const totalRevenue = await Order.aggregate([
//       { $match: { status: "Completed" } },
//       { $group: { _id: null, revenue: { $sum: "$totalAmount" } } },
//     ]);
//     res.json({ totalUsers, totalOrders, totalRevenue: totalRevenue[0]?.revenue || 0 });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };

// // Brand-wise stock availability
// exports.getBrandStock = async (req, res) => {
//   try {
//     const stockData = await Product.aggregate([
//       { $unwind: "$variants" },
//       { $group: { _id: "$brand", totalStock: { $sum: "$variants.stock" } } },
//       { $sort: { totalStock: -1 } },
//     ]);
//     res.json(stockData);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };


// // Order status distribution
// exports.getOrderStats = async (req, res) => {
//   try {
//     const orderStatus = await Order.aggregate([
//       { $group: { _id: "$status", count: { $sum: 1 } } },
//     ]);
//     res.json(orderStatus);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };

// // Sales trend over time
// exports.getSalesTrends = async (req, res) => {
//   try {
//     const salesTrends = await Order.aggregate([
//       { $match: { status: "Completed" } },
//       { $group: { _id: { $month: "$createdAt" }, totalSales: { $sum: "$totalAmount" } } },
//       { $sort: { "_id": 1 } },
//     ]);
//     res.json(salesTrends);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };

// // Top-selling products
// exports.getTopProducts = async (req, res) => {
//   try {
//     const topProducts = await Order.aggregate([
//       { $unwind: "$cart" },
//       { $group: { _id: "$cart.name", totalSold: { $sum: "$cart.quantity" } } },
//       { $sort: { totalSold: -1 } },
//       { $limit: 5 },
//     ]);
//     res.json(topProducts);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };
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
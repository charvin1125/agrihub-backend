const express = require("express");
const Order = require("../models/Order");
const Product = require("../models/Product");
const router = express.Router();

// 📊 1. Get Order Status Distribution
router.get("/order-status", async (req, res) => {
  try {
    const statusCounts = await Order.aggregate([
      { $group: { _id: "$status", count: { $sum: 1 } } },
    ]);
    res.json(statusCounts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 📊 2. Get Total Stock by Brand
router.get("/brand-stock", async (req, res) => {
  try {
    const stockData = await Product.aggregate([
      { $unwind: "$variants" },
      { $group: { _id: "$brand", totalStock: { $sum: "$variants.stock" } } },
    ]);
    res.json(stockData);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 📊 3. Get Revenue & Sales Trend
router.get("/sales-trend", async (req, res) => {
  try {
    const salesData = await Order.aggregate([
      { $group: { _id: { $month: "$createdAt" }, revenue: { $sum: "$totalAmount" }, count: { $sum: 1 } } },
      { $sort: { "_id": 1 } }
    ]);
    res.json(salesData);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 📊 4. Get Top-Selling Products
router.get("/top-products", async (req, res) => {
  try {
    const topProducts = await Order.aggregate([
      { $unwind: "$cart" },
      { $group: { _id: "$cart.name", totalSold: { $sum: "$cart.quantity" } } },
      { $sort: { totalSold: -1 } },
      { $limit: 5 }
    ]);
    res.json(topProducts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;

// const express = require("express");
// const { getDashboardStats, getBrandStock, getOrderStats, getSalesTrends, getTopProducts } = require("../controllers/dashboardController");
// const router = express.Router();

// router.get("/stats", getDashboardStats);
// router.get("/brand-stock", getBrandStock);
// router.get("/order-stats", getOrderStats);
// router.get("/sales-trends", getSalesTrends);
// router.get("/top-products", getTopProducts);

// module.exports = router;
const express = require("express");
const router = express.Router();
const {
  getTotalUsers,
  getTotalRevenue,
  getTotalOrders,
} = require("../controllers/dashboardController");
const { isAuthenticated, isAdmin } = require("../Middlewares/auth");

router.get("/total-users", isAuthenticated, isAdmin, getTotalUsers);
router.get("/total-revenue", isAuthenticated, isAdmin, getTotalRevenue);
router.get("/total-orders", isAuthenticated, isAdmin, getTotalOrders);

module.exports = router;
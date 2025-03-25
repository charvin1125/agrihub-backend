const express = require("express");
const router = express.Router();
const {
  getTotalUsers,
  getTotalRevenue,
  getTotalOrders,
} = require("../controllers/dashboardController");
const { isAuthenticated, isAdmin } = require("../middlewares/auth");

router.get("/total-users", isAuthenticated, isAdmin, getTotalUsers);
router.get("/total-revenue", isAuthenticated, isAdmin, getTotalRevenue);
router.get("/total-orders", isAuthenticated, isAdmin, getTotalOrders);

module.exports = router;
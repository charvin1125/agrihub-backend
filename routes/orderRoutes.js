const express = require("express");
const {
  placeOrder,
  getMyOrders,
  getAllOrders,
  getOrdersByCustomerMobile,
  getMyBills,
  createOfflineOrder, 
  getCustomerDetailsByPhone,
  getOrderStats,
  getSalesDistribution,
  createRazorpayOrder,
  verifyRazorpayPayment,
  updateOrderStatus,
  payDues, // Added new controller function
} = require("../controllers/orderController");
const { isAuthenticated, isAdmin } = require("../middlewares/auth");

const router = express.Router();

router.post("/place", isAuthenticated, placeOrder);
router.get("/my-orders", isAuthenticated, getMyOrders);
router.get("/list", isAdmin, getAllOrders);
router.get("/customer/:mobile", isAdmin, getOrdersByCustomerMobile); // Updated route name for consistency
router.get("/my-bills", isAuthenticated, getMyBills);
// router.post("/offline-purchase", isAdmin, createOfflineOrder);
router.get("/customer/:phoneNumber",isAdmin, getCustomerDetailsByPhone);
router.post("/offline", isAdmin,createOfflineOrder);
router.get("/stats", isAdmin, getOrderStats);
router.get("/sales", isAdmin, getSalesDistribution);
router.post("/create-razorpay-order", isAuthenticated, createRazorpayOrder);
router.post("/verify-razorpay-payment", isAuthenticated, verifyRazorpayPayment);
router.put("/update-status/:orderId", isAdmin, updateOrderStatus);
router.put("/pay-dues/:orderId", isAdmin, payDues); // New route for paying dues

module.exports = router;
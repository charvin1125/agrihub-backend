// const express = require("express");
// const router = express.Router();
// const orderController = require("../controllers/orderController");
// const { isAuthenticated,isAdmin } = require("../middlewares/auth");

// router.post("/place", isAuthenticated,orderController.placeOrder);

// router.get("/list", orderController.getAllOrders);

// router.get("/:orderId", orderController.getOrderById);

// router.put("/update/:orderId", orderController.updateOrderStatus);

// router.delete("/delete/:orderId", orderController.deleteOrder);

// router.get("/previous-orders", orderController.getUserOrders);

// router.get("/order/:id", orderController.getUserOrderById);

// router.get("/all-orders", isAuthenticated, isAdmin, orderController.getAllOrders);
// module.exports = router;
const express = require("express");
const { placeOrder, getMyOrders, getAllOrders,getOrdersByCustomerMobile,getMyBills,createOfflineOrder,getOrderStats ,getSalesDistribution,createRazorpayOrder,
    verifyRazorpayPayment,} = require("../controllers/orderController");
const { isAuthenticated ,isAdmin} = require("../middlewares/auth");
const router = express.Router();
router.get("/my-bills", getMyBills);
router.post("/place", isAuthenticated ,placeOrder); // 🔹 Place Order
router.get("/my-orders", isAuthenticated ,getMyOrders); // 🔹 Get User's Orders
router.get("/list", getAllOrders); // 🔹 Admin: Get All Orders
router.get("/customer-orders/:mobile", getOrdersByCustomerMobile);
router.post("/offline-purchase", isAdmin,createOfflineOrder);
router.get("/stats",isAdmin,getOrderStats);
router.get("/sales",isAdmin,getSalesDistribution);
router.post("/create-razorpay-order", isAuthenticated, createRazorpayOrder); // New endpoint
router.post("/verify-razorpay-payment", isAuthenticated, verifyRazorpayPayment); 
module.exports = router;

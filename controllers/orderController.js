// const User = require("../models/User"); 
// const Order = require("../models/Order");
// const Product = require("../models/Product");
// const mongoose = require("mongoose");


// const placeOrder = async (req, res) => {
//   try {
//     const userId = req.session.user?.id;
  
//     if (!userId) {
//       return res.status(401).json({ success: false, message: "Unauthorized. Please log in." });
//     }

//     const { name, phone, address, pincode, crop,paymentMethod, totalAmount, cart } = req.body;

//     if (!name || !phone || !address || !pincode || !crop || !totalAmount || !cart || cart.length === 0) {
//       return res.status(400).json({ success: false, message: "All fields are required." });
//     }

//     // Check product variants
//     for (const item of cart) {
//       const product = await Product.findById(item.productId);
//       if (!product) {
//         return res.status(404).json({ success: false, message: `Product not found for ${item.name}` });
//       }

//       const variant = product.variants.find(v => v._id.toString() === item.variantId);
//       if (!variant) {
//         return res.status(404).json({ success: false, message: `Variant not found for ${item.name}. VariantId: ${item.variantId}` });
//       }

//       // Reduce stock quantity
//       if (variant.stock < item.quantity) {
//         return res.status(400).json({ success: false, message: `Insufficient stock for ${item.name}` });
//       }
//       variant.stock -= item.quantity;
//       await product.save();
//     }

//     const newOrder = new Order({ userId, name, phone, address, pincode, crop, purchaseType:"Online",paymentMethod, totalAmount, cart });

//     await newOrder.save();
//     res.status(201).json({ success: true, message: "Order placed successfully!", order: newOrder });
//   } catch (error) {
//     console.error("Error placing order:", error);
//     res.status(500).json({ success: false, message: "Internal Server Error" });
//   }
// };

// module.exports = { placeOrder };

// const getMyOrders = async (req, res) => {
//   try {
//     const userId = req.session.user?.id;
//     if (!userId) {
//       return res.status(401).json({ success: false, message: "Unauthorized. Please log in." });
//     }
//     const orders = await Order.find({ userId }).sort({ createdAt: -1 });
//     res.status(200).json({ success: true, orders });
//   } catch (error) {
//     console.error("Error fetching orders:", error);
//     res.status(500).json({ success: false, message: "Internal Server Error" });
//   }
// };


// // ✅ Get All Orders (Admin Only) (GET /api/orders)
// const getAllOrders = async (req, res) => {
//   try {
//     const orders = await Order.find().populate("user", "name email");
//     res.status(200).json(orders);
//   } catch (error) {
//     res.status(500).json({ error: "Failed to fetch orders" });
//   }
// };

// const getOrdersByCustomerMobile = async (req, res) => {
//   try {
//     const { mobile } = req.params;
//     if (!mobile) return res.status(400).json({ success: false, message: "Mobile number is required" });

//     // ✅ Fetch orders & populate product names
//     const orders = await Order.find({ phone: mobile })
//       .sort({ createdAt: -1 })
//       .populate("cart.productId", "name"); // 🔹 Populate product names

//     // ✅ Calculate total dues
//     const totalDues = orders
//       .filter((order) => order.isDue) // Only include "Pay Later" orders
//       .reduce((sum, order) => sum + order.totalAmount, 0);

//     res.status(200).json({ success: true, orders, totalDues });
//   } catch (error) {
//     console.error("Error fetching customer orders:", error);
//     res.status(500).json({ success: false, message: "Internal Server Error" });
//   }
// };

// // 📌 Fetch all orders of the logged-in user
// const getMyBills = async (req, res) => {
//   try {
//     if (!req.session.userId) {
//       return res.status(401).json({ success: false, message: "Unauthorized" });
//     }

//     const orders = await Order.find({ userId: req.session.userId }).sort({ createdAt: -1 });

//     res.json({ success: true, orders });
//   } catch (error) {
//     console.error("Error fetching bills:", error);
//     res.status(500).json({ success: false, message: "Server error" });
//   }
// };

// const createOfflineOrder = async (req, res) => {
//   try {
//     const userId = req.session.user?.id;
//     const { name, phone, crop, cart, totalAmount, paymentMethod } = req.body;

//     if (!name || !phone || !cart || cart.length === 0 || !totalAmount || !crop || !paymentMethod) {
//       return res.status(400).json({ success: false, message: "Missing required fields" });
//     }

//     const isDue = paymentMethod === "Pay Later"; // ✅ Mark as due if Pay Later is used

//     const newOrder = new Order({
//       userId,
//       name,
//       phone,
//       address: "Offline Purchase",
//       pincode: "000000",
//       crop,
//       purchaseType: "Offline",
//       paymentMethod,
//       totalAmount,
//       status: "Completed",
//       cart,
//       isDue, // ✅ Store if the order is due
//     });

//     await newOrder.save();

//     // ✅ Update Stock After Purchase
//     for (const item of cart) {
//       const product = await Product.findById(item.productId);
//       if (product) {
//         const variant = product.variants.find((v) => v._id.toString() === item.variantId);
//         if (variant) {
//           variant.stock -= item.quantity;
//           if (variant.stock < 0) variant.stock = 0;
//         }
//         await product.save();
//       }
//     }

//     res.status(201).json({ success: true, message: "Offline order placed successfully!", order: newOrder });
//   } catch (error) {
//     console.error("Error placing offline order:", error);
//     res.status(500).json({ success: false, message: "Internal Server Error" });
//   }
// };



// //for the charts 
// const getOrderStats = async (req, res) => {
//   try {
//     const orders = await Order.aggregate([
//       { $group: { _id: { $month: "$createdAt" }, count: { $sum: 1 } } },
//       { $sort: { "_id": 1 } },
//     ]);
//     res.status(200).json(orders.map((o) => ({ month: o._id, count: o.count })));
//   } catch (error) {
//     console.error("Error fetching order stats:", error);
//     res.status(500).json({ message: "Error fetching stats" });
//   }
// };

// const getSalesDistribution = async (req, res) => {
//   try {
//     const sales = await Order.aggregate([
//       { $group: { _id: "$purchaseType", total: { $sum: "$totalAmount" } } },
//     ]);
//     res.status(200).json(sales);
//   } catch (error) {
//     console.error("Error fetching sales distribution:", error);
//     res.status(500).json({ message: "Error fetching sales" });
//   }
// };

// const Razorpay = require("razorpay");
// const crypto = require("crypto");

// const razorpayInstance = new Razorpay({
//   key_id: "rzp_test_fwA1F6rg7iQI8x", // From Razorpay Dashboard
//   key_secret: "oz1Nzimmw5c7tusgHbaqRRhR", // From Razorpay Dashboard
// });


// const createRazorpayOrder = async (req, res) => {
//   try {
//     const { amount } = req.body; // Amount in paise
//     if (!amount || isNaN(amount)) {
//       return res.status(400).json({ error: "Invalid amount" });
//     }

//     const options = {
//       amount: parseInt(amount), // Ensure integer
//       currency: "INR",
//       receipt: `receipt_${Date.now()}`,
//     };

//     const order = await razorpayInstance.orders.create(options);
//     console.log("Created Razorpay Order:", order); // Debug log
//     res.json({ id: order.id, currency: order.currency });
//   } catch (error) {
//     console.error("Error creating Razorpay order:", error);
//     res.status(500).json({ error: "Failed to create order" });
//   }
// };

// // Verify Razorpay payment and save order
// const verifyRazorpayPayment = async (req, res) => {
//   const { razorpay_order_id, razorpay_payment_id, razorpay_signature, orderData } = req.body;
//   const userId = req.session.user?.id;
//   try {
//     // Verify signature
//     const secret = "oz1Nzimmw5c7tusgHbaqRRhR"; // Replace with your key secret
//     const body = `${razorpay_order_id}|${razorpay_payment_id}`;
//     const generatedSignature = crypto
//       .createHmac("sha256", secret)
//       .update(body)
//       .digest("hex");

//     console.log("Generated Signature:", generatedSignature); // Debug log
//     console.log("Received Signature:", razorpay_signature); // Debug log

//     if (generatedSignature !== razorpay_signature) {
//       console.error("Signature mismatch:", { generatedSignature, razorpay_signature });
//       return res.status(400).json({ error: "Invalid payment signature" });
//     }

//     // Save order directly (no nested axios call)
//     const newOrder = new Order({
//       ...orderData,
//       userId,
//       purchaseType:"Online",
//       razorpayOrderId: razorpay_order_id,
//       razorpayPaymentId: razorpay_payment_id,
//       status: "Paid", // Update status as needed
//     });
//     await newOrder.save();

//     res.json({ success: true, message: "Order placed successfully" });
//   } catch (error) {
//     console.error("Error verifying payment:", error.message);
//     res.status(500).json({ error: "Payment verification failed" });
//   }
// };
// module.exports = { placeOrder, getMyOrders, getAllOrders ,getOrdersByCustomerMobile,getMyBills,createOfflineOrder,getOrderStats,getSalesDistribution,createRazorpayOrder,verifyRazorpayPayment};
// const User = require("../models/User");
// const Order = require("../models/Order");
// const Product = require("../models/Product");
// const Razorpay = require("razorpay");
// const crypto = require("crypto");

// const razorpayInstance = new Razorpay({
//   key_id: "rzp_test_fwA1F6rg7iQI8x", // Replace with your Razorpay Key ID
//   key_secret: "oz1Nzimmw5c7tusgHbaqRRhR", // Replace with your Razorpay Key Secret
// });

// const placeOrder = async (req, res) => {
//   try {
//     const userId = req.session.user?.id;
//     if (!userId) {
//       return res.status(401).json({ success: false, message: "Unauthorized. Please log in." });
//     }

//     const { name, phone, address, pincode, crop, paymentMethod, totalAmount, cart } = req.body;

//     if (!name || !phone || !address || !pincode || !crop || !paymentMethod || !totalAmount || !cart || !cart.length) {
//       return res.status(400).json({ success: false, message: "All fields are required." });
//     }

//     // Validate and update stock
//     for (const item of cart) {
//       const product = await Product.findById(item.productId);
//       if (!product) {
//         return res.status(404).json({ success: false, message: `Product not found: ${item.name}` });
//       }

//       const variant = product.variants.find((v) => v._id.toString() === item.variantId);
//       if (!variant) {
//         return res.status(404).json({ success: false, message: `Variant not found for ${item.name}` });
//       }

//       if (variant.stock < item.quantity) {
//         return res.status(400).json({ success: false, message: `Insufficient stock for ${item.name}` });
//       }

//       // Pre-calculate totalWithGST for consistency
//       const gstRate = item.gst / 100 || 0;
//       item.totalWithGST = item.price * item.quantity * (1 + gstRate);

//       variant.stock -= item.quantity;
//       await product.save();
//     }

//     const isDue = paymentMethod === "Pay Later";
//     const newOrder = new Order({
//       userId,
//       name,
//       phone,
//       address,
//       pincode,
//       crop,
//       purchaseType: "Online",
//       paymentMethod,
//       totalAmount,
//       cart,
//       isDue,
//       status: paymentMethod === "Cash" ? "Completed" : "Pending",
//     });

//     await newOrder.save();
//     res.status(201).json({ success: true, message: "Order placed successfully!", order: newOrder });
//   } catch (error) {
//     console.error("Error placing order:", error);
//     res.status(500).json({ success: false, message: "Internal Server Error" });
//   }
// };

// // const getMyOrders = async (req, res) => {
// //   try {
// //     const userId = req.session.user?.id;
// //     if (!userId) {
// //       return res.status(401).json({ success: false, message: "Unauthorized. Please log in." });
// //     }
// //     const orders = await Order.find({ userId })
// //       .populate("cart.productId", "name images") // Populate product name and images
// //       .sort({ createdAt: -1 });
// //     res.status(200).json({ success: true, orders });
// //   } catch (error) {
// //     console.error("Error fetching orders:", error);
// //     res.status(500).json({ success: false, message: "Internal Server Error" });
// //   }
// // };
// const getMyOrders = async (req, res) => {
//   try {
//     const userId = req.session.user?.id;
//     if (!userId) {
//       return res.status(401).json({ success: false, message: "Unauthorized. Please log in." });
//     }
//     const orders = await Order.find({ userId })
//       .populate("cart.productId", "name images")
//       .sort({ createdAt: -1 });
//     res.status(200).json({ success: true, orders });
//   } catch (error) {
//     console.error("Error fetching orders:", error);
//     res.status(500).json({ success: false, message: "Internal Server Error" });
//   }
// };

// const getAllOrders = async (req, res) => {
//   try {
//     const orders = await Order.find()
//       .populate("userId", "firstName email") // Changed "user" to "userId" to match schema
//       .sort({ createdAt: -1 });
//     res.status(200).json({ success: true, orders });
//   } catch (error) {
//     console.error("Error fetching all orders:", error);
//     res.status(500).json({ success: false, message: "Failed to fetch orders" });
//   }
// };

// const getOrdersByCustomerMobile = async (req, res) => {
//   try {
//     const { mobile } = req.params;
//     if (!mobile) {
//       return res.status(400).json({ success: false, message: "Mobile number is required" });
//     }

//     const orders = await Order.find({ phone: mobile })
//       .populate("cart.productId", "name")
//       .sort({ createdAt: -1 });

//     const totalDues = orders
//       .filter((order) => order.isDue)
//       .reduce((sum, order) => sum + order.totalAmount, 0);

//     res.status(200).json({ success: true, orders, totalDues });
//   } catch (error) {
//     console.error("Error fetching customer orders:", error);
//     res.status(500).json({ success: false, message: "Internal Server Error" });
//   }
// };

// const getMyBills = async (req, res) => {
//   try {
//     const userId = req.session.user?.id; // Changed from userId to match session
//     if (!userId) {
//       return res.status(401).json({ success: false, message: "Unauthorized" });
//     }

//     const orders = await Order.find({ userId }).sort({ createdAt: -1 });
//     res.json({ success: true, orders });
//   } catch (error) {
//     console.error("Error fetching bills:", error);
//     res.status(500).json({ success: false, message: "Server error" });
//   }
// };

// const createOfflineOrder = async (req, res) => {
//   try {
//     const userId = req.session.user?.id;
//     const { name, phone, crop, cart, totalAmount, paymentMethod } = req.body;

//     if (!name || !phone || !cart || !cart.length || !totalAmount || !crop || !paymentMethod) {
//       return res.status(400).json({ success: false, message: "Missing required fields" });
//     }

//     // Validate and update stock
//     for (const item of cart) {
//       const product = await Product.findById(item.productId);
//       if (!product) {
//         return res.status(404).json({ success: false, message: `Product not found: ${item.name}` });
//       }

//       const variant = product.variants.find((v) => v._id.toString() === item.variantId);
//       if (!variant) {
//         return res.status(404).json({ success: false, message: `Variant not found for ${item.name}` });
//       }

//       if (variant.stock < item.quantity) {
//         return res.status(400).json({ success: false, message: `Insufficient stock for ${item.name}` });
//       }

//       item.totalWithGST = item.price * item.quantity * (1 + (item.gst / 100 || 0));
//       variant.stock -= item.quantity;
//       await product.save();
//     }

//     const isDue = paymentMethod === "Pay Later";
//     const newOrder = new Order({
//       userId,
//       name,
//       phone,
//       address: "Offline Purchase",
//       pincode: "000000",
//       crop,
//       purchaseType: "Offline",
//       paymentMethod,
//       totalAmount,
//       status: paymentMethod === "Cash" ? "Completed" : "Pending",
//       cart,
//       isDue,
//     });

//     await newOrder.save();
//     res.status(201).json({ success: true, message: "Offline order placed successfully!", order: newOrder });
//   } catch (error) {
//     console.error("Error placing offline order:", error);
//     res.status(500).json({ success: false, message: "Internal Server Error" });
//   }
// };

// const getOrderStats = async (req, res) => {
//   try {
//     const orders = await Order.aggregate([
//       { $group: { _id: { $month: "$createdAt" }, count: { $sum: 1 } } },
//       { $sort: { "_id": 1 } },
//     ]);
//     res.status(200).json(orders.map((o) => ({ month: o._id, count: o.count })));
//   } catch (error) {
//     console.error("Error fetching order stats:", error);
//     res.status(500).json({ success: false, message: "Error fetching stats" });
//   }
// };

// const getSalesDistribution = async (req, res) => {
//   try {
//     const sales = await Order.aggregate([
//       { $group: { _id: "$purchaseType", total: { $sum: "$totalAmount" } } },
//     ]);
//     res.status(200).json(sales);
//   } catch (error) {
//     console.error("Error fetching sales distribution:", error);
//     res.status(500).json({ success: false, message: "Error fetching sales" });
//   }
// };

// const createRazorpayOrder = async (req, res) => {
//   try {
//     const { amount } = req.body; // Amount in paise
//     if (!amount || isNaN(amount)) {
//       return res.status(400).json({ success: false, message: "Invalid amount" });
//     }

//     const options = {
//       amount: parseInt(amount),
//       currency: "INR",
//       receipt: `receipt_${Date.now()}`,
//     };

//     const order = await razorpayInstance.orders.create(options);
//     console.log("Created Razorpay Order:", order);
//     res.json({ success: true, id: order.id, currency: order.currency });
//   } catch (error) {
//     console.error("Error creating Razorpay order:", error);
//     res.status(500).json({ success: false, message: "Failed to create order" });
//   }
// };

// const verifyRazorpayPayment = async (req, res) => {
//   const { razorpay_order_id, razorpay_payment_id, razorpay_signature, orderData } = req.body;
//   const userId = req.session.user?.id;

//   try {
//     if (!userId) {
//       return res.status(401).json({ success: false, message: "Unauthorized" });
//     }

//     // Verify signature
//     const secret = "oz1Nzimmw5c7tusgHbaqRRhR"; // Replace with your Razorpay Key Secret
//     const body = `${razorpay_order_id}|${razorpay_payment_id}`;
//     const generatedSignature = crypto
//       .createHmac("sha256", secret)
//       .update(body)
//       .digest("hex");

//     if (generatedSignature !== razorpay_signature) {
//       console.error("Signature mismatch:", { generatedSignature, razorpay_signature });
//       return res.status(400).json({ success: false, message: "Invalid payment signature" });
//     }

//     // Validate and update stock
//     for (const item of orderData.cart) {
//       const product = await Product.findById(item.productId);
//       if (!product) {
//         return res.status(404).json({ success: false, message: `Product not found: ${item.name}` });
//       }

//       const variant = product.variants.find((v) => v._id.toString() === item.variantId);
//       if (!variant) {
//         return res.status(404).json({ success: false, message: `Variant not found for ${item.name}` });
//       }

//       if (variant.stock < item.quantity) {
//         return res.status(400).json({ success: false, message: `Insufficient stock for ${item.name}` });
//       }

//       item.totalWithGST = item.price * item.quantity * (1 + (item.gst / 100 || 0));
//       variant.stock -= item.quantity;
//       await product.save();
//     }

//     const newOrder = new Order({
//       ...orderData,
//       userId,
//       purchaseType: "Online",
//       razorpayOrderId: razorpay_order_id,
//       razorpayPaymentId: razorpay_payment_id,
//       status: "Paid",
//     });

//     await newOrder.save();
//     res.json({ success: true, message: "Order placed successfully", order: newOrder });
//   } catch (error) {
//     console.error("Error verifying payment:", error);
//     res.status(500).json({ success: false, message: "Payment verification failed" });
//   }
// };
// // const updateOrderStatus = async (req, res) => {
// //   try {
// //     const { orderId } = req.params;
// //     const { status } = req.body;

// //     if (!orderId || !status) {
// //       return res.status(400).json({ success: false, message: "Order ID and status are required." });
// //     }

// //     const order = await Order.findById(orderId);
// //     if (!order) {
// //       return res.status(404).json({ success: false, message: "Order not found." });
// //     }

// //     order.status = status;
// //     await order.save();

// //     res.status(200).json({ success: true, message: "Order status updated successfully!", order });
// //   } catch (error) {
// //     console.error("Error updating order status:", error);
// //     res.status(500).json({ success: false, message: "Internal Server Error" });
// //   }
// // };
// const updateOrderStatus = async (req, res) => {
//   try {
//     const { orderId } = req.params;
//     const { status } = req.body;
//     const userId = req.session.user?.id;

//     if (!orderId || !status) {
//       return res.status(400).json({ success: false, message: "Order ID and status are required." });
//     }

//     const validStatuses = ["Pending", "Paid", "Shipped", "Completed", "Cancelled"];
//     if (!validStatuses.includes(status)) {
//       return res.status(400).json({ success: false, message: "Invalid status." });
//     }

//     const order = await Order.findById(orderId);
//     if (!order) {
//       return res.status(404).json({ success: false, message: "Order not found." });
//     }

//     order.status = status;
//     order.statusHistory.push({ status, updatedBy: userId });
//     if (status === "Paid" || status === "Completed") order.isDue = false;
//     await order.save();

//     res.status(200).json({ success: true, message: "Order status updated successfully!", order });
//   } catch (error) {
//     console.error("Error updating order status:", error);
//     res.status(500).json({ success: false, message: "Internal Server Error" });
//   }
// };

// module.exports = {
//   placeOrder,
//   getMyOrders,
//   getAllOrders,
//   getOrdersByCustomerMobile,
//   getMyBills,
//   createOfflineOrder,
//   getOrderStats,
//   getSalesDistribution,
//   createRazorpayOrder,
//   verifyRazorpayPayment,
//   updateOrderStatus,
// };

// const User = require("../models/User");
// const Order = require("../models/Order");
// const Product = require("../models/Product");
// const Razorpay = require("razorpay");
// const crypto = require("crypto");

// const razorpayInstance = new Razorpay({
//   key_id: "rzp_test_fwA1F6rg7iQI8x", // Replace with your Razorpay Key ID
//   key_secret: "oz1Nzimmw5c7tusgHbaqRRhR", // Replace with your Razorpay Key Secret
// });

// const placeOrder = async (req, res) => {
//   try {
//     const userId = req.session.user?.id;
//     if (!userId) {
//       return res.status(401).json({ success: false, message: "Unauthorized. Please log in." });
//     }

//     const { name, phone, address, pincode, crop, paymentMethod, totalAmount, cart } = req.body;

//     if (!name || !phone || !address || !pincode || !crop || !paymentMethod || !totalAmount || !cart || !cart.length) {
//       return res.status(400).json({ success: false, message: "All fields are required." });
//     }

//     // Validate and update stock
//     for (const item of cart) {
//       const product = await Product.findById(item.productId);
//       if (!product) {
//         return res.status(404).json({ success: false, message: `Product not found: ${item.name}` });
//       }

//       const variant = product.variants.find((v) => v._id.toString() === item.variantId);
//       if (!variant) {
//         return res.status(404).json({ success: false, message: `Variant not found for ${item.name}` });
//       }

//       if (variant.stock < item.quantity) {
//         return res.status(400).json({ success: false, message: `Insufficient stock for ${item.name}` });
//       }

//       // Pre-calculate totalWithGST for consistency
//       const gstRate = item.gst / 100 || 0;
//       item.totalWithGST = item.price * item.quantity * (1 + gstRate);

//       variant.stock -= item.quantity;
//       await product.save();
//     }

//     const isDue = paymentMethod === "Pay Later";
//     const newOrder = new Order({
//       userId,
//       name,
//       phone,
//       address,
//       pincode,
//       crop,
//       purchaseType: "Online",
//       paymentMethod,
//       totalAmount,
//       cart,
//       isDue,
//       status: paymentMethod === "Cash" ? "Completed" : "Pending",
//     });

//     await newOrder.save();
//     res.status(201).json({ success: true, message: "Order placed successfully!", order: newOrder });
//   } catch (error) {
//     console.error("Error placing order:", error);
//     res.status(500).json({ success: false, message: "Internal Server Error" });
//   }
// };

// // const getMyOrders = async (req, res) => {
// //   try {
// //     const userId = req.session.user?.id;
// //     if (!userId) {
// //       return res.status(401).json({ success: false, message: "Unauthorized. Please log in." });
// //     }
// //     const orders = await Order.find({ userId })
// //       .populate("cart.productId", "name images") // Populate product name and images
// //       .sort({ createdAt: -1 });
// //     res.status(200).json({ success: true, orders });
// //   } catch (error) {
// //     console.error("Error fetching orders:", error);
// //     res.status(500).json({ success: false, message: "Internal Server Error" });
// //   }
// // };
// const getMyOrders = async (req, res) => {
//   try {
//     const userId = req.session.user?.id;
//     if (!userId) {
//       return res.status(401).json({ success: false, message: "Unauthorized. Please log in." });
//     }
//     const orders = await Order.find({ userId })
//       .populate("cart.productId", "name images")
//       .sort({ createdAt: -1 });
//     res.status(200).json({ success: true, orders });
//   } catch (error) {
//     console.error("Error fetching orders:", error);
//     res.status(500).json({ success: false, message: "Internal Server Error" });
//   }
// };

// const getAllOrders = async (req, res) => {
//   try {
//     const orders = await Order.find()
//       .populate("userId", "firstName email") // Changed "user" to "userId" to match schema
//       .sort({ createdAt: -1 });
//     res.status(200).json({ success: true, orders });
//   } catch (error) {
//     console.error("Error fetching all orders:", error);
//     res.status(500).json({ success: false, message: "Failed to fetch orders" });
//   }
// };

// const getOrdersByCustomerMobile = async (req, res) => {
//   try {
//     const { mobile } = req.params;
//     if (!mobile) {
//       return res.status(400).json({ success: false, message: "Mobile number is required" });
//     }

//     const orders = await Order.find({ phone: mobile })
//       .populate("cart.productId", "name")
//       .sort({ createdAt: -1 });

//     const totalDues = orders
//       .filter((order) => order.isDue)
//       .reduce((sum, order) => sum + order.totalAmount, 0);

//     res.status(200).json({ success: true, orders, totalDues });
//   } catch (error) {
//     console.error("Error fetching customer orders:", error);
//     res.status(500).json({ success: false, message: "Internal Server Error" });
//   }
// };

// const getMyBills = async (req, res) => {
//   try {
//     const userId = req.session.user?.id; // Changed from userId to match session
//     if (!userId) {
//       return res.status(401).json({ success: false, message: "Unauthorized" });
//     }

//     const orders = await Order.find({ userId }).sort({ createdAt: -1 });
//     res.json({ success: true, orders });
//   } catch (error) {
//     console.error("Error fetching bills:", error);
//     res.status(500).json({ success: false, message: "Server error" });
//   }
// };

// const createOfflineOrder = async (req, res) => {
//   try {
//     const userId = req.session.user?.id;
//     const { name, phone, crop, cart, totalAmount, paymentMethod } = req.body;

//     if (!name || !phone || !cart || !cart.length || !totalAmount || !crop || !paymentMethod) {
//       return res.status(400).json({ success: false, message: "Missing required fields" });
//     }

//     // Validate and update stock
//     for (const item of cart) {
//       const product = await Product.findById(item.productId);
//       if (!product) {
//         return res.status(404).json({ success: false, message: `Product not found: ${item.name}` });
//       }

//       const variant = product.variants.find((v) => v._id.toString() === item.variantId);
//       if (!variant) {
//         return res.status(404).json({ success: false, message: `Variant not found for ${item.name}` });
//       }

//       if (variant.stock < item.quantity) {
//         return res.status(400).json({ success: false, message: `Insufficient stock for ${item.name}` });
//       }

//       item.totalWithGST = item.price * item.quantity * (1 + (item.gst / 100 || 0));
//       variant.stock -= item.quantity;
//       await product.save();
//     }

//     const isDue = paymentMethod === "Pay Later";
//     const newOrder = new Order({
//       userId,
//       name,
//       phone,
//       address: "Offline Purchase",
//       pincode: "000000",
//       crop,
//       purchaseType: "Offline",
//       paymentMethod,
//       totalAmount,
//       status: paymentMethod === "Cash" ? "Completed" : "Pending",
//       cart,
//       isDue,
//     });

//     await newOrder.save();
//     res.status(201).json({ success: true, message: "Offline order placed successfully!", order: newOrder });
//   } catch (error) {
//     console.error("Error placing offline order:", error);
//     res.status(500).json({ success: false, message: "Internal Server Error" });
//   }
// };

// const getOrderStats = async (req, res) => {
//   try {
//     const orders = await Order.aggregate([
//       { $group: { _id: { $month: "$createdAt" }, count: { $sum: 1 } } },
//       { $sort: { "_id": 1 } },
//     ]);
//     res.status(200).json(orders.map((o) => ({ month: o._id, count: o.count })));
//   } catch (error) {
//     console.error("Error fetching order stats:", error);
//     res.status(500).json({ success: false, message: "Error fetching stats" });
//   }
// };

// const getSalesDistribution = async (req, res) => {
//   try {
//     const sales = await Order.aggregate([
//       { $group: { _id: "$purchaseType", total: { $sum: "$totalAmount" } } },
//     ]);
//     res.status(200).json(sales);
//   } catch (error) {
//     console.error("Error fetching sales distribution:", error);
//     res.status(500).json({ success: false, message: "Error fetching sales" });
//   }
// };

// const createRazorpayOrder = async (req, res) => {
//   try {
//     const { amount } = req.body; // Amount in paise
//     if (!amount || isNaN(amount)) {
//       return res.status(400).json({ success: false, message: "Invalid amount" });
//     }

//     const options = {
//       amount: parseInt(amount),
//       currency: "INR",
//       receipt: `receipt_${Date.now()}`,
//     };

//     const order = await razorpayInstance.orders.create(options);
//     console.log("Created Razorpay Order:", order);
//     res.json({ success: true, id: order.id, currency: order.currency });
//   } catch (error) {
//     console.error("Error creating Razorpay order:", error);
//     res.status(500).json({ success: false, message: "Failed to create order" });
//   }
// };

// const verifyRazorpayPayment = async (req, res) => {
//   const { razorpay_order_id, razorpay_payment_id, razorpay_signature, orderData } = req.body;
//   const userId = req.session.user?.id;

//   try {
//     if (!userId) {
//       return res.status(401).json({ success: false, message: "Unauthorized" });
//     }

//     // Verify signature
//     const secret = "oz1Nzimmw5c7tusgHbaqRRhR"; // Replace with your Razorpay Key Secret
//     const body = `${razorpay_order_id}|${razorpay_payment_id}`;
//     const generatedSignature = crypto
//       .createHmac("sha256", secret)
//       .update(body)
//       .digest("hex");

//     if (generatedSignature !== razorpay_signature) {
//       console.error("Signature mismatch:", { generatedSignature, razorpay_signature });
//       return res.status(400).json({ success: false, message: "Invalid payment signature" });
//     }

//     // Validate and update stock
//     for (const item of orderData.cart) {
//       const product = await Product.findById(item.productId);
//       if (!product) {
//         return res.status(404).json({ success: false, message: `Product not found: ${item.name}` });
//       }

//       const variant = product.variants.find((v) => v._id.toString() === item.variantId);
//       if (!variant) {
//         return res.status(404).json({ success: false, message: `Variant not found for ${item.name}` });
//       }

//       if (variant.stock < item.quantity) {
//         return res.status(400).json({ success: false, message: `Insufficient stock for ${item.name}` });
//       }

//       item.totalWithGST = item.price * item.quantity * (1 + (item.gst / 100 || 0));
//       variant.stock -= item.quantity;
//       await product.save();
//     }

//     const newOrder = new Order({
//       ...orderData,
//       userId,
//       purchaseType: "Online",
//       razorpayOrderId: razorpay_order_id,
//       razorpayPaymentId: razorpay_payment_id,
//       status: "Paid",
//     });

//     await newOrder.save();
//     res.json({ success: true, message: "Order placed successfully", order: newOrder });
//   } catch (error) {
//     console.error("Error verifying payment:", error);
//     res.status(500).json({ success: false, message: "Payment verification failed" });
//   }
// };
// // const updateOrderStatus = async (req, res) => {
// //   try {
// //     const { orderId } = req.params;
// //     const { status } = req.body;

// //     if (!orderId || !status) {
// //       return res.status(400).json({ success: false, message: "Order ID and status are required." });
// //     }

// //     const order = await Order.findById(orderId);
// //     if (!order) {
// //       return res.status(404).json({ success: false, message: "Order not found." });
// //     }

// //     order.status = status;
// //     await order.save();

// //     res.status(200).json({ success: true, message: "Order status updated successfully!", order });
// //   } catch (error) {
// //     console.error("Error updating order status:", error);
// //     res.status(500).json({ success: false, message: "Internal Server Error" });
// //   }
// // };
// const updateOrderStatus = async (req, res) => {
//   try {
//     const { orderId } = req.params;
//     const { status } = req.body;
//     const userId = req.session.user?.id;

//     if (!orderId || !status) {
//       return res.status(400).json({ success: false, message: "Order ID and status are required." });
//     }

//     const validStatuses = ["Pending", "Paid", "Shipped", "Completed", "Cancelled"];
//     if (!validStatuses.includes(status)) {
//       return res.status(400).json({ success: false, message: "Invalid status." });
//     }

//     const order = await Order.findById(orderId);
//     if (!order) {
//       return res.status(404).json({ success: false, message: "Order not found." });
//     }

//     order.status = status;
//     order.statusHistory.push({ status, updatedBy: userId });
//     if (status === "Paid" || status === "Completed") order.isDue = false;
//     await order.save();

//     res.status(200).json({ success: true, message: "Order status updated successfully!", order });
//   } catch (error) {
//     console.error("Error updating order status:", error);
//     res.status(500).json({ success: false, message: "Internal Server Error" });
//   }
// };

// module.exports = {
//   placeOrder,
//   getMyOrders,
//   getAllOrders,
//   getOrdersByCustomerMobile,
//   getMyBills,
//   createOfflineOrder,
//   getOrderStats,
//   getSalesDistribution,
//   createRazorpayOrder,
//   verifyRazorpayPayment,
//   updateOrderStatus,
// };
// const User = require("../models/User");
// const Order = require("../models/Order");
// const Product = require("../models/Product");
// const Razorpay = require("razorpay");
// const crypto = require("crypto");

// const razorpayInstance = new Razorpay({
//   key_id: "rzp_test_fwA1F6rg7iQI8x",
//   key_secret: "oz1Nzimmw5c7tusgHbaqRRhR",
// });

// const placeOrder = async (req, res) => {
//   try {
//     const userId = req.session.user?.id;
//     if (!userId) {
//       return res.status(401).json({ success: false, message: "Unauthorized. Please log in." });
//     }

//     const { name, phone, address, pincode, crop, paymentMethod, totalAmount, cart } = req.body;

//     if (!name || !phone || !address || !pincode || !crop || !paymentMethod || !totalAmount || !cart || !cart.length) {
//       return res.status(400).json({ success: false, message: "All fields are required." });
//     }

//     for (const item of cart) {
//       const product = await Product.findById(item.productId);
//       if (!product) {
//         return res.status(404).json({ success: false, message: `Product not found: ${item.name}` });
//       }

//       const variant = product.variants.find((v) => v._id.toString() === item.variantId);
//       if (!variant) {
//         return res.status(404).json({ success: false, message: `Variant not found for ${item.name}` });
//       }

//       if (variant.stock < item.quantity) {
//         return res.status(400).json({ success: false, message: `Insufficient stock for ${item.name}` });
//       }

//       item.totalWithGST = item.price * item.quantity * (1 + (item.gst / 100 || 0));
//       variant.stock -= item.quantity;
//       await product.save();
//     }

//     const isDue = paymentMethod === "Pay Later";
//     const newOrder = new Order({
//       userId,
//       name,
//       phone,
//       address,
//       pincode,
//       crop,
//       purchaseType: "Online",
//       paymentMethod,
//       totalAmount,
//       cart,
//       isDue,
//       status: paymentMethod === "Cash" ? "Completed" : "Pending",
//     });

//     await newOrder.save();
//     res.status(201).json({ success: true, message: "Order placed successfully!", order: newOrder });
//   } catch (error) {
//     console.error("Error placing order:", error);
//     res.status(500).json({ success: false, message: "Internal Server Error" });
//   }
// };

// const getMyOrders = async (req, res) => {
//   try {
//     const userId = req.session.user?.id;
//     if (!userId) {
//       return res.status(401).json({ success: false, message: "Unauthorized. Please log in." });
//     }
//     const orders = await Order.find({ userId })
//       .populate("cart.productId", "name images")
//       .sort({ createdAt: -1 });
//     res.status(200).json({ success: true, orders });
//   } catch (error) {
//     console.error("Error fetching orders:", error);
//     res.status(500).json({ success: false, message: "Internal Server Error" });
//   }
// };

// const getAllOrders = async (req, res) => {
//   try {
//     const orders = await Order.find()
//       .populate("userId", "firstName email")
//       .sort({ createdAt: -1 });
//     res.status(200).json({ success: true, orders });
//   } catch (error) {
//     console.error("Error fetching all orders:", error);
//     res.status(500).json({ success: false, message: "Failed to fetch orders" });
//   }
// };

// // const getOrdersByCustomerMobile = async (req, res) => {
// //   try {
// //     const { mobile } = req.params;
// //     if (!mobile) {
// //       return res.status(400).json({ success: false, message: "Mobile number is required" });
// //     }

// //     const orders = await Order.find({ phone: mobile })
// //       .populate("cart.productId", "name")
// //       .sort({ createdAt: -1 });

// //     const totalDues = orders
// //       .filter((order) => order.isDue)
// //       .reduce((sum, order) => sum + order.totalAmount, 0);

// //     res.status(200).json({ success: true, orders, totalDues });
// //   } catch (error) {
// //     console.error("Error fetching customer orders:", error);
// //     res.status(500).json({ success: false, message: "Internal Server Error" });
// //   }
// // };
// const getOrdersByCustomerMobile = async (req, res) => {
//   try {
//     const { mobile } = req.params;
//     if (!mobile) {
//       return res.status(400).json({ success: false, message: "Mobile number is required" });
//     }

//     const orders = await Order.find({ phone: mobile })
//       .populate("cart.productId", "name")
//       .sort({ createdAt: -1 });

//     const totalDues = orders
//       .filter((order) => order.isDue)
//       .reduce((sum, order) => sum + order.totalAmount, 0);

//     res.status(200).json({ success: true, orders, totalDues });
//   } catch (error) {
//     console.error("Error fetching customer orders:", error);
//     res.status(500).json({ success: false, message: "Internal Server Error" });
//   }
// };

// const getMyBills = async (req, res) => {
//   try {
//     const userId = req.session.user?.id;
//     if (!userId) {
//       return res.status(401).json({ success: false, message: "Unauthorized" });
//     }

//     const orders = await Order.find({ userId }).sort({ createdAt: -1 });
//     res.json({ success: true, orders });
//   } catch (error) {
//     console.error("Error fetching bills:", error);
//     res.status(500).json({ success: false, message: "Server error" });
//   }
// };

// const createOfflineOrder = async (req, res) => {
//   try {
//     const userId = req.session.user?.id;
//     const { name, phone, crop, cart, totalAmount, paymentMethod } = req.body;

//     if (!name || !phone || !cart || !cart.length || !totalAmount || !crop || !paymentMethod) {
//       return res.status(400).json({ success: false, message: "Missing required fields" });
//     }

//     for (const item of cart) {
//       const product = await Product.findById(item.productId);
//       if (!product) {
//         return res.status(404).json({ success: false, message: `Product not found: ${item.name}` });
//       }

//       const variant = product.variants.find((v) => v._id.toString() === item.variantId);
//       if (!variant) {
//         return res.status(404).json({ success: false, message: `Variant not found for ${item.name}` });
//       }

//       if (variant.stock < item.quantity) {
//         return res.status(400).json({ success: false, message: `Insufficient stock for ${item.name}` });
//       }

//       item.totalWithGST = item.price * item.quantity * (1 + (item.gst / 100 || 0));
//       variant.stock -= item.quantity;
//       await product.save();
//     }

//     const isDue = paymentMethod === "Pay Later";
//     const newOrder = new Order({
//       userId,
//       name,
//       phone,
//       address: "Offline Purchase",
//       pincode: "000000",
//       crop,
//       purchaseType: "Offline",
//       paymentMethod,
//       totalAmount,
//       status: paymentMethod === "Cash" ? "Completed" : "Pending",
//       cart,
//       isDue,
//     });

//     await newOrder.save();
//     res.status(201).json({ success: true, message: "Offline order placed successfully!", order: newOrder });
//   } catch (error) {
//     console.error("Error placing offline order:", error);
//     res.status(500).json({ success: false, message: "Internal Server Error" });
//   }
// };

// const getOrderStats = async (req, res) => {
//   try {
//     const orders = await Order.aggregate([
//       { $group: { _id: { $month: "$createdAt" }, count: { $sum: 1 } } },
//       { $sort: { "_id": 1 } },
//     ]);
//     res.status(200).json(orders.map((o) => ({ month: o._id, count: o.count })));
//   } catch (error) {
//     console.error("Error fetching order stats:", error);
//     res.status(500).json({ success: false, message: "Error fetching stats" });
//   }
// };

// const getSalesDistribution = async (req, res) => {
//   try {
//     const sales = await Order.aggregate([
//       { $group: { _id: "$purchaseType", total: { $sum: "$totalAmount" } } },
//     ]);
//     res.status(200).json(sales);
//   } catch (error) {
//     console.error("Error fetching sales distribution:", error);
//     res.status(500).json({ success: false, message: "Error fetching sales" });
//   }
// };

// const createRazorpayOrder = async (req, res) => {
//   try {
//     const { amount } = req.body;
//     if (!amount || isNaN(amount)) {
//       return res.status(400).json({ success: false, message: "Invalid amount" });
//     }

//     const options = {
//       amount: parseInt(amount),
//       currency: "INR",
//       receipt: `receipt_${Date.now()}`,
//     };

//     const order = await razorpayInstance.orders.create(options);
//     res.json({ success: true, id: order.id, currency: order.currency });
//   } catch (error) {
//     console.error("Error creating Razorpay order:", error);
//     res.status(500).json({ success: false, message: "Failed to create order" });
//   }
// };

// const verifyRazorpayPayment = async (req, res) => {
//   const { razorpay_order_id, razorpay_payment_id, razorpay_signature, orderData } = req.body;
//   const userId = req.session.user?.id;

//   try {
//     if (!userId) {
//       return res.status(401).json({ success: false, message: "Unauthorized" });
//     }

//     const secret = "oz1Nzimmw5c7tusgHbaqRRhR";
//     const body = `${razorpay_order_id}|${razorpay_payment_id}`;
//     const generatedSignature = crypto
//       .createHmac("sha256", secret)
//       .update(body)
//       .digest("hex");

//     if (generatedSignature !== razorpay_signature) {
//       console.error("Signature mismatch:", { generatedSignature, razorpay_signature });
//       return res.status(400).json({ success: false, message: "Invalid payment signature" });
//     }

//     for (const item of orderData.cart) {
//       const product = await Product.findById(item.productId);
//       if (!product) {
//         return res.status(404).json({ success: false, message: `Product not found: ${item.name}` });
//       }

//       const variant = product.variants.find((v) => v._id.toString() === item.variantId);
//       if (!variant) {
//         return res.status(404).json({ success: false, message: `Variant not found for ${item.name}` });
//       }

//       if (variant.stock < item.quantity) {
//         return res.status(400).json({ success: false, message: `Insufficient stock for ${item.name}` });
//       }

//       item.totalWithGST = item.price * item.quantity * (1 + (item.gst / 100 || 0));
//       variant.stock -= item.quantity;
//       await product.save();
//     }

//     const newOrder = new Order({
//       ...orderData,
//       userId,
//       purchaseType: "Online",
//       razorpayOrderId: razorpay_order_id,
//       razorpayPaymentId: razorpay_payment_id,
//       status: "Paid",
//     });

//     await newOrder.save();
//     res.json({ success: true, message: "Order placed successfully", order: newOrder });
//   } catch (error) {
//     console.error("Error verifying payment:", error);
//     res.status(500).json({ success: false, message: "Payment verification failed" });
//   }
// };

// const updateOrderStatus = async (req, res) => {
//   try {
//     const { orderId } = req.params;
//     const { status } = req.body;
//     const userId = req.session.user?.id;

//     if (!orderId || !status) {
//       return res.status(400).json({ success: false, message: "Order ID and status are required." });
//     }

//     const validStatuses = ["Pending", "Paid", "Shipped", "Completed", "Cancelled"];
//     if (!validStatuses.includes(status)) {
//       return res.status(400).json({ success: false, message: "Invalid status." });
//     }

//     const order = await Order.findById(orderId);
//     if (!order) {
//       return res.status(404).json({ success: false, message: "Order not found." });
//     }

//     order.status = status;
//     if (status === "Paid" || status === "Completed") {
//       order.isDue = false;
//       if (status === "Paid" && order.isDue) {
//         order.duesPaidDate = new Date(); // Set dues paid date when status changes to Paid and was due
//       }
//     }
//     order.statusHistory.push({ status, updatedBy: userId });
//     await order.save();

//     res.status(200).json({ success: true, message: "Order status updated successfully!", order });
//   } catch (error) {
//     console.error("Error updating order status:", error);
//     res.status(500).json({ success: false, message: "Internal Server Error" });
//   }
// };

// const payDues = async (req, res) => {
//   try {
//     const { orderId } = req.params;
//     const userId = req.session.user?.id;

//     if (!orderId) {
//       return res.status(400).json({ success: false, message: "Order ID is required." });
//     }

//     const order = await Order.findById(orderId);
//     if (!order) {
//       return res.status(404).json({ success: false, message: "Order not found." });
//     }

//     if (!order.isDue) {
//       return res.status(400).json({ success: false, message: "No dues to pay for this order." });
//     }

//     order.status = "Paid";
//     order.isDue = false;
//     order.duesPaidDate = new Date(); // Set the dues paid date
//     order.statusHistory.push({ status: "Paid", updatedBy: userId });

//     await order.save();
//     res.status(200).json({ success: true, message: "Dues paid successfully!", order });
//   } catch (error) {
//     console.error("Error paying dues:", error);
//     res.status(500).json({ success: false, message: "Internal Server Error" });
//   }
// };

// module.exports = {
//   placeOrder,
//   getMyOrders,
//   getAllOrders,
//   getOrdersByCustomerMobile,
//   getMyBills,
//   createOfflineOrder,
//   getOrderStats,
//   getSalesDistribution,
//   createRazorpayOrder,
//   verifyRazorpayPayment,
//   updateOrderStatus,
//   payDues, // Added new function
// };
// const User = require("../models/User");
// const Order = require("../models/Order");
// const Product = require("../models/Product");
// const Razorpay = require("razorpay");
// const crypto = require("crypto");

// const razorpayInstance = new Razorpay({
//   key_id: "rzp_test_fwA1F6rg7iQI8x",
//   key_secret: "oz1Nzimmw5c7tusgHbaqRRhR",
// });

// const placeOrder = async (req, res) => {
//   try {
//     const userId = req.session.user?.id;
//     if (!userId) {
//       return res.status(401).json({ success: false, message: "Unauthorized. Please log in." });
//     }

//     const { name, phone, address, pincode, crop, paymentMethod, totalAmount, cart } = req.body;

//     if (!name || !phone || !address || !pincode || !crop || !paymentMethod || !totalAmount || !cart || !cart.length) {
//       return res.status(400).json({ success: false, message: "All fields are required." });
//     }

//     for (const item of cart) {
//       const product = await Product.findById(item.productId);
//       if (!product) {
//         return res.status(404).json({ success: false, message: `Product not found: ${item.name}` });
//       }

//       const variant = product.variants.id(item.variantId);
//       if (!variant) {
//         return res.status(404).json({ success: false, message: `Variant not found for ${item.name}` });
//       }

//       const batch = variant.batches.id(item.batchId);
//       if (!batch) {
//         return res.status(404).json({ success: false, message: `Batch not found for ${item.name}` });
//       }

//       if (batch.stock < item.quantity) {
//         return res.status(400).json({ success: false, message: `Insufficient stock for ${item.name} (Batch: ${batch.batchNumber})` });
//       }

//       batch.stock -= item.quantity;
//       item.totalWithGST = item.price * item.quantity * (1 + (item.gst / 100 || 0));
//       await product.save();
//     }

//     const isDue = paymentMethod === "Pay Later";
//     const newOrder = new Order({
//       userId,
//       name,
//       phone,
//       address,
//       pincode,
//       crop,
//       purchaseType: "Online",
//       paymentMethod,
//       totalAmount,
//       cart,
//       isDue,
//       status: paymentMethod === "Cash" ? "Completed" : "Pending",
//     });

//     await newOrder.save();
//     res.status(201).json({ success: true, message: "Order placed successfully!", order: newOrder });
//   } catch (error) {
//     console.error("Error placing order:", error);
//     res.status(500).json({ success: false, message: "Internal Server Error" });
//   }
// };
// const createOfflineOrder = async (req, res) => {
//   try {
//     const userId = req.session.user?.id;
//     const { name, phone, crop, cart, totalAmount, paymentMethod } = req.body;

//     if (!name || !phone || !cart || !cart.length || !totalAmount || !crop || !paymentMethod) {
//       return res.status(400).json({ success: false, message: "Missing required fields" });
//     }

//     // Validate and update stock for each item
//     for (const item of cart) {
//       const product = await Product.findById(item.productId);
//       if (!product) {
//         return res.status(404).json({ success: false, message: `Product not found: ${item.name}` });
//       }

//       const variant = product.variants.id(item.variantId);
//       if (!variant) {
//         return res.status(404).json({ success: false, message: `Variant not found for ${item.name}` });
//       }

//       const batch = variant.batches.id(item.batchId);
//       if (!batch) {
//         return res.status(404).json({ success: false, message: `Batch not found for ${item.name}` });
//       }

//       if (batch.stock < item.quantity) {
//         return res.status(400).json({ success: false, message: `Insufficient stock for ${item.name} (Batch: ${batch.batchNumber})` });
//       }

//       // Update stock and calculate total with GST
//       batch.stock -= item.quantity;
//       item.totalWithGST = item.price * item.quantity * (1 + (item.gst / 100 || 0));
//       await product.save();
//     }

//     const isDue = paymentMethod === "Pay Later";
//     const newOrder = new Order({
//       userId,
//       name,
//       phone,
//       address: "Offline Purchase",
//       pincode: "000000",
//       crop,
//       purchaseType: "Offline",
//       paymentMethod,
//       totalAmount,
//       status: paymentMethod === "Cash" ? "Completed" : "Pending",
//       cart,
//       isDue,
//     });

//     await newOrder.save();
//     res.status(201).json({ success: true, message: "Offline order placed successfully!", order: newOrder });
//   } catch (error) {
//     console.error("Error placing offline order:", error);
//     res.status(500).json({ success: false, message: "Internal Server Error" });
//   }
// };

// const verifyRazorpayPayment = async (req, res) => {
//   const { razorpay_order_id, razorpay_payment_id, razorpay_signature, orderData } = req.body;
//   const userId = req.session.user?.id;

//   try {
//     if (!userId) {
//       return res.status(401).json({ success: false, message: "Unauthorized" });
//     }

//     const secret = "oz1Nzimmw5c7tusgHbaqRRhR";
//     const body = `${razorpay_order_id}|${razorpay_payment_id}`;
//     const generatedSignature = crypto.createHmac("sha256", secret).update(body).digest("hex");

//     if (generatedSignature !== razorpay_signature) {
//       console.error("Signature mismatch:", { generatedSignature, razorpay_signature });
//       return res.status(400).json({ success: false, message: "Invalid payment signature" });
//     }

//     // Validate and update stock for each item
//     for (const item of orderData.cart) {
//       const product = await Product.findById(item.productId);
//       if (!product) {
//         return res.status(404).json({ success: false, message: `Product not found: ${item.name}` });
//       }

//       const variant = product.variants.id(item.variantId);
//       if (!variant) {
//         return res.status(404).json({ success: false, message: `Variant not found for ${item.name}` });
//       }

//       const batch = variant.batches.id(item.batchId);
//       if (!batch) {
//         return res.status(404).json({ success: false, message: `Batch not found for ${item.name}` });
//       }

//       if (batch.stock < item.quantity) {
//         return res.status(400).json({ success: false, message: `Insufficient stock for ${item.name} (Batch: ${batch.batchNumber})` });
//       }

//       // Update stock and calculate total with GST
//       batch.stock -= item.quantity;
//       item.totalWithGST = item.price * item.quantity * (1 + (item.gst / 100 || 0));
//       await product.save();
//     }

//     const newOrder = new Order({
//       ...orderData,
//       userId,
//       purchaseType: "Online",
//       razorpayOrderId: razorpay_order_id,
//       razorpayPaymentId: razorpay_payment_id,
//       status: "Paid",
//     });

//     await newOrder.save();
//     res.json({ success: true, message: "Order placed successfully", order: newOrder });
//   } catch (error) {
//     console.error("Error verifying payment:", error);
//     res.status(500).json({ success: false, message: "Payment verification failed" });
//   }
// };

// // Other functions remain unchanged unless additional functionality is needed
// const getMyOrders = async (req, res) => {
//   try {
//     const userId = req.session.user?.id;
//     if (!userId) {
//       return res.status(401).json({ success: false, message: "Unauthorized. Please log in." });
//     }
//     const orders = await Order.find({ userId })
//       .populate("cart.productId", "name images")
//       .sort({ createdAt: -1 });
//     res.status(200).json({ success: true, orders });
//   } catch (error) {
//     console.error("Error fetching orders:", error);
//     res.status(500).json({ success: false, message: "Internal Server Error" });
//   }
// };

// const getAllOrders = async (req, res) => {
//   try {
//     const orders = await Order.find()
//       .populate("userId", "firstName email")
//       .sort({ createdAt: -1 });
//     res.status(200).json({ success: true, orders });
//   } catch (error) {
//     console.error("Error fetching all orders:", error);
//     res.status(500).json({ success: false, message: "Failed to fetch orders" });
//   }
// };

// const getOrdersByCustomerMobile = async (req, res) => {
//   try {
//     const { mobile } = req.params;
//     if (!mobile) {
//       return res.status(400).json({ success: false, message: "Mobile number is required" });
//     }

//     const orders = await Order.find({ phone: mobile })
//       .populate("cart.productId", "name")
//       .sort({ createdAt: -1 });

//     const totalDues = orders
//       .filter((order) => order.isDue)
//       .reduce((sum, order) => sum + order.totalAmount, 0);

//     res.status(200).json({ success: true, orders, totalDues });
//   } catch (error) {
//     console.error("Error fetching customer orders:", error);
//     res.status(500).json({ success: false, message: "Internal Server Error" });
//   }
// };

// const getMyBills = async (req, res) => {
//   try {
//     const userId = req.session.user?.id;
//     if (!userId) {
//       return res.status(401).json({ success: false, message: "Unauthorized" });
//     }

//     const orders = await Order.find({ userId }).sort({ createdAt: -1 });
//     res.json({ success: true, orders });
//   } catch (error) {
//     console.error("Error fetching bills:", error);
//     res.status(500).json({ success: false, message: "Server error" });
//   }
// };

// const getOrderStats = async (req, res) => {
//   try {
//     const orders = await Order.aggregate([
//       { $group: { _id: { $month: "$createdAt" }, count: { $sum: 1 } } },
//       { $sort: { "_id": 1 } },
//     ]);
//     res.status(200).json(orders.map((o) => ({ month: o._id, count: o.count })));
//   } catch (error) {
//     console.error("Error fetching order stats:", error);
//     res.status(500).json({ success: false, message: "Error fetching stats" });
//   }
// };

// const getSalesDistribution = async (req, res) => {
//   try {
//     const sales = await Order.aggregate([
//       { $group: { _id: "$purchaseType", total: { $sum: "$totalAmount" } } },
//     ]);
//     res.status(200).json(sales);
//   } catch (error) {
//     console.error("Error fetching sales distribution:", error);
//     res.status(500).json({ success: false, message: "Error fetching sales" });
//   }
// };

// const createRazorpayOrder = async (req, res) => {
//   try {
//     const { amount } = req.body;
//     if (!amount || isNaN(amount)) {
//       return res.status(400).json({ success: false, message: "Invalid amount" });
//     }

//     const options = {
//       amount: parseInt(amount),
//       currency: "INR",
//       receipt: `receipt_${Date.now()}`,
//     };

//     const order = await razorpayInstance.orders.create(options);
//     res.json({ success: true, id: order.id, currency: order.currency });
//   } catch (error) {
//     console.error("Error creating Razorpay order:", error);
//     res.status(500).json({ success: false, message: "Failed to create order" });
//   }
// };

// const updateOrderStatus = async (req, res) => {
//   try {
//     const { orderId } = req.params;
//     const { status } = req.body;
//     const userId = req.session.user?.id;

//     if (!orderId || !status) {
//       return res.status(400).json({ success: false, message: "Order ID and status are required." });
//     }

//     const validStatuses = ["Pending", "Paid", "Shipped", "Completed", "Cancelled"];
//     if (!validStatuses.includes(status)) {
//       return res.status(400).json({ success: false, message: "Invalid status." });
//     }

//     const order = await Order.findById(orderId);
//     if (!order) {
//       return res.status(404).json({ success: false, message: "Order not found." });
//     }

//     order.status = status;
//     if (status === "Paid" || status === "Completed") {
//       order.isDue = false;
//       if (status === "Paid" && order.isDue) {
//         order.duesPaidDate = new Date();
//       }
//     }
//     order.statusHistory.push({ status, updatedBy: userId });
//     await order.save();

//     res.status(200).json({ success: true, message: "Order status updated successfully!", order });
//   } catch (error) {
//     console.error("Error updating order status:", error);
//     res.status(500).json({ success: false, message: "Internal Server Error" });
//   }
// };

// const payDues = async (req, res) => {
//   try {
//     const { orderId } = req.params;
//     const userId = req.session.user?.id;

//     if (!orderId) {
//       return res.status(400).json({ success: false, message: "Order ID is required." });
//     }

//     const order = await Order.findById(orderId);
//     if (!order) {
//       return res.status(404).json({ success: false, message: "Order not found." });
//     }

//     if (!order.isDue) {
//       return res.status(400).json({ success: false, message: "No dues to pay for this order." });
//     }

//     order.status = "Paid";
//     order.isDue = false;
//     order.duesPaidDate = new Date();
//     order.statusHistory.push({ status: "Paid", updatedBy: userId });

//     await order.save();
//     res.status(200).json({ success: true, message: "Dues paid successfully!", order });
//   } catch (error) {
//     console.error("Error paying dues:", error);
//     res.status(500).json({ success: false, message: "Internal Server Error" });
//   }
// };

// module.exports = {
//   placeOrder,
//   getMyOrders,
//   getAllOrders,
//   getOrdersByCustomerMobile,
//   getMyBills,
//   createOfflineOrder,
//   getOrderStats,
//   getSalesDistribution,
//   createRazorpayOrder,
//   verifyRazorpayPayment,
//   updateOrderStatus,
//   payDues,
// };
const User = require("../models/User");
const Order = require("../models/Order");
const Product = require("../models/Product");
const Razorpay = require("razorpay");
const crypto = require("crypto");

const razorpayInstance = new Razorpay({
  key_id: "rzp_test_fwA1F6rg7iQI8x",
  key_secret: "oz1Nzimmw5c7tusgHbaqRRhR",
});

const placeOrder = async (req, res) => {
  try {
    const userId = req.session.user?.id;
    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized. Please log in." });
    }

    const { name, phone, address, pincode, crop, paymentMethod, totalAmount, cart } = req.body;

    if (!name || !phone || !address || !pincode || !crop || !paymentMethod || !totalAmount || !cart || !cart.length) {
      return res.status(400).json({ success: false, message: "All fields are required." });
    }

    // Validate and update stock for each item
    for (const item of cart) {
      const product = await Product.findById(item.productId);
      if (!product) {
        return res.status(404).json({ success: false, message: `Product not found: ${item.name}` });
      }

      const variant = product.variants.id(item.variantId);
      if (!variant) {
        return res.status(404).json({ success: false, message: `Variant not found for ${item.name}` });
      }

      const batch = variant.batches.id(item.batchId);
      if (!batch) {
        return res.status(404).json({ success: false, message: `Batch not found for ${item.name}` });
      }

      if (batch.stock < item.quantity) {
        return res.status(400).json({ success: false, message: `Insufficient stock for ${item.name} (Batch: ${batch.batchNumber})` });
      }

      // Update stock and ensure totalWithGST matches frontend calculation
      batch.stock -= item.quantity;
      const calculatedTotalWithGST = item.price * item.quantity * (1 + (item.gst / 100 || 0));
      if (Math.abs(calculatedTotalWithGST - item.totalWithGST) > 0.01) {
        console.warn(`TotalWithGST mismatch for ${item.name}: Expected ${calculatedTotalWithGST}, Received ${item.totalWithGST}`);
        item.totalWithGST = calculatedTotalWithGST; // Correct it server-side
      }
      await product.save();
    }

    const isDue = paymentMethod === "Pay Later";
    const newOrder = new Order({
      userId,
      name,
      phone,
      address,
      pincode,
      crop,
      purchaseType: "Online",
      paymentMethod,
      totalAmount: parseFloat(totalAmount),
      cart,
      isDue,
      status: paymentMethod === "Cash" ? "Completed" : "Pending",
      statusHistory: [{ status: paymentMethod === "Cash" ? "Completed" : "Pending", timestamp: new Date(), updatedBy: userId }],
    });

    await newOrder.save();
    console.log("Order placed successfully:", newOrder._id);
    res.status(201).json({ success: true, message: "Order placed successfully!", order: newOrder });
  } catch (error) {
    console.error("Error placing order:", error.stack);
    res.status(500).json({ success: false, message: "Internal Server Error", error: error.message });
  }
};
// const createOfflineOrder = async (req, res) => {
//   try {
//     const userId = req.session.user?.id;
//     const { name, phone, address, pincode, referenceName, remarks, crop, cart, totalAmount, paymentMethod } = req.body;

//     if (!name || !phone || !address || !pincode || !cart || !cart.length || !totalAmount || !crop || !paymentMethod) {
//       return res.status(400).json({ success: false, message: "Missing required fields" });
//     }

//     // Validate and update stock
//     for (const item of cart) {
//       const product = await Product.findById(item.productId);
//       if (!product) {
//         return res.status(404).json({ success: false, message: `Product not found: ${item.name}` });
//       }

//       const variant = product.variants.id(item.variantId);
//       if (!variant) {
//         return res.status(404).json({ success: false, message: `Variant not found for ${item.name}` });
//       }

//       const batch = variant.batches.id(item.batchId);
//       if (!batch) {
//         return res.status(404).json({ success: false, message: `Batch not found for ${item.name}` });
//       }

//       if (batch.stock < item.quantity) {
//         return res.status(400).json({ success: false, message: `Insufficient stock for ${item.name} (Batch: ${batch.batchNumber})` });
//       }

//       batch.stock -= item.quantity;
//       const calculatedTotalWithGST = item.price * item.quantity * (1 + (item.gst / 100 || 0));
//       if (Math.abs(calculatedTotalWithGST - item.totalWithGST) > 0.01) {
//         console.warn(`TotalWithGST mismatch for ${item.name}: Expected ${calculatedTotalWithGST}, Received ${item.totalWithGST}`);
//         item.totalWithGST = calculatedTotalWithGST;
//       }
//       await product.save();
//     }

//     const isDue = paymentMethod === "Pay Later";
//     const newOrder = new Order({
//       userId,
//       name,
//       phone,
//       address,
//       pincode,
//       referenceName,
//       remarks,
//       crop,
//       purchaseType: "Offline",
//       paymentMethod,
//       totalAmount: parseFloat(totalAmount),
//       cart,
//       isDue,
//       status: paymentMethod === "Cash" ? "Completed" : "Pending",
//       statusHistory: [{ status: paymentMethod === "Cash" ? "Completed" : "Pending", timestamp: new Date(), updatedBy: userId }],
//     });

//     await newOrder.save();
//     console.log("Offline order placed successfully:", newOrder._id);
//     res.status(201).json({ success: true, message: "Offline order placed successfully!", order: newOrder });
//   } catch (error) {
//     console.error("Error placing offline order:", error.stack);
//     res.status(500).json({ success: false, message: "Internal Server Error", error: error.message });
//   }
// };

// Get Customer Details by Phone Number
// const getCustomerDetailsByPhone = async (req, res) => {
//   try {
//     const { phone } = req.params;
//     const latestOrder = await Order.findOne({ phone, purchaseType: "Online" })
//       .sort({ createdAt: -1 }) // Get the most recent online order
//       .select("name phone address pincode crop");

//     if (!latestOrder) {
//       return res.status(404).json({ success: false, message: "No previous online order found for this phone number" });
//     }

//     res.status(200).json(latestOrder);
//   } catch (error) {
//     console.error("Error fetching customer details:", error);
//     res.status(500).json({ success: false, message: "Internal Server Error", error: error.message });
//   }
// };
// const getCustomerDetailsByPhone = async (req, res) => {
//   const { phoneNumber } = req.params;

//   try { 
//     // Validate phone number (10 digits)
//     if (!/^\d{10}$/.test(phoneNumber)) {
//       return res.status(400).json({ success: false, message: "Phone number must be 10 digits" });
//     }

//     // Check if admin is authenticated (assuming session-based auth like in createOfflineOrder)
//     if (!req.session.user || req.session.user.role !== "admin") {
//       return res.status(403).json({ success: false, message: "Not authorized" });
//     }

//     // Find the most recent order for the phone number
//     const order = await Order.findOne({ phone: phoneNumber })
//       .sort({ createdAt: -1 }) // Latest order first
//       .select("name phone address pincode referenceName crop remarks"); // Include remarks as per your schema

//     if (!order) {
//       return res.status(404).json({ success: false, message: "No previous order found for this phone number" });
//     }

//     // Return customer details
//     res.status(200).json({
//       success: true,
//       data: {
//         name: order.name,
//         phone: order.phone,
//         address: order.address,
//         pincode: order.pincode,
//         referenceName: order.referenceName || "",
//         crop: order.crop,
//         remarks: order.remarks || "", // Include remarks if needed in frontend
//       },
//     });
//   } catch (error) {
//     console.error("Error fetching customer details:", error.stack);
//     res.status(500).json({ success: false, message: "Internal Server Error", error: error.message });
//   }
// };
const getCustomerDetailsByPhone = async (req, res) => {
  const { phoneNumber } = req.params;
  try {
    if (!/^\d{10}$/.test(phoneNumber)) {
      return res.status(400).json({ success: false, message: "Phone number must be 10 digits" });
    }
    if (!req.session.user || req.session.user.role !== "admin") {
      return res.status(403).json({ success: false, message: "Not authorized" });
    }
    const order = await Order.findOne({ phone: phoneNumber })
      .sort({ createdAt: -1 })
      .select("name phone address pincode referenceName crop remarks");
    if (!order) {
      return res.status(404).json({ success: false, message: "No previous order found for this phone number" });
    }
    res.status(200).json({
      success: true,
      data: {
        name: order.name,
        phone: order.phone,
        address: order.address,
        pincode: order.pincode,
        referenceName: order.referenceName || "",
        crop: order.crop,
        remarks: order.remarks || "",
      },
    });
  } catch (error) {
    console.error("Error fetching customer details:", error.stack);
    res.status(500).json({ success: false, message: "Internal Server Error", error: error.message });
  }
};
// Optional: Controller to create an offline order (for completeness)
const createOfflineOrder = async (req, res) => {
  try {
    const userId = req.session.user?.id;
    const { name, phone, address, pincode, referenceName, remarks, crop, cart, totalAmount, paymentMethod } = req.body;

    if (!name || !phone || !address || !pincode || !cart || !cart.length || !totalAmount || !crop || !paymentMethod) {
      return res.status(400).json({ success: false, message: "Missing required fields" });
    }

    // Validate and update stock
    for (const item of cart) {
      const product = await Product.findById(item.productId);
      if (!product) {
        return res.status(404).json({ success: false, message: `Product not found: ${item.name}` });
      }

      const variant = product.variants.id(item.variantId);
      if (!variant) {
        return res.status(404).json({ success: false, message: `Variant not found for ${item.name}` });
      }

      const batch = variant.batches.id(item.batchId);
      if (!batch) {
        return res.status(404).json({ success: false, message: `Batch not found for ${item.name}` });
      }

      if (batch.stock < item.quantity) {
        return res.status(400).json({ success: false, message: `Insufficient stock for ${item.name} (Batch: ${batch.batchNumber})` });
      }

      batch.stock -= item.quantity;
      const calculatedTotalWithGST = item.price * item.quantity * (1 + (item.gst / 100 || 0));
      if (Math.abs(calculatedTotalWithGST - item.totalWithGST) > 0.01) {
        console.warn(`TotalWithGST mismatch for ${item.name}: Expected ${calculatedTotalWithGST}, Received ${item.totalWithGST}`);
        item.totalWithGST = calculatedTotalWithGST;
      }
      await product.save();
    }

    const isDue = paymentMethod === "Pay Later";
    const newOrder = new Order({
      userId,
      name,
      phone,
      address,
      pincode,
      referenceName,
      remarks,
      crop,
      purchaseType: "Offline",
      paymentMethod,
      totalAmount: parseFloat(totalAmount),
      cart,
      isDue,
      status: paymentMethod === "Cash" ? "Completed" : "Pending",
      statusHistory: [{ status: paymentMethod === "Cash" ? "Completed" : "Pending", timestamp: new Date(), updatedBy: userId }],
    });

    await newOrder.save();
    console.log("Offline order placed successfully:", newOrder._id);
    res.status(201).json({ success: true, message: "Offline order placed successfully!", order: newOrder });
  } catch (error) {
    console.error("Error placing offline order:", error.stack);
    res.status(500).json({ success: false, message: "Internal Server Error", error: error.message });
  }
};
const verifyRazorpayPayment = async (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature, orderData } = req.body;
  const userId = req.session.user?.id;

  try {
    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const secret = "oz1Nzimmw5c7tusgHbaqRRhR";
    const body = `${razorpay_order_id}|${razorpay_payment_id}`;
    const generatedSignature = crypto.createHmac("sha256", secret).update(body).digest("hex");

    if (generatedSignature !== razorpay_signature) {
      console.error("Signature mismatch:", { generatedSignature, razorpay_signature });
      return res.status(400).json({ success: false, message: "Invalid payment signature" });
    }

    // Validate and update stock
    for (const item of orderData.cart) {
      const product = await Product.findById(item.productId);
      if (!product) {
        return res.status(404).json({ success: false, message: `Product not found: ${item.name}` });
      }

      const variant = product.variants.id(item.variantId);
      if (!variant) {
        return res.status(404).json({ success: false, message: `Variant not found for ${item.name}` });
      }

      const batch = variant.batches.id(item.batchId);
      if (!batch) {
        return res.status(404).json({ success: false, message: `Batch not found for ${item.name}` });
      }

      if (batch.stock < item.quantity) {
        return res.status(400).json({ success: false, message: `Insufficient stock for ${item.name} (Batch: ${batch.batchNumber})` });
      }

      batch.stock -= item.quantity;
      const calculatedTotalWithGST = item.price * item.quantity * (1 + (item.gst / 100 || 0));
      if (Math.abs(calculatedTotalWithGST - item.totalWithGST) > 0.01) {
        console.warn(`TotalWithGST mismatch for ${item.name}: Expected ${calculatedTotalWithGST}, Received ${item.totalWithGST}`);
        item.totalWithGST = calculatedTotalWithGST;
      }
      await product.save();
    }

    const newOrder = new Order({
      ...orderData,
      userId,
      purchaseType: "Online",
      razorpayOrderId: razorpay_order_id,
      razorpayPaymentId: razorpay_payment_id,
      status: "Paid",
      statusHistory: [{ status: "Paid", timestamp: new Date(), updatedBy: userId }],
    });

    await newOrder.save();
    console.log("Razorpay order verified and saved:", newOrder._id);
    res.json({ success: true, message: "Order placed successfully", order: newOrder });
  } catch (error) {
    console.error("Error verifying payment:", error.stack);
    res.status(500).json({ success: false, message: "Payment verification failed", error: error.message });
  }
};

const getMyOrders = async (req, res) => {
  try {
    const userId = req.session.user?.id;
    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized. Please log in." });
    }
    const orders = await Order.find({ userId })
      .populate("cart.productId", "name images")
      .sort({ createdAt: -1 });
    res.status(200).json({ success: true, orders });
  } catch (error) {
    console.error("Error fetching orders:", error.stack);
    res.status(500).json({ success: false, message: "Internal Server Error", error: error.message });
  }
};

const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("userId", "firstName email")
      .sort({ createdAt: -1 });
    res.status(200).json({ success: true, orders });
  } catch (error) {
    console.error("Error fetching all orders:", error.stack);
    res.status(500).json({ success: false, message: "Failed to fetch orders", error: error.message });
  }
};

const getOrdersByCustomerMobile = async (req, res) => {
  try {
    const { mobile } = req.params;
    if (!mobile) {
      return res.status(400).json({ success: false, message: "Mobile number is required" });
    }

    const orders = await Order.find({ phone: mobile })
      .populate("cart.productId", "name")
      .sort({ createdAt: -1 });

    const totalDues = orders
      .filter((order) => order.isDue)
      .reduce((sum, order) => sum + order.totalAmount, 0);

    res.status(200).json({ success: true, orders, totalDues });
  } catch (error) {
    console.error("Error fetching customer orders:", error.stack);
    res.status(500).json({ success: false, message: "Internal Server Error", error: error.message });
  }
};

const getMyBills = async (req, res) => {
  try {
    const userId = req.session.user?.id;
    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const orders = await Order.find({ userId }).sort({ createdAt: -1 });
    res.json({ success: true, orders });
  } catch (error) {
    console.error("Error fetching bills:", error.stack);
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

const getOrderStats = async (req, res) => {
  try {
    const orders = await Order.aggregate([
      { $group: { _id: { $month: "$createdAt" }, count: { $sum: 1 } } },
      { $sort: { "_id": 1 } },
    ]);
    res.status(200).json(orders.map((o) => ({ month: o._id, count: o.count })));
  } catch (error) {
    console.error("Error fetching order stats:", error.stack);
    res.status(500).json({ success: false, message: "Error fetching stats", error: error.message });
  }
};

const getSalesDistribution = async (req, res) => {
  try {
    const sales = await Order.aggregate([
      { $group: { _id: "$purchaseType", total: { $sum: "$totalAmount" } } },
    ]);
    res.status(200).json(sales);
  } catch (error) {
    console.error("Error fetching sales distribution:", error.stack);
    res.status(500).json({ success: false, message: "Error fetching sales", error: error.message });
  }
};

const createRazorpayOrder = async (req, res) => {
  try {
    const { amount } = req.body;
    if (!amount || isNaN(amount)) {
      return res.status(400).json({ success: false, message: "Invalid amount" });
    }

    const options = {
      amount: parseInt(amount), // Amount in paise
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
    };

    const order = await razorpayInstance.orders.create(options);
    console.log("Razorpay order created:", order.id);
    res.json({ success: true, id: order.id, currency: order.currency });
  } catch (error) {
    console.error("Error creating Razorpay order:", error.stack);
    res.status(500).json({ success: false, message: "Failed to create order", error: error.message });
  }
};

const updateOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;
    const userId = req.session.user?.id;

    if (!orderId || !status) {
      return res.status(400).json({ success: false, message: "Order ID and status are required." });
    }

    const validStatuses = ["Pending", "Paid", "Shipped", "Completed", "Cancelled"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ success: false, message: "Invalid status." });
    }

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found." });
    }

    order.status = status;
    if (status === "Paid" || status === "Completed") {
      order.isDue = false;
      if (status === "Paid" && order.isDue) {
        order.duesPaidDate = new Date();
      }
    }
    order.statusHistory.push({ status, timestamp: new Date(), updatedBy: userId });
    await order.save();

    console.log("Order status updated:", orderId, "to", status);
    res.status(200).json({ success: true, message: "Order status updated successfully!", order });
  } catch (error) {
    console.error("Error updating order status:", error.stack);
    res.status(500).json({ success: false, message: "Internal Server Error", error: error.message });
  }
};

const payDues = async (req, res) => {
  try {
    const { orderId } = req.params;
    const userId = req.session.user?.id;

    if (!orderId) {
      return res.status(400).json({ success: false, message: "Order ID is required." });
    }

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found." });
    }

    if (!order.isDue) {
      return res.status(400).json({ success: false, message: "No dues to pay for this order." });
    }

    order.status = "Paid";
    order.isDue = false;
    order.duesPaidDate = new Date();
    order.statusHistory.push({ status: "Paid", timestamp: new Date(), updatedBy: userId });

    await order.save();
    console.log("Dues paid for order:", orderId);
    res.status(200).json({ success: true, message: "Dues paid successfully!", order });
  } catch (error) {
    console.error("Error paying dues:", error.stack);
    res.status(500).json({ success: false, message: "Internal Server Error", error: error.message });
  }
};

module.exports = {
  placeOrder,
  getMyOrders,
  getAllOrders,
  getOrdersByCustomerMobile,
  getCustomerDetailsByPhone,
  getMyBills,
  createOfflineOrder,
  getOrderStats,
  getSalesDistribution,
  createRazorpayOrder,
  verifyRazorpayPayment,
  updateOrderStatus,
  payDues,
};
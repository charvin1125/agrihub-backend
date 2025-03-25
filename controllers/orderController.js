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
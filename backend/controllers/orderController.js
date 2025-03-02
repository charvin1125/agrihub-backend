const User = require("../models/User"); 
const Order = require("../models/Order");
const Product = require("../models/Product");
const mongoose = require("mongoose");
// ✅ Place Order (POST /api/orders/place)
// const placeOrder = async (req, res) => {
//   try {
//     const userId = req.session.user?.id; // ✅ Get from middleware

//     if (!userId) {
//       return res.status(401).json({ success: false, message: "Unauthorized. Please log in." });
//     }

//     const { name, phone, address, pincode, crop, paymentMethod, totalAmount, cart } = req.body;

//     if (!name || !phone || !address || !pincode || !crop || !totalAmount || !cart || cart.length === 0) {
//       return res.status(400).json({ success: false, message: "All fields are required." });
//     }

//     const newOrder = new Order({ userId, name, phone, address, pincode, crop, paymentMethod, totalAmount, cart });

//     await newOrder.save();
//     res.status(201).json({ success: true, message: "Order placed successfully!", order: newOrder });
//   } catch (error) {
//     console.error("Error placing order:", error);
//     res.status(500).json({ success: false, message: "Internal Server Error" });
//   }
// };
// const placeOrder = async (req, res) => {
//   try {
//     const userId = req.session.user?.id;
//     if (!userId) {
//       return res.status(401).json({ success: false, message: "Unauthorized. Please log in." });
//     }

//     const { name, phone, address, pincode, crop, paymentMethod, totalAmount, cart } = req.body;

//     if (!name || !phone || !address || !pincode || !crop || !totalAmount || !cart || cart.length === 0) {
//       return res.status(400).json({ success: false, message: "All fields are required." });
//     }

//     // 🔹 Check stock for each product variant before placing the order
//     for (const item of cart) {
//       const product = await Product.findById(item.productId);
//       if (!product) {
//         return res.status(404).json({ success: false, message: `Product not found: ${item.productId}` });
//       }

//       const variant = product.variants.find(v => v._id.toString() === item.variantId);
//       if (!variant) {
//         return res.status(404).json({ success: false, message: `Variant not found for ${product.name}` });
//       }

//       if (variant.stock < item.quantity) {
//         return res.status(400).json({
//           success: false,
//           message: `Insufficient stock for ${product.name} (${variant.size}). Available: ${variant.stock}`,
//         });
//       }
//     }

//     // 🔹 Create New Order
//     const newOrder = new Order({
//       userId,
//       name,
//       phone,
//       address,
//       pincode,
//       crop,
//       paymentMethod,
//       totalAmount,
//       cart,
//     });

//     // 🔹 Save Order First
//     await newOrder.save();

//     // 🔹 Deduct stock for each ordered product variant
//     for (const item of cart) {
//       await Product.findOneAndUpdate(
//         { _id: item.productId, "variants._id": item.variantId },
//         { $inc: { "variants.$.stock": -item.quantity } } // Reduce stock
//       );
//     }

//     res.status(201).json({ success: true, message: "Order placed successfully!", order: newOrder });
//   } catch (error) {
//     console.error("Error placing order:", error);
//     res.status(500).json({ success: false, message: "Internal Server Error" });
//   }
// };

const placeOrder = async (req, res) => {
  try {
    const userId = req.session.user?.id;
  
    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized. Please log in." });
    }

    const { name, phone, address, pincode, crop,paymentMethod, totalAmount, cart } = req.body;

    if (!name || !phone || !address || !pincode || !crop || !totalAmount || !cart || cart.length === 0) {
      return res.status(400).json({ success: false, message: "All fields are required." });
    }

    // Check product variants
    for (const item of cart) {
      const product = await Product.findById(item.productId);
      if (!product) {
        return res.status(404).json({ success: false, message: `Product not found for ${item.name}` });
      }

      const variant = product.variants.find(v => v._id.toString() === item.variantId);
      if (!variant) {
        return res.status(404).json({ success: false, message: `Variant not found for ${item.name}. VariantId: ${item.variantId}` });
      }

      // Reduce stock quantity
      if (variant.stock < item.quantity) {
        return res.status(400).json({ success: false, message: `Insufficient stock for ${item.name}` });
      }
      variant.stock -= item.quantity;
      await product.save();
    }

    const newOrder = new Order({ userId, name, phone, address, pincode, crop, purchaseType:"Online",paymentMethod, totalAmount, cart });

    await newOrder.save();
    res.status(201).json({ success: true, message: "Order placed successfully!", order: newOrder });
  } catch (error) {
    console.error("Error placing order:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

module.exports = { placeOrder };
// ✅ Get Orders for Logged-in User (GET /api/orders/my-orders)
// const getMyOrders = async (req, res) => {
//   try {
//     const userId = req.session.userId;
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
const getMyOrders = async (req, res) => {
  try {
    const userId = req.session.user?.id;
    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized. Please log in." });
    }
    const orders = await Order.find({ userId }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, orders });
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};


// ✅ Get All Orders (Admin Only) (GET /api/orders)
const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().populate("user", "name email");
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch orders" });
  }
};

// const getOrdersByCustomerMobile = async (req, res) => {
//   // try {
//   //   const { mobile } = req.params;

//   //   // Find user by mobile number
//   //   const user = await User.findOne({ mobile });
//   //   if (!user) {
//   //     return res.status(404).json({ message: "Customer not found" });
//   //   }

//   //   // Fetch all orders of this user and populate product details
//   //   // const orders = await Order.find({ userId: user._id })
//   //   //   .populate({
//   //   //     path: "items.productId",
//   //   //     select: "name brand category",  // Select brand & category
//   //   //     populate: [
//   //   //       { path: "brand", select: "name" },     // Populate brand name
//   //   //       { path: "category", select: "name" }   // Populate category name
//   //   //     ]
//   //   //   });

//   //   const orders = await Order.find({ userId: user._id }).populate("cart.productId", "name");

//   //   if (orders.length === 0) {
//   //     return res.status(404).json({ message: "No orders found for this customer" });
//   //   }

//   //   res.json(orders);
//   // } catch (error) {
//   //   res.status(500).json({ error: error.message });
//   // }
//   try {
//     const { mobile } = req.params;
//     if (!mobile) return res.status(400).json({ success: false, message: "Mobile number is required" });

//     const orders = await Order.find({ phone: mobile }).sort({ createdAt: -1 });
//     // const orders = await Order.find({ userId: user._id }).populate("cart.productId", "name")
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


const getOrdersByCustomerMobile = async (req, res) => {
  try {
    const { mobile } = req.params;
    if (!mobile) return res.status(400).json({ success: false, message: "Mobile number is required" });

    // ✅ Fetch orders & populate product names
    const orders = await Order.find({ phone: mobile })
      .sort({ createdAt: -1 })
      .populate("cart.productId", "name"); // 🔹 Populate product names

    // ✅ Calculate total dues
    const totalDues = orders
      .filter((order) => order.isDue) // Only include "Pay Later" orders
      .reduce((sum, order) => sum + order.totalAmount, 0);

    res.status(200).json({ success: true, orders, totalDues });
  } catch (error) {
    console.error("Error fetching customer orders:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

// 📌 Fetch all orders of the logged-in user
const getMyBills = async (req, res) => {
  try {
    if (!req.session.userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const orders = await Order.find({ userId: req.session.userId }).sort({ createdAt: -1 });

    res.json({ success: true, orders });
  } catch (error) {
    console.error("Error fetching bills:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
// const createOfflineOrder = async (req, res) => {
//   try {
//     const userId = req.session.user?.id;
//     const { name, phone, cart, paymentMethod, crop } = req.body;

//     if (!name || !phone || !cart || cart.length === 0 || !crop) {
//       return res.status(400).json({ success: false, message: "All fields are required." });
//     }

//     // Calculate total amount
//     let totalAmount = 0;
//     cart.forEach(item => {
//       const price = parseFloat(item.price);
//       const quantity = parseInt(item.quantity, 10);
//       totalAmount += price * quantity;
//     });

//     const newOrder = new Order({
//       userId, // Admin ID
//       name,
//       phone,
      // address: "Offline Purchase", // No address needed
      // pincode: "000000", // Dummy pincode
//       crop,
//       purchaseType: "Offline", // Mark as offline
//       paymentMethod,
//       totalAmount,
//       status: "Completed", // Offline orders are completed immediately
//       cart
//     });

//     await newOrder.save();
//     res.json({ success: true, message: "Offline Order Placed Successfully!" });
//   } catch (error) {
//     console.error("Error placing offline order:", error);
//     res.status(500).json({ success: false, message: "Internal Server Error" });
//   }
// };
// const createOfflineOrder = async (req, res) => {
//   try {
//     const userId = req.session.user?.id;
   

//     const { name, phone, crop, cart, totalAmount, paymentMethod } = req.body;

//     if (!name || !phone || !cart || cart.length === 0 || !totalAmount || !crop || !paymentMethod) {
//       return res.status(400).json({ success: false, message: "Missing required fields" });
//     }

//     const newOrder = new Order({
//       userId,
//       name,
//       phone,
//       address: "Offline Purchase", // No address needed
//       pincode: "000000",
//       crop,
//       purchaseType: "Offline",
//       paymentMethod,
//       totalAmount,
//       status: "Completed",
//       cart,
//     });

//     await newOrder.save();

//     // ✅ Update Stock After Purchase
//     for (const item of cart) {
//       const product = await Product.findById(item.productId);
//       if (product) {
//         const variant = product.variants.find((v) => v._id.toString() === item.variantId);
//         if (variant) {
//           variant.stock -= item.quantity;
//           if (variant.stock < 0) variant.stock = 0; // Ensure stock doesn't go negative
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

// const createOfflineOrder = async (req, res) => {
//   try {
//     const userId = req.session.user?.id;

//     const { name, phone, crop, cart, totalAmount, paymentMethod } = req.body;

//     if (!name || !phone || !cart || cart.length === 0 || !totalAmount || !crop || !paymentMethod) {
//       return res.status(400).json({ success: false, message: "Missing required fields" });
//     }

//     const newOrder = new Order({
//       userId,
//       name,
//       phone,
//       address: "Offline Purchase", // No address needed
//       pincode: "000000",
//       crop,
//       purchaseType: "Offline",
//       paymentMethod,
//       totalAmount,
//       status: "Completed",
//       cart,
//     });

//     await newOrder.save();

//     // ✅ Debug stock update
//     console.log("Updating stock for purchased products...");

//     for (const item of cart) {
//       const product = await Product.findById(item.productId);
//       if (product) {
//         const variant = product.variants.find((v) => v._id.toString() === item.variantId);
//         if (variant) {
//           console.log(`🛒 Product: ${product.name}, Variant: ${variant.size}`);
//           console.log(`📉 Before Update: Stock = ${variant.stock}`);

//           variant.stock -= item.quantity;
//           if (variant.stock < 0) variant.stock = 0; // Ensure stock doesn't go negative

//           console.log(`✅ After Update: Stock = ${variant.stock}`);
//         } else {
//           console.log(`❌ Variant Not Found for Product: ${product.name}`);
//         }

//         await product.save();
//       } else {
//         console.log(`❌ Product Not Found: ${item.productId}`);
//       }
//     }

//     console.log("✅ Stock updated successfully!");

//     res.status(201).json({ success: true, message: "Offline order placed successfully!", order: newOrder });
//   } catch (error) {
//     console.error("❌ Error placing offline order:", error);
//     res.status(500).json({ success: false, message: "Internal Server Error" });
//   }
// };
//after add the stock manage
// const createOfflineOrder = async (req, res) => {
//   try {
//     const userId = req.session.user?.id;
//     const { name, phone, crop, cart, totalAmount, paymentMethod } = req.body;

//     if (!name || !phone || !cart || cart.length === 0 || !totalAmount || !crop || !paymentMethod) {
//       return res.status(400).json({ success: false, message: "Missing required fields" });
//     }

//     // ✅ Check if stock is available for all products
//     for (const item of cart) {
//       const product = await Product.findById(item.productId);
//       if (product) {
//         const variant = product.variants.find((v) => v._id.toString() === item.variantId);
//         if (!variant) {
//           return res.status(400).json({ success: false, message: `Variant not found for ${product.name}` });
//         }
//         if (variant.stock < item.quantity) {
//           return res.status(400).json({ success: false, message: `Insufficient stock for ${product.name} (${variant.size})` });
//         }
//       } else {
//         return res.status(400).json({ success: false, message: `Product not found: ${item.productId}` });
//       }
//     }

//     // ✅ Proceed with order placement & stock update
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
//     });

//     await newOrder.save();

//     for (const item of cart) {
//       const product = await Product.findById(item.productId);
//       if (product) {
//         const variant = product.variants.find((v) => v._id.toString() === item.variantId);
//         if (variant) {
//           variant.stock -= item.quantity;
//           await product.save();
//         }
//       }
//     }

//     res.status(201).json({ success: true, message: "Offline order placed successfully!", order: newOrder });
//   } catch (error) {
//     console.error("Error placing offline order:", error);
//     res.status(500).json({ success: false, message: "Internal Server Error" });
//   }
// };

//after the add dues 
const createOfflineOrder = async (req, res) => {
  try {
    const userId = req.session.user?.id;
    const { name, phone, crop, cart, totalAmount, paymentMethod } = req.body;

    if (!name || !phone || !cart || cart.length === 0 || !totalAmount || !crop || !paymentMethod) {
      return res.status(400).json({ success: false, message: "Missing required fields" });
    }

    const isDue = paymentMethod === "Pay Later"; // ✅ Mark as due if Pay Later is used

    const newOrder = new Order({
      userId,
      name,
      phone,
      address: "Offline Purchase",
      pincode: "000000",
      crop,
      purchaseType: "Offline",
      paymentMethod,
      totalAmount,
      status: "Completed",
      cart,
      isDue, // ✅ Store if the order is due
    });

    await newOrder.save();

    // ✅ Update Stock After Purchase
    for (const item of cart) {
      const product = await Product.findById(item.productId);
      if (product) {
        const variant = product.variants.find((v) => v._id.toString() === item.variantId);
        if (variant) {
          variant.stock -= item.quantity;
          if (variant.stock < 0) variant.stock = 0;
        }
        await product.save();
      }
    }

    res.status(201).json({ success: true, message: "Offline order placed successfully!", order: newOrder });
  } catch (error) {
    console.error("Error placing offline order:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};



//for the charts 
const getOrderStats = async (req, res) => {
  try {
    const orders = await Order.aggregate([
      { $group: { _id: { $month: "$createdAt" }, count: { $sum: 1 } } },
      { $sort: { "_id": 1 } },
    ]);
    res.status(200).json(orders.map((o) => ({ month: o._id, count: o.count })));
  } catch (error) {
    console.error("Error fetching order stats:", error);
    res.status(500).json({ message: "Error fetching stats" });
  }
};

const getSalesDistribution = async (req, res) => {
  try {
    const sales = await Order.aggregate([
      { $group: { _id: "$purchaseType", total: { $sum: "$totalAmount" } } },
    ]);
    res.status(200).json(sales);
  } catch (error) {
    console.error("Error fetching sales distribution:", error);
    res.status(500).json({ message: "Error fetching sales" });
  }
};

const Razorpay = require("razorpay");
const crypto = require("crypto");

const razorpayInstance = new Razorpay({
  key_id: "rzp_test_fwA1F6rg7iQI8x", // From Razorpay Dashboard
  key_secret: "oz1Nzimmw5c7tusgHbaqRRhR", // From Razorpay Dashboard
});

// Create Razorpay order
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

//     // Save order to database (adjust based on your Order model)
//     const orderResponse = await axios.post("http://localhost:5000/api/orders/place", orderData, {
//       withCredentials: true,
//     });

//     if (orderResponse.data.success) {
//       res.json({ success: true, message: "Order placed successfully" });
//     } else {
//       console.error("Order placement failed:", orderResponse.data);
//       res.status(500).json({ error: "Failed to save order" });
//     }
//   } catch (error) {
//     console.error("Error verifying payment:", error.response ? error.response.data : error.message);
//     res.status(500).json({ error: "Payment verification failed" });
//   }
// };

const createRazorpayOrder = async (req, res) => {
  try {
    const { amount } = req.body; // Amount in paise
    if (!amount || isNaN(amount)) {
      return res.status(400).json({ error: "Invalid amount" });
    }

    const options = {
      amount: parseInt(amount), // Ensure integer
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
    };

    const order = await razorpayInstance.orders.create(options);
    console.log("Created Razorpay Order:", order); // Debug log
    res.json({ id: order.id, currency: order.currency });
  } catch (error) {
    console.error("Error creating Razorpay order:", error);
    res.status(500).json({ error: "Failed to create order" });
  }
};

// Verify Razorpay payment and save order
const verifyRazorpayPayment = async (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature, orderData } = req.body;
  const userId = req.session.user?.id;
  try {
    // Verify signature
    const secret = "oz1Nzimmw5c7tusgHbaqRRhR"; // Replace with your key secret
    const body = `${razorpay_order_id}|${razorpay_payment_id}`;
    const generatedSignature = crypto
      .createHmac("sha256", secret)
      .update(body)
      .digest("hex");

    console.log("Generated Signature:", generatedSignature); // Debug log
    console.log("Received Signature:", razorpay_signature); // Debug log

    if (generatedSignature !== razorpay_signature) {
      console.error("Signature mismatch:", { generatedSignature, razorpay_signature });
      return res.status(400).json({ error: "Invalid payment signature" });
    }

    // Save order directly (no nested axios call)
    const newOrder = new Order({
      ...orderData,
      userId,
      purchaseType:"Online",
      razorpayOrderId: razorpay_order_id,
      razorpayPaymentId: razorpay_payment_id,
      status: "Paid", // Update status as needed
    });
    await newOrder.save();

    res.json({ success: true, message: "Order placed successfully" });
  } catch (error) {
    console.error("Error verifying payment:", error.message);
    res.status(500).json({ error: "Payment verification failed" });
  }
};
module.exports = { placeOrder, getMyOrders, getAllOrders ,getOrdersByCustomerMobile,getMyBills,createOfflineOrder,getOrderStats,getSalesDistribution,createRazorpayOrder,verifyRazorpayPayment};
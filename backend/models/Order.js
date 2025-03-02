// const mongoose = require("mongoose");

// const OrderSchema = new mongoose.Schema(
//   {
//     userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // 🔹 Tied to user authentication
//     name: { type: String, required: true },
//     phone: { type: String, required: true },
//     address: { type: String, required: true },
//     pincode: { type: String, required: true },
//     crop: { type: String, required: true },
//     purchaseType: { type: String, enum: ["Online", "Offline"], required: true },
//     paymentMethod: { type: String, enum: ["Pay Later", "Card", "Cash"], default: "Pay Later" },
//     totalAmount: { type: Number, required: true },
//     status: { type: String, enum: ["Pending", "Completed", "Cancelled"], default: "Pending" }, // Order Status
//     cart: [
//       {
//         productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
//         name: { type: String, required: true },
//         price: { type: Number, required: true },
//         quantity: { type: Number, required: true },
//         gst: { type: Number, default: 0 },
//       },
//     ],
//   },
//   { timestamps: true }
// );

// module.exports = mongoose.model("Order", OrderSchema);
const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    name: String,
    phone: String,
    address: String,
    pincode: String,
    crop: String,
    purchaseType: { type: String, enum: ["Online", "Offline"], required: true },
    paymentMethod: { type: String, enum: ["Cash", "Card", "Pay Later"], required: true },
    totalAmount: Number,
    status: { type: String, default: "Pending" },
    cart: [
      {
        productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
        variantId: mongoose.Schema.Types.ObjectId,
        name: String,
        size: String,
        price: Number,
        gst: Number,
        quantity: Number,
        totalWithGST: Number,
      },
    ],
    isDue: { type: Boolean, default: false }, 
    razorpayOrderId: String,
  razorpayPaymentId: String,// ✅ Track if this order is a due
    createdAt: { type: Date, default: Date.now },
  }
);

module.exports = mongoose.model("Order", OrderSchema);

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
// const mongoose = require("mongoose");

// const OrderSchema = new mongoose.Schema(
//   {
//     userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
//     name: String,
//     phone: String,
//     address: String,
//     pincode: String,
//     crop: String,
//     purchaseType: { type: String, enum: ["Online", "Offline"], required: true },
//     paymentMethod: { type: String, enum: ["Cash", "Card", "Pay Later"], required: true },
//     totalAmount: Number,
//     status: { type: String, default: "Pending" },
//     cart: [
//       {
//         productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
//         variantId: mongoose.Schema.Types.ObjectId,
//         name: String,
//         size: String,
//         price: Number,
//         gst: Number,
//         quantity: Number,
//         totalWithGST: Number,
//       },
//     ],
//     isDue: { type: Boolean, default: false }, 
//     razorpayOrderId: String,
//   razorpayPaymentId: String,// ✅ Track if this order is a due
//     createdAt: { type: Date, default: Date.now },
//   }
// );

// module.exports = mongoose.model("Order", OrderSchema);

// const mongoose = require("mongoose");

// const OrderSchema = new mongoose.Schema({
//   userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
//   name: { type: String, required: true },
//   phone: { type: String, required: true },
//   address: { type: String, required: true },
//   pincode: { type: String, required: true },
//   crop: { type: String, required: true },
//   purchaseType: { type: String, enum: ["Online", "Offline"], required: true },
//   paymentMethod: { type: String, enum: ["Cash", "Card", "Pay Later"], required: true },
//   totalAmount: { type: Number, required: true },
//   // status: { type: String, enum: ["Pending", "Paid", "Completed", "Cancelled"], default: "Pending" },
//   status: { type: String, enum: ["Pending", "Paid", "Shipped", "Completed", "Cancelled"], default: "Pending" },
//   cart: [
//     {
//       productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
//       variantId: { type: mongoose.Schema.Types.ObjectId, required: true },
//       name: { type: String, required: true },
//       size: { type: String, required: true },
//       price: { type: Number, required: true }, // Represents `sellingPrice` from Product
//       gst: { type: Number, default: 0 },
//       quantity: { type: Number, required: true },
//       totalWithGST: { type: Number, required: true },
//     },
//   ],
//   isDue: { type: Boolean, default: false }, // Tracks if payment is pending (e.g., "Pay Later")
//   razorpayOrderId: { type: String },
//   razorpayPaymentId: { type: String },
//   createdAt: { type: Date, default: Date.now },
//   statusHistory: [{
//     status: { type: String, enum: ["Pending", "Paid", "Completed", "Cancelled"] },
//     timestamp: { type: Date, default: Date.now },
//     updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
//   }],
// });

// module.exports = mongoose.model("Order", OrderSchema);
// const mongoose = require("mongoose");

// const OrderSchema = new mongoose.Schema({
//   userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
//   name: { type: String, required: true },
//   phone: { type: String, required: true },
//   address: { type: String, required: true },
//   pincode: { type: String, required: true },
//   crop: { type: String, required: true },
//   purchaseType: { type: String, enum: ["Online", "Offline"], required: true },
//   paymentMethod: { type: String, enum: ["Cash", "Card", "Pay Later"], required: true },
//   totalAmount: { type: Number, required: true },
//   status: { type: String, enum: ["Pending", "Paid", "Shipped", "Completed", "Cancelled"], default: "Pending" },
//   cart: [
//     {
//       productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
//       variantId: { type: mongoose.Schema.Types.ObjectId, required: true },
//       name: { type: String, required: true },
//       size: { type: String, required: true },
//       price: { type: Number, required: true },
//       gst: { type: Number, default: 0 },
//       quantity: { type: Number, required: true },
//       totalWithGST: { type: Number, required: true },
//     },
//   ],
//   isDue: { type: Boolean, default: false },
//   duesPaidDate: { type: Date, default: null }, // New field to store dues payment date
//   razorpayOrderId: { type: String },
//   razorpayPaymentId: { type: String },
//   createdAt: { type: Date, default: Date.now },
//   statusHistory: [{
//     status: { type: String, enum: ["Pending", "Paid", "Shipped", "Completed", "Cancelled"] }, // Updated to match status enum
//     timestamp: { type: Date, default: Date.now },
//     updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
//   }],
// });

// module.exports = mongoose.model("Order", OrderSchema);
// const mongoose = require("mongoose");

// const OrderSchema = new mongoose.Schema({
//   userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
//   name: { type: String, required: true },
//   phone: { type: String, required: true },
//   address: { type: String, required: true },
//   pincode: { type: String, required: true },
//   crop: { type: String, required: true },
//   purchaseType: { type: String, enum: ["Online", "Offline"], required: true },
//   paymentMethod: { type: String, enum: ["Cash", "Card", "Pay Later"], required: true },
//   totalAmount: { type: Number, required: true },
//   status: { type: String, enum: ["Pending", "Paid", "Shipped", "Completed", "Cancelled"], default: "Pending" },
//   cart: [
//     {
//       productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
//       variantId: { type: mongoose.Schema.Types.ObjectId, required: true },
//       batchId: { type: mongoose.Schema.Types.ObjectId, required: true }, // Added batchId
//       name: { type: String, required: true },
//       size: { type: String, required: true },
//       price: { type: Number, required: true },
//       gst: { type: Number, default: 0 },
//       quantity: { type: Number, required: true },
//       totalWithGST: { type: Number, required: true },
//     },
//   ],
//   isDue: { type: Boolean, default: false },
//   duesPaidDate: { type: Date, default: null },
//   razorpayOrderId: { type: String },
//   razorpayPaymentId: { type: String },
//   createdAt: { type: Date, default: Date.now },
//   statusHistory: [
//     {
//       status: { type: String, enum: ["Pending", "Paid", "Shipped", "Completed", "Cancelled"] },
//       timestamp: { type: Date, default: Date.now },
//       updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
//     },
//   ],
// });

// module.exports = mongoose.model("Order", OrderSchema);
const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  name: { type: String, required: true },
  phone: { type: String, required: true },
  address: { type: String, required: true },
  pincode: { type: String, required: true },
  referenceName: { type: String }, // New field
  remarks: { type: String }, // New field
  crop: { type: String, required: true },
  purchaseType: { type: String, enum: ["Online", "Offline"], required: true },
  paymentMethod: { type: String, enum: ["Cash", "Card", "Pay Later"], required: true },
  totalAmount: { type: Number, required: true },
  status: { type: String, enum: ["Pending", "Paid", "Shipped", "Completed", "Cancelled"], default: "Pending" },
  cart: [
    {
      productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
      variantId: { type: mongoose.Schema.Types.ObjectId, required: true },
      batchId: { type: mongoose.Schema.Types.ObjectId, required: true },
      name: { type: String, required: true },
      size: { type: String, required: true },
      price: { type: Number, required: true },
      gst: { type: Number, default: 0 },
      quantity: { type: Number, required: true },
      totalWithGST: { type: Number, required: true },
    },
  ],
  isDue: { type: Boolean, default: false },
  duesPaidDate: { type: Date, default: null },
  razorpayOrderId: { type: String },
  razorpayPaymentId: { type: String },
  createdAt: { type: Date, default: Date.now },
  statusHistory: [
    {
      status: { type: String, enum: ["Pending", "Paid", "Shipped", "Completed", "Cancelled"] },
      timestamp: { type: Date, default: Date.now },
      updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    },
  ],
});

module.exports = mongoose.model("Order", OrderSchema);
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
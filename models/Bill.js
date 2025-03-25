const mongoose = require("mongoose");

const BillSchema = new mongoose.Schema({
  billId: { type: String, unique: true }, // Store formatted Bill ID
  orderId: { type: String, required: true }, // Store formatted Order ID
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  amount: { type: Number, required: true },
  dues: { type: Number, default: 0 },
  paymentMethod: { type: String, required: true }, // Added due amount
  crop: { type: String, required: true },
  date: { type: Date, default: Date.now },
  status: { type: String, enum: ["Paid", "Due"], default: "Paid" }, // Added status
});

// Generate custom Bill ID before saving
BillSchema.pre("save", function (next) {
  if (!this.billId) {
    const timestamp = Date.now();
    const randomPart = Math.floor(1000 + Math.random() * 9000);
    this.billId = `BILL-${timestamp}-${randomPart}`;
  }
  if (!this.orderId) {
    const timestamp = Date.now();
    const randomPart = Math.floor(1000 + Math.random() * 9000);
    this.orderId = `ORD-${timestamp}-${randomPart}`;
  }
  next();
});

module.exports = mongoose.model("Bill", BillSchema);

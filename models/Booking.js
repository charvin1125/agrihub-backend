const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  serviceId: { type: mongoose.Schema.Types.ObjectId, ref: "Service", required: true },
  serviceName: { type: String, required: true },
  customerName: { type: String, required: true },
  contactNumber: { type: String, required: true },
  crop: { type: String, required: true },
  medicineName: { type: String, required: true },
  areaInSqFt: { type: Number, required: true },
  farmAddress: { type: String, required: true },
  pincode: { type: String, required: true },
  problem: { type: String, required: true },           // New field: Problem
  expectedDate: { type: Date, required: true },       // New field: Expected Date
  remarks: { type: String },                          // New field: Remarks (optional)
  totalPrice: { type: Number, required: true },
  laborId: { type: mongoose.Schema.Types.ObjectId, ref: "Labor" },
  serviceDate: { type: Date },
  status: { type: String, default: "Pending", enum: ["Pending", "Approved", "Completed"] },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Booking", bookingSchema);
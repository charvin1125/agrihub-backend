const mongoose = require("mongoose");

const VendorSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true }, // Vendor/Company Name
  email: { type: String, required: true },
  phone: { type: String, required: true },
  address: { type: String },
});

module.exports = mongoose.model("Vendor", VendorSchema);

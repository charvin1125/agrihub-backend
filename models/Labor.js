const mongoose = require("mongoose");

const laborSchema = new mongoose.Schema({
  name: { type: String, required: true },
  mobile: { 
    type: String, 
    required: true, 
    match: [/^[0-9]{10}$/, "Mobile number must be a 10-digit number"], // Basic validation
    unique: true // Optional: ensures no duplicate mobile numbers
  },
  availability: { type: Boolean, default: true },
});

module.exports = mongoose.model("Labor", laborSchema);
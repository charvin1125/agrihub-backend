// Models/Labor.js
const mongoose = require("mongoose");
const laborSchema = new mongoose.Schema({
  name: { type: String, required: true },
  availability: { type: Boolean, default: true },
});
module.exports = mongoose.model("Labor", laborSchema);
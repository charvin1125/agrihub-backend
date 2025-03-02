const mongoose = require("mongoose");
const serviceSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  pricePer100SqFt: { type: Number, required: true },
  image: String, // Path to stored image
});
module.exports = mongoose.model("Service", serviceSchema);
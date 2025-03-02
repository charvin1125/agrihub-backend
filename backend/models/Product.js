// const mongoose = require("mongoose");

// const ProductSchema = new mongoose.Schema({
//   name: { type: String, required: true },
//   description: { type: String },
//   price: { type: Number, required: true },
//   category: { type: String, required: true },
//   brand: { type: String, required: true }, // Added Brand
//   variants: [
//     {
//       size: { type: String, required: true },
//       price: { type: Number, required: true },
//       discount: { type: Number, default: 0 },
//     },
//   ],
//   image: { type: String },
//   stock: { type: Number},
// });

// module.exports = mongoose.model("Product", ProductSchema);
const mongoose = require("mongoose");

const VariantSchema = new mongoose.Schema({
  size: { type: String, required: true }, // Custom sizes (e.g., "50ml", "100gm")
  price: { type: Number, required: true },
  stock: { type: Number, required: true, default: 0 },
  discount: { type: Number, default: 0 },
  gst: { type: Number, required: true }, // Added GST field
});

const ProductSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  category: String,
  brand: { type: mongoose.Schema.Types.ObjectId, ref: "Vendor" },
  variants: [VariantSchema], // Store multiple variants with custom size
  image: String,
});

module.exports = mongoose.model("Product", ProductSchema);

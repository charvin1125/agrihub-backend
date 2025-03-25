const mongoose = require("mongoose");

const BatchSchema = new mongoose.Schema({
  batchNumber: { type: String, required: true },
  costPrice: { type: Number, required: true, min: 0 }, // Price at which product is acquired
  sellingPrice: { type: Number, required: true, min: 0 }, // Price at which product is sold
  stock: { type: Number, required: true, default: 0 },
  discount: { type: Number, default: 0 },
  gst: { type: Number, required: true },
  addedDate: { type: Date, default: Date.now }, // When this batch was added
});

const VariantSchema = new mongoose.Schema({
  size: { type: String, required: true }, // e.g., "50ml", "100gm"
  batches: [BatchSchema], // Array of batches for this variant
});

const ImageSchema = new mongoose.Schema({
  url: { type: String, required: true },
  isMain: { type: Boolean, default: false },
});

const ProductSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
    required: true,
  },
  brand: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Vendor",
    required: true,
  },
  variants: [VariantSchema],
  images: [{
    type: ImageSchema,
    validate: {
      validator: function (images) {
        return images.some((img) => img.isMain === true);
      },
      message: "At least one image must be set as the main image",
    },
  }],
}, { timestamps: true });

// Ensure only one image can be main
ProductSchema.pre("save", async function (next) {
  const mainImages = this.images.filter((img) => img.isMain);
  if (mainImages.length > 1) {
    throw new Error("Only one image can be set as the main image");
  }
  next();
});

module.exports = mongoose.model("Product", ProductSchema);
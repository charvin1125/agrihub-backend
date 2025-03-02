const Product = require("../models/Product");

// exports.addProduct = async (req, res) => {
//   try {
//     const { name, description, category, brand, variants } = req.body;

//     // Ensure variants are properly parsed
//     const parsedVariants = JSON.parse(variants).map(variant => ({
//       size: variant.size,
//       price: variant.price,
//       discount: variant.discount,
//       stock: variant.stock,
//     }));

//     // Create new product with parsed variants
//     const product = new Product({
//       name,
//       description,
//       category,
//       brand,
//       variants: parsedVariants, // Store variants with discount
//       image: req.file ? req.file.path : null,
//     });

//     await product.save();
//     res.json({ message: "Product added successfully", product });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };
exports.addProduct = async (req, res) => {
  try {
    const { name, description, category, brand, variants } = req.body;

    // Ensure variants are properly parsed and include GST
    const parsedVariants = JSON.parse(variants).map(variant => ({
      size: variant.size,
      price: variant.price,
      discount: variant.discount,
      stock: variant.stock,
      gst: variant.gst, // ✅ Added GST field
    }));

    // Create new product with parsed variants
    const product = new Product({
      name,
      description,
      category,
      brand,
      variants: parsedVariants, 
      image: req.file ? req.file.path : null,
    });

    await product.save();
    res.json({ message: "Product added successfully", product });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ✅ Get All Products
// exports.getAllProducts = async (req, res) => {
//   try {
//     const products = await Product.find();
//     res.json(products);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };
exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.find()
      .populate("brand", "name") // ✅ Populate brand name
      .populate("category", "name"); // ✅ Populate category name

    res.json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


// ✅ Get Single Product by ID
exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// exports.updateProduct = async (req, res) => {
//   try {
//     const { name, description, category, brand, variants } = req.body;
//     let updatedData = { name, description, category, brand, variants: JSON.parse(variants) };

//     if (req.file) {
//       const product = await Product.findById(req.params.id);
//       if (product.image) fs.unlinkSync(product.image); // Delete old image
//       updatedData.image = req.file.path;
//     }

//     const updatedProduct = await Product.findByIdAndUpdate(req.params.id, updatedData, { new: true });

//     if (!updatedProduct) return res.status(404).json({ message: "Product not found" });

//     res.json({ message: "Product updated successfully", product: updatedProduct });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };
exports.updateProduct = async (req, res) => {
  try {
    const { name, description, category, brand, variants } = req.body;
    let updatedData = { 
      name, 
      description, 
      category, 
      brand, 
      variants: JSON.parse(variants).map(variant => ({
        size: variant.size,
        price: variant.price,
        discount: variant.discount,
        stock: variant.stock,
        gst: variant.gst, // ✅ Ensure GST is updated
      })),
    };

    if (req.file) {
      const product = await Product.findById(req.params.id);
      if (product.image) fs.unlinkSync(product.image); // Delete old image
      updatedData.image = req.file.path;
    }

    const updatedProduct = await Product.findByIdAndUpdate(req.params.id, updatedData, { new: true });

    if (!updatedProduct) return res.status(404).json({ message: "Product not found" });

    res.json({ message: "Product updated successfully", product: updatedProduct });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete Product
exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    if (product.image) fs.unlinkSync(product.image); // Remove image file

    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: "Product deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
// ✅ Get Low Stock Products
exports.getLowStockProducts = async (req, res) => {
  try {
    console.log("Fetching low stock products...");

    const lowStockProducts = await Product.find({
      "variants.stock": { $lt: 10 }, // ✅ Correctly checking stock in variants
    });

    console.log("Found low stock products:", lowStockProducts); // Debugging

    res.status(200).json(lowStockProducts);
  } catch (error) {
    console.error("Error fetching low stock products:", error);
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
};
exports.getStockData = async (req, res) => {
  try {
    console.log("Fetching all stock data...");
    const stockData = await Product.find({}, "variants"); // Fetch only variants field
    const formattedStock = stockData.map((product) => ({
      productId: product._id,
      stock: product.variants.reduce((total, variant) => total + variant.stock, 0), // Sum stock of all variants
    }));

    console.log("Stock data fetched:", formattedStock);
    res.status(200).json(formattedStock);
  } catch (error) {
    console.error("Error fetching stock data:", error);
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
};

// exports.updateStock = async (req, res) => {
//   try {
//     const { variantId, stock } = req.body;

//     const product = await Product.findOne({ "variants._id": variantId });

//     if (!product) {
//       return res.status(404).json({ message: "Product not found" });
//     }

//     // Find the correct variant and update stock
//     const variant = product.variants.id(variantId);
//     if (!variant) {
//       return res.status(404).json({ message: "Variant not found" });
//     }

//     variant.stock = stock; // ✅ Updating stock of the specific variant
//     await product.save();

//     res.json({ message: "Stock updated successfully", product });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };

//after added the mobile responsive
// Example backend route (Controllers/ProductController.js)
exports.updateStock = async (req, res) => {
  const { variantId, stock } = req.body;
  try {
    const product = await Product.findById(req.params.id);
    const variant = product.variants.id(variantId);
    if (!variant) return res.status(404).json({ error: "Variant not found" });
    variant.stock = stock;
    await product.save();
    res.json({ message: "Stock updated" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Routes/productRoutes.js
// router.put("/:id/update-stock", isAuthenticated, isAdmin, updateStock);

exports.getProducts = async (req, res) => {
  try {
    const products = await Product.find()
      .populate("category", "name") // Populate category and return only name
      .populate("brand", "name"); // Populate brand and return only name

    res.json(products);
  } catch (error) {
    res.status(500).json({ error: "Error fetching products" });
  }
};

exports.getStockByVendor = async (req, res) => {
  try {
    const stock = await Product.aggregate([
      { $unwind: "$variants" }, // Flatten variants array
      {
        $group: {
          _id: "$vendorId", // Assuming vendorId is in Product schema
          totalStock: { $sum: "$variants.stock" },
        },
      },
      {
        $lookup: {
          from: "vendors", // Your Vendor collection
          localField: "_id",
          foreignField: "_id",
          as: "vendor",
        },
      },
      { $unwind: "$vendor" },
      {
        $project: {
          vendorName: "$vendor.name",
          totalStock: 1,
        },
      },
    ]);
    res.status(200).json(stock);
  } catch (error) {
    console.error("Error fetching stock by vendor:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
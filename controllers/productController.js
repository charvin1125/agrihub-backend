// const Product = require("../models/Product");

// exports.addProduct = async (req, res) => {
//   try {
//     const { name, description, category, brand, variants } = req.body;

//     // Ensure variants are properly parsed and include GST
//     const parsedVariants = JSON.parse(variants).map(variant => ({
//       size: variant.size,
//       price: variant.price,
//       discount: variant.discount,
//       stock: variant.stock,
//       gst: variant.gst, // ✅ Added GST field
//     }));

//     // Create new product with parsed variants
//     const product = new Product({
//       name,
//       description,
//       category,
//       brand,
//       variants: parsedVariants, 
//       image: req.file ? req.file.path : null,
//     });

//     await product.save();
//     res.json({ message: "Product added successfully", product });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };

// // ✅ Get All Products
// // exports.getAllProducts = async (req, res) => {
// //   try {
// //     const products = await Product.find();
// //     res.json(products);
// //   } catch (error) {
// //     res.status(500).json({ error: error.message });
// //   }
// // };
// exports.getAllProducts = async (req, res) => {
//   try {
//     const products = await Product.find()
//       .populate("brand", "name") // ✅ Populate brand name
//       .populate("category", "name"); // ✅ Populate category name

//     res.json(products);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };


// // ✅ Get Single Product by ID
// exports.getProductById = async (req, res) => {
//   try {
//     const product = await Product.findById(req.params.id);
//     if (!product) return res.status(404).json({ message: "Product not found" });
//     res.json(product);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };

// exports.updateProduct = async (req, res) => {
//   try {
//     const { name, description, category, brand, variants } = req.body;
//     let updatedData = { 
//       name, 
//       description, 
//       category, 
//       brand, 
//       variants: JSON.parse(variants).map(variant => ({
//         size: variant.size,
//         price: variant.price,
//         discount: variant.discount,
//         stock: variant.stock,
//         gst: variant.gst, // ✅ Ensure GST is updated
//       })),
//     };

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

// // Delete Product
// exports.deleteProduct = async (req, res) => {
//   try {
//     const product = await Product.findById(req.params.id);
//     if (!product) return res.status(404).json({ message: "Product not found" });

//     if (product.image) fs.unlinkSync(product.image); // Remove image file

//     await Product.findByIdAndDelete(req.params.id);
//     res.json({ message: "Product deleted successfully" });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };
// // ✅ Get Low Stock Products
// exports.getLowStockProducts = async (req, res) => {
//   try {
//     console.log("Fetching low stock products...");

//     const lowStockProducts = await Product.find({
//       "variants.stock": { $lt: 10 }, // ✅ Correctly checking stock in variants
//     });

//     console.log("Found low stock products:", lowStockProducts); // Debugging

//     res.status(200).json(lowStockProducts);
//   } catch (error) {
//     console.error("Error fetching low stock products:", error);
//     res.status(500).json({ message: "Internal Server Error", error: error.message });
//   }
// };
// exports.getStockData = async (req, res) => {
//   try {
//     console.log("Fetching all stock data...");
//     const stockData = await Product.find({}, "variants"); // Fetch only variants field
//     const formattedStock = stockData.map((product) => ({
//       productId: product._id,
//       stock: product.variants.reduce((total, variant) => total + variant.stock, 0), // Sum stock of all variants
//     }));

//     console.log("Stock data fetched:", formattedStock);
//     res.status(200).json(formattedStock);
//   } catch (error) {
//     console.error("Error fetching stock data:", error);
//     res.status(500).json({ message: "Internal Server Error", error: error.message });
//   }
// };

// // Example backend route (Controllers/ProductController.js)
// exports.updateStock = async (req, res) => {
//   const { variantId, stock } = req.body;
//   try {
//     const product = await Product.findById(req.params.id);
//     const variant = product.variants.id(variantId);
//     if (!variant) return res.status(404).json({ error: "Variant not found" });
//     variant.stock = stock;
//     await product.save();
//     res.json({ message: "Stock updated" });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };

// exports.getProducts = async (req, res) => {
//   try {
//     const products = await Product.find()
//       .populate("category", "name") // Populate category and return only name
//       .populate("brand", "name"); // Populate brand and return only name

//     res.json(products);
//   } catch (error) {
//     res.status(500).json({ error: "Error fetching products" });
//   }
// };

// exports.getStockByVendor = async (req, res) => {
//   try {
//     const stock = await Product.aggregate([
//       { $unwind: "$variants" }, // Flatten variants array
//       {
//         $group: {
//           _id: "$vendorId", // Assuming vendorId is in Product schema
//           totalStock: { $sum: "$variants.stock" },
//         },
//       },
//       {
//         $lookup: {
//           from: "vendors", // Your Vendor collection
//           localField: "_id",
//           foreignField: "_id",
//           as: "vendor",
//         },
//       },
//       { $unwind: "$vendor" },
//       {
//         $project: {
//           vendorName: "$vendor.name",
//           totalStock: 1,
//         },
//       },
//     ]);
//     res.status(200).json(stock);
//   } catch (error) {
//     console.error("Error fetching stock by vendor:", error);
//     res.status(500).json({ message: "Internal Server Error" });
//   }
// };

// exports.getStockByBrand = async (req, res) => {
//   try {
//     const stockByBrand = await Product.aggregate([
//       { $unwind: "$variants" }, // Flatten the variants array
//       {
//         $group: {
//           _id: "$brand", // Group by brand (currently an ObjectId)
//           totalStock: { $sum: "$variants.stock" },
//         },
//       },
//       {
//         $lookup: {
//           from: "vendors", // Collection name (lowercase, pluralized by MongoDB)
//           localField: "_id",
//           foreignField: "_id",
//           as: "vendor",
//         },
//       },
//       { $unwind: "$vendor" }, // Unwind the vendor array
//       {
//         $project: {
//           brand: "$vendor.name", // Use the vendor name instead of ObjectId
//           totalStock: 1,
//           _id: 0,
//         },
//       },
//       { $sort: { brand: 1 } }, // Sort by brand name
//     ]);

//     console.log("Stock by Brand Data:", stockByBrand); // Debug log
//     res.status(200).json({ data: stockByBrand });
//   } catch (error) {
//     console.error("Error fetching stock by brand:", error);
//     res.status(500).json({ error: "Server error", message: error.message });
//   }
// };

// const Product = require("../models/Product");
// const fs = require("fs");


// exports.addProduct = async (req, res) => {
//   try {
//     const { name, description, category, brand, variants, isMain } = req.body;

//     // Parse variants with batches
//     const parsedVariants = JSON.parse(variants).map((variant) => ({
//       size: variant.size,
//       batches: variant.batches.map((batch) => ({
//         batchNumber: batch.batchNumber,
//         costPrice: Number(batch.costPrice),
//         sellingPrice: Number(batch.sellingPrice),
//         discount: Number(batch.discount) || 0,
//         stock: Number(batch.stock) || 0,
//         gst: Number(batch.gst),
//       })),
//     }));

//     // Handle multiple images
//     const imageFiles = req.files;
//     if (!imageFiles || imageFiles.length === 0) {
//       return res.status(400).json({ error: "At least one image is required" });
//     }

//     const parsedIsMain = Array.isArray(isMain) ? isMain : [isMain];
//     const images = imageFiles.map((file, index) => ({
//       url: file.path,
//       isMain: parsedIsMain[index] === "true", // Convert string "true" to boolean
//     }));

//     // Create new product
//     const product = new Product({
//       name,
//       description,
//       category,
//       brand,
//       variants: parsedVariants,
//       images,
//     });

//     await product.save();
//     res.json({ message: "Product added successfully", product });
//   } catch (error) {
//     // Clean up uploaded files if error occurs
//     if (req.files) {
//       req.files.forEach((file) => {
//         try {
//           fs.unlinkSync(file.path);
//         } catch (err) {
//           console.error("Error deleting file:", err);
//         }
//       });
//     }
//     res.status(500).json({ error: error.message });
//   }
// };

// // Update product
// exports.updateProduct = async (req, res) => {
//   try {
//     const { 
//       name, 
//       description, 
//       category, 
//       brand, 
//       variants, 
//       batchNumber,
//       isMain 
//     } = req.body;

//     let updatedData = {
//       name,
//       description,
//       category,
//       brand,
//       batchNumber,
//       variants: JSON.parse(variants).map(variant => ({
//         size: variant.size,
//         costPrice: Number(variant.costPrice),
//         sellingPrice: Number(variant.sellingPrice),
//         discount: Number(variant.discount) || 0,
//         stock: Number(variant.stock) || 0,
//         gst: Number(variant.gst),
//       })),
//     };

//     // Handle image updates
//     if (req.files && req.files.length > 0) {
//       const product = await Product.findById(req.params.id);
//       if (product.images && product.images.length > 0) {
//         // Delete old images
//         product.images.forEach(image => {
//           if (fs.existsSync(image.url)) {
//             fs.unlinkSync(image.url);
//           }
//         });
//       }

//       const parsedIsMain = Array.isArray(isMain) ? isMain : [isMain];
//       updatedData.images = req.files.map((file, index) => ({
//         url: file.path,
//         isMain: parsedIsMain[index] === "true"
//       }));
//     }

//     const updatedProduct = await Product.findByIdAndUpdate(
//       req.params.id, 
//       updatedData, 
//       { new: true }
//     );

//     if (!updatedProduct) return res.status(404).json({ message: "Product not found" });

//     res.json({ message: "Product updated successfully", product: updatedProduct });
//   } catch (error) {
//     if (req.files) {
//       req.files.forEach(file => {
//         try {
//           fs.unlinkSync(file.path);
//         } catch (err) {
//           console.error("Error deleting file:", err);
//         }
//       });
//     }
//     res.status(500).json({ error: error.message });
//   }
// };

// // Delete Product
// exports.deleteProduct = async (req, res) => {
//   try {
//     const product = await Product.findById(req.params.id);
//     if (!product) return res.status(404).json({ message: "Product not found" });

//     // Delete all associated images
//     if (product.images && product.images.length > 0) {
//       product.images.forEach(image => {
//         if (fs.existsSync(image.url)) {
//           fs.unlinkSync(image.url);
//         }
//       });
//     }

//     await Product.findByIdAndDelete(req.params.id);
//     res.json({ message: "Product deleted successfully" });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };

// // Get All Products
// exports.getAllProducts = async (req, res) => {
//   try {
//     const products = await Product.find()
//       .populate("brand", "name")
//       .populate("category", "name");
//     res.json(products);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };

// // Get Single Product by ID
// exports.getProductById = async (req, res) => {
//   try {
//     const product = await Product.findById(req.params.id)
//       .populate("brand", "name")
//       .populate("category", "name");
//     if (!product) return res.status(404).json({ message: "Product not found" });
//     res.json(product);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };

// // Note: The other functions (getLowStockProducts, getStockData, etc.) 
// // don't need major changes unless you want to modify their output format
// // based on the new schema. They will work with the new schema as is.

// // For completeness, here's an updated getLowStockProducts:
// exports.getLowStockProducts = async (req, res) => {
//   try {
//     const lowStockProducts = await Product.find({
//       "variants.stock": { $lt: 10 },
//     })
//     .populate("brand", "name")
//     .populate("category", "name");

//     res.status(200).json(lowStockProducts);
//   } catch (error) {
//     console.error("Error fetching low stock products:", error);
//     res.status(500).json({ message: "Internal Server Error", error: error.message });
//   }
// };
// exports.getStockByBrand = async (req, res) => {
//   try {
//     const stock = await Product.aggregate([
//       { $unwind: "$variants" },
//       {
//         $group: {
//           _id: "$brand",
//           totalStock: { $sum: "$variants.stock" },
//         },
//       },
//       { $project: { brand: "$_id", totalStock: 1, _id: 0 } },
//     ]);
//     res.json({ data: stock });
//   } catch (error) {
//     res.status(500).json({ message: "Error fetching stock by brand", error });
//   }
// };
const Product = require("../models/Product");
const fs = require("fs");

exports.addProduct = async (req, res) => {
  try {
    const { name, description, category, brand, variants, isMain } = req.body;

    // Parse variants with batches
    const parsedVariants = JSON.parse(variants).map((variant) => ({
      size: variant.size,
      batches: variant.batches.map((batch) => ({
        batchNumber: batch.batchNumber,
        costPrice: Number(batch.costPrice),
        sellingPrice: Number(batch.sellingPrice),
        discount: Number(batch.discount) || 0,
        stock: Number(batch.stock) || 0,
        gst: Number(batch.gst),
      })),
    }));

    // Handle multiple images
    const imageFiles = req.files;
    if (!imageFiles || imageFiles.length === 0) {
      return res.status(400).json({ error: "At least one image is required" });
    }

    const parsedIsMain = Array.isArray(isMain) ? isMain : [isMain];
    const images = imageFiles.map((file, index) => ({
      url: file.path,
      isMain: parsedIsMain[index] === "true", // Convert string "true" to boolean
    }));

    // Create new product
    const product = new Product({
      name,
      description,
      category,
      brand,
      variants: parsedVariants,
      images,
    });

    await product.save();
    res.json({ message: "Product added successfully", product });
  } catch (error) {
    // Clean up uploaded files if error occurs
    if (req.files) {
      req.files.forEach((file) => {
        try {
          fs.unlinkSync(file.path);
        } catch (err) {
          console.error("Error deleting file:", err);
        }
      });
    }
    res.status(500).json({ error: error.message });
  }
};

// Update product
exports.updateProduct = async (req, res) => {
  try {
    const { name, description, category, brand, variants, isMain } = req.body;

    let updatedData = {
      name,
      description,
      category,
      brand,
      variants: JSON.parse(variants).map((variant) => ({
        size: variant.size,
        batches: variant.batches.map((batch) => ({
          batchNumber: batch.batchNumber,
          costPrice: Number(batch.costPrice),
          sellingPrice: Number(batch.sellingPrice),
          discount: Number(batch.discount) || 0,
          stock: Number(batch.stock) || 0,
          gst: Number(batch.gst),
        })),
      })),
    };

    // Handle image updates
    if (req.files && req.files.length > 0) {
      const product = await Product.findById(req.params.id);
      if (product.images && product.images.length > 0) {
        // Delete old images
        product.images.forEach((image) => {
          if (fs.existsSync(image.url)) {
            fs.unlinkSync(image.url);
          }
        });
      }

      const parsedIsMain = Array.isArray(isMain) ? isMain : [isMain];
      updatedData.images = req.files.map((file, index) => ({
        url: file.path,
        isMain: parsedIsMain[index] === "true",
      }));
    }

    const updatedProduct = await Product.findByIdAndUpdate(req.params.id, updatedData, {
      new: true,
    });

    if (!updatedProduct) return res.status(404).json({ message: "Product not found" });

    res.json({ message: "Product updated successfully", product: updatedProduct });
  } catch (error) {
    if (req.files) {
      req.files.forEach((file) => {
        try {
          fs.unlinkSync(file.path);
        } catch (err) {
          console.error("Error deleting file:", err);
        }
      });
    }
    res.status(500).json({ error: error.message });
  }
};

// Delete Product
exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    // Delete all associated images
    if (product.images && product.images.length > 0) {
      product.images.forEach((image) => {
        if (fs.existsSync(image.url)) {
          fs.unlinkSync(image.url);
        }
      });
    }

    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: "Product deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get All Products
exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.find()
      .populate("brand", "name")
      .populate("category", "name");
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get Single Product by ID
exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate("brand", "name")
      .populate("category", "name");
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Add Stock to a Variant
exports.addStock = async (req, res) => {
  try {
    const { productId } = req.params;
    const { variantId, batch } = req.body;

    if (!productId || !variantId || !batch || !batch.batchNumber || !batch.stock || !batch.costPrice || !batch.sellingPrice || !batch.gst) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    const variant = product.variants.id(variantId);
    if (!variant) {
      return res.status(404).json({ success: false, message: "Variant not found" });
    }

    variant.batches.push({
      batchNumber: batch.batchNumber,
      stock: batch.stock,
      costPrice: batch.costPrice,
      sellingPrice: batch.sellingPrice,
      discount: batch.discount || 0,
      gst: batch.gst,
      addedDate: new Date(),
    });

    await product.save();
    res.status(200).json({ success: true, message: "Stock added successfully", product });
  } catch (error) {
    console.error("Error adding stock:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

// Get Low Stock Products
exports.getLowStockProducts = async (req, res) => {
  try {
    // Aggregate to unwind variants and batches, filter low stock, and restructure
    const lowStockProducts = await Product.aggregate([
      { $unwind: "$variants" }, // Unwind variants array
      { $unwind: "$variants.batches" }, // Unwind batches array
      { $match: { "variants.batches.stock": { $lt: 10 } } }, // Filter batches with stock < 10
      {
        $group: {
          _id: {
            productId: "$_id",
            variantId: "$variants._id",
          },
          name: { $first: "$name" },
          description: { $first: "$description" },
          category: { $first: "$category" },
          brand: { $first: "$brand" },
          images: { $first: "$images" },
          variantSize: { $first: "$variants.size" },
          batches: {
            $push: {
              _id: "$variants.batches._id",
              batchNumber: "$variants.batches.batchNumber",
              stock: "$variants.batches.stock",
              manufacturingDate: "$variants.batches.manufacturingDate",
              expiryDate: "$variants.batches.expiryDate",
              sellingPrice: "$variants.batches.sellingPrice",
              costPrice: "$variants.batches.costPrice",
            },
          },
        },
      },
      {
        $group: {
          _id: "$_id.productId",
          name: { $first: "$name" },
          description: { $first: "$description" },
          category: { $first: "$category" },
          brand: { $first: "$brand" },
          images: { $first: "$images" },
          variants: {
            $push: {
              _id: "$_id.variantId",
              size: "$variantSize",
              batches: "$batches",
            },
          },
        },
      },
      {
        $lookup: {
          from: "categories",
          localField: "category",
          foreignField: "_id",
          as: "category",
        },
      },
      { $unwind: "$category" },
      {
        $lookup: {
          from: "vendors",
          localField: "brand",
          foreignField: "_id",
          as: "brand",
        },
      },
      { $unwind: "$brand" },
      {
        $project: {
          name: 1,
          description: 1,
          "category._id": 1,
          "category.name": 1,
          "brand._id": 1,
          "brand.name": 1,
          variants: 1,
          images: 1,
        },
      },
    ]);

    res.status(200).json(lowStockProducts);
  } catch (error) {
    console.error("Error fetching low stock products:", error);
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
};

// Get Stock by Brand
exports.getStockByBrand = async (req, res) => {
  try {
    const stock = await Product.aggregate([
      { $unwind: "$variants" }, // Unwind variants array
      { $unwind: "$variants.batches" }, // Unwind batches array
      {
        $group: {
          _id: "$brand",
          totalStock: { $sum: "$variants.batches.stock" }, // Sum stock from batches
        },
      },
      {
        $lookup: {
          from: "vendors",
          localField: "_id",
          foreignField: "_id",
          as: "brand",
        },
      },
      { $unwind: "$brand" },
      {
        $project: {
          brand: "$brand.name",
          totalStock: 1,
          _id: 0,
        },
      },
    ]);
    res.json({ data: stock });
  } catch (error) {
    res.status(500).json({ message: "Error fetching stock by brand", error: error.message });
  }
};

// const listProducts = async (req, res) => {
//   try {
//     const products = await Product.find().populate("category brand");
//     res.status(200).json(products);
//   } catch (error) {
//     console.error("Error fetching products:", error);
//     res.status(500).json({ success: false, message: "Failed to fetch products" });
//   }
// };

// const addStock = async (req, res) => {
//   try {
//     const { productId } = req.params;
//     const { variantId, batch } = req.body;

//     if (!productId || !variantId || !batch || !batch.batchNumber || !batch.stock || !batch.costPrice || !batch.sellingPrice || !batch.gst) {
//       return res.status(400).json({ success: false, message: "All fields are required" });
//     }

//     const product = await Product.findById(productId);
//     if (!product) {
//       return res.status(404).json({ success: false, message: "Product not found" });
//     }

//     const variant = product.variants.id(variantId);
//     if (!variant) {
//       return res.status(404).json({ success: false, message: "Variant not found" });
//     }

//     variant.batches.push({
//       batchNumber: batch.batchNumber,
//       stock: batch.stock,
//       costPrice: batch.costPrice,
//       sellingPrice: batch.sellingPrice,
//       discount: batch.discount || 0,
//       gst: batch.gst,
//       addedDate: new Date(),
//     });

//     await product.save();
//     res.status(200).json({ success: true, message: "Stock added successfully", product });
//   } catch (error) {
//     console.error("Error adding stock:", error);
//     res.status(500).json({ success: false, message: "Internal Server Error" });
//   }
// };
exports.addStock = async (req, res) => {
  try {
    const { productId } = req.params;
    const { variantId, batch } = req.body;

    if (!productId || !variantId || !batch || !batch.batchNumber || !batch.stock || !batch.costPrice || !batch.sellingPrice || !batch.gst) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    const variant = product.variants.id(variantId);
    if (!variant) {
      return res.status(404).json({ success: false, message: "Variant not found" });
    }

    variant.batches.push({
      batchNumber: batch.batchNumber,
      stock: batch.stock,
      costPrice: batch.costPrice,
      sellingPrice: batch.sellingPrice,
      discount: batch.discount || 0,
      gst: batch.gst,
      addedDate: new Date(),
    });

    await product.save();
    res.status(200).json({ success: true, message: "Stock added successfully", product });
  } catch (error) {
    console.error("Error adding stock:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};
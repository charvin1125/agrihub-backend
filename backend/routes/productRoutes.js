// const express = require("express");
// const multer = require("multer");
// const Product = require("../models/Product");

// const router = express.Router();

// // Image Upload (Optional)
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, "uploads/"); // Save images in the `uploads` folder
//   },
//   filename: (req, file, cb) => {
//     cb(null, Date.now() + path.extname(file.originalname)); // Unique filename
//   },
// });

// const fileFilter = (req, file, cb) => {
//   if (file.mimetype.startsWith("image/")) {
//     cb(null, true);
//   } else {
//     cb(new Error("Only image files are allowed!"), false);
//   }
// };

// const upload = multer({ storage , fileFilter});

// // ✅ Add Product
// router.post("/add", upload.single("image"), async (req, res) => {
//   try {
//     const { name, description, price, category, variants, stock } = req.body;
    
//     const product = new Product({
//       name,
//       description,
//       price,
//       category,
//       variants: JSON.parse(variants),
//       image: req.file ? req.file.path : null,
//       stock,
//     });

//     await product.save();
//     res.status(201).json({ message: "Product added successfully", product });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });

// // ✅ Get All Products
// router.get("/", async (req, res) => {
//   try {
//     const products = await Product.find();
//     res.json(products);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });

// // ✅ Get Single Product by ID
// router.get("/:id", async (req, res) => {
//   try {
//     const product = await Product.findById(req.params.id);
//     if (!product) return res.status(404).json({ message: "Product not found" });
//     res.json(product);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });

// module.exports = router;
// const express = require("express");
// const multer = require("multer");
// const path = require("path");
// const productController = require("../controllers/productController");

// const router = express.Router();

// // ✅ Image Upload Configuration
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, "uploads/"); // Store images in uploads folder
//   },
//   filename: (req, file, cb) => {
//     cb(null, Date.now() + path.extname(file.originalname)); // Unique filename
//   },
// });

// const fileFilter = (req, file, cb) => {
//   if (file.mimetype.startsWith("image/")) {
//     cb(null, true);
//   } else {
//     cb(new Error("Only image files are allowed!"), false);
//   }
// };

// const upload = multer({ storage, fileFilter });

// // ✅ Product Routes
// router.post("/add", upload.single("image"), productController.addProduct);
// router.get("/list", productController.getAllProducts);
// router.get("/:id", productController.getProductById);
// router.put("/update/:id", upload.single("image"), productController.updateProduct);
// router.delete("/delete/:id", productController.deleteProduct);

// module.exports = router;
// const express = require("express");
// const multer = require("multer");
// const path = require("path");
// const productController = require("../controllers/productController");

// const router = express.Router();

// // ✅ Image Upload Configuration
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, "uploads/"); // Store images in uploads folder
//   },
//   filename: (req, file, cb) => {
//     cb(null, Date.now() + path.extname(file.originalname)); // Unique filename
//   },
// });

// const fileFilter = (req, file, cb) => {
//   if (file.mimetype.startsWith("image/")) {
//     cb(null, true);
//   } else {
//     cb(new Error("Only image files are allowed!"), false);
//   }
// };

// const upload = multer({ storage, fileFilter });

// // ✅ Product Routes
// router.post("/add", upload.single("image"), productController.addProduct);
// router.get("/list", productController.getAllProducts);
// router.get("/:id", productController.getProductById);
// router.put("/update/:id", upload.single("image"), productController.updateProduct);
// router.delete("/delete/:id", productController.deleteProduct);

// module.exports = router;
const express = require("express");
const multer = require("multer");
const path = require("path");
const productController = require("../controllers/productController");
const { isAuthenticated, isAdmin } = require("../middlewares/auth");

const router = express.Router();

// ✅ Image Upload Configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Store images in uploads folder
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Unique filename
  },
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Only image files are allowed!"), false);
  }
};

const upload = multer({ storage, fileFilter });

// ✅ Product Routes
router.post("/add", isAuthenticated, isAdmin, upload.single("image"), productController.addProduct);
router.get("/list", productController.getProducts);

router.put("/update/:id", isAuthenticated, isAdmin, upload.single("image"), productController.updateProduct);
router.delete("/delete/:id", isAuthenticated, isAdmin, productController.deleteProduct);
router.get("/low-stock", isAuthenticated, isAdmin, productController.getLowStockProducts);
router.get("/:id", productController.getProductById);
router.put("/:id/update-stock", isAuthenticated, isAdmin, productController.updateStock);
router.get("/stock", productController.getStockData);
router.get("/stock-by-vendor",isAdmin,productController.getStockByVendor)
// router.get("/product/:id", productController.getProductById);
// router.get("/category/list", categoryController.getCategories);
module.exports = router;

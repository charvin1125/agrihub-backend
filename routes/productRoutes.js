const express = require("express");
const multer = require("multer");
const path = require("path");
const productController = require("../controllers/productController");
const { isAuthenticated, isAdmin } = require("../middlewares/auth");

const router = express.Router();

// Image Upload Configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Only image files are allowed!"), false);
  }
};

const upload = multer({ 
  storage, 
  fileFilter,
  limits: {
    files: 5,
    fileSize: 5 * 1024 * 1024
  }
});

// Product Routes
router.post(
  "/add", 
  isAuthenticated, 
  isAdmin, 
  upload.array("images"), 
  productController.addProduct
);

router.put(
  "/update/:id", 
  isAuthenticated, 
  isAdmin, 
  upload.array("images"), 
  productController.updateProduct
);

// Fixed this line: Changed getProducts to getAllProducts
router.get("/list", productController.getAllProducts);
router.delete("/delete/:id", isAuthenticated, isAdmin, productController.deleteProduct);
router.get("/low-stock", isAuthenticated, isAdmin, productController.getLowStockProducts);
// router.put("/:id/update-stock", isAuthenticated, isAdmin, productController.updateStock);
// router.get("/stock", productController.getStockData);
router.get("/stock-by-brand", productController.getStockByBrand);
router.get("/:id", productController.getProductById);
router.put("/:productId/add-stock", productController.addStock);
module.exports = router;  
// const express = require("express");
// const router = express.Router();
// const { addProduct, getProducts } = require("../controllers/productController");

// // Route to add a new product
// router.post("/add", addProduct);

// // Route to get all products
// router.get("/list", getProducts);

// module.exports = router;
//after add new fields 
// const express = require("express");
// const router = express.Router();
// const { addProduct, getProducts} = require("../controllers/productController");

// // Route to add a new product with an image
// router.post("/add", addProduct);

// // Route to get all products
// router.get("/list", getProducts);

// module.exports = router;
// after the crud
// const express = require("express");
// const router = express.Router();
// const productController = require("../controllers/productController");
// const upload = require("../middlewares/upload"); // Middleware for image upload

// // Add Product
// router.post("/add", upload.single("image"), productController.addProduct);

// // Get All Products
// router.get("/list", productController.getAllProducts);

// // Get Single Product
// router.get("/:id", productController.getProductById);

// module.exports = router;

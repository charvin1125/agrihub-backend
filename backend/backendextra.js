// const Product = require("../models/Product");

// // Add a new product
// const addProduct = async (req, res) => {
//   const { name, price, quantity, vendor, category } = req.body; // Vendor is the ID
//   try {
//     const product = new Product({ name, price, quantity, vendor, category  });
//     await product.save();
//     res.status(201).json({ message: "Product added successfully", product });
//   } catch (error) {
//     res.status(400).json({ error: error.message });
//   }
// };

// // Get all products (with vendor details)
// // const getProducts = async (req, res) => {
// //   try {
// //     const products = await Product.find().populate("vendor"); // Populate vendor details
// //     res.status(200).json(products);
// //   } catch (error) {
// //     res.status(400).json({ error: error.message });
// //   }
// // };
// const getProducts = async (req, res) => {
//   try {
//     const products = await Product.find()
//       .populate("vendor") // Populate vendor details
//       .populate("category"); // Populate category details
//     res.status(200).json(products);
//   } catch (error) {
//     res.status(400).json({ error: error.message });
//   }
// };

// module.exports = {
//   addProduct,
//   getProducts,
// };
//after add new fields
// const multer = require("multer");
// const path = require("path");
// const Product = require("../models/Product");

// // Configure multer for file uploads
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     const uploadPath = path.join(__dirname, "../uploads");
//     cb(null, uploadPath);
//   },
//   filename: (req, file, cb) => {
//     const uniqueName = `${Date.now()}-${file.originalname}`;
//     cb(null, uniqueName);
//   },
// });

// const upload = multer({ storage });

// // Add a new product with an image
// const addProduct = async (req, res) => {
//   const { name, price, quantity, vendor, category, description, type, variants } = req.body;
//   const productImage = req.file ? req.file.filename : null;

//   try {
//     const product = new Product({
//       name,
//       price,
//       quantity,
//       vendor,
//       category,
//       description,
//       type,
//       variants,
//       image: productImage,
//     });
//     await product.save();
//     res.status(201).json({ message: "Product added successfully", product });
//   } catch (error) {
//     res.status(400).json({ error: error.message });
//   }
// };

// const getProducts = async (req, res) => {
//     try {
//       const products = await Product.find()
//         .populate("vendor") // Populate vendor details
//         .populate("category"); // Populate category details
//       res.status(200).json(products);
//     } catch (error) {
//       res.status(400).json({ error: error.message });
//     }
//   };

// module.exports = {
//   addProduct: [upload.single("image"), addProduct], // Middleware to handle file upload
//   getProducts,
// };

// // Login a user
// exports.loginUser = async (req, res) => {
//   try {
//     const { username, password } = req.body;

//     const user = await User.findOne({ username });

//     if (!user || user.password !== password) {
//       return res.status(401).json({ message: "Invalid username or password" });
//     }

//     res.status(200).json({ message: "Login successful", user });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };
// exports.loginUser = async (req, res) => {
//   try {
//     const { username, password } = req.body;

//     const user = await User.findOne({ username });

//     if (!user || user.password !== password) {
//       return res.status(401).json({ message: "Invalid username or password" });
//     }

//     // Send user details including isAdmin status
//     res.status(200).json({ message: "Login successful", user });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };


// const isAuthenticated = async (req, res, next) => {
//   const token = req.header("Authorization")?.split(" ")[1];

//   if (!token) {
//     return res.status(401).json({ message: "Access denied, no token provided" });
//   }

//   try {
//     const decoded = jwt.verify(token, "your_jwt_secret"); // Replace with your secret key
//     req.user = await User.findById(decoded.id).select("-password");
//     next();
//   } catch (error) {
//     res.status(400).json({ message: "Invalid token" });
//   }
// };
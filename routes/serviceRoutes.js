const express = require("express");
const router = express.Router();
const {
  addService,
  listServices,
  updateService,
  deleteService,
} = require("../controllers/ServiceController"); // Adjust path if needed
const { isAuthenticated, isAdmin } = require("../middlewares/auth");
const multer = require("multer"); // Import multer
const path = require("path");

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: "./uploads/", // Ensure this directory exists
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});
const upload = multer({ storage: storage }); // Define upload middleware
const uploadMiddleware = upload.single("image"); // Single file upload for 'image' field

// Routes
router.get("/list",  listServices);
router.post("/add", isAuthenticated, isAdmin, uploadMiddleware, addService);
router.put("/update/:id", isAuthenticated, isAdmin, uploadMiddleware, updateService);
router.delete("/delete/:id", isAuthenticated, isAdmin, deleteService);

module.exports = router;
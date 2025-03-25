const express = require("express");
const router = express.Router();
const { addVendor, getVendors, updateVendor, deleteVendor } = require("../controllers/vendorController");
const { isAdmin, isAuthenticated } = require("../middlewares/auth");

router.post("/add", isAuthenticated, isAdmin, addVendor);
router.get("/list", getVendors);
router.put("/:id", isAuthenticated, isAdmin, updateVendor);
router.delete("/:id", isAuthenticated, isAdmin, deleteVendor);

module.exports = router;

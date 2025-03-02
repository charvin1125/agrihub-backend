const express = require("express");
const router = express.Router();
const { addCategory, getCategories, updateCategory, deleteCategory } = require("../controllers/categoryController");
const { isAuthenticated, isAdmin } = require("../middlewares/auth");


router.post("/add", isAuthenticated, isAdmin, addCategory);

router.get("/list", getCategories);

router.put("/:id", isAuthenticated, isAdmin, updateCategory);

router.delete("/:id", isAuthenticated, isAdmin, deleteCategory);

module.exports = router;

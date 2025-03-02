// Routes/laborRoutes.js
const express = require("express");
const router = express.Router();
const { listLabors } = require("../controllers/LaborController");
const { isAuthenticated, isAdmin } = require("../middlewares/auth");

router.get("/list", isAuthenticated, isAdmin, listLabors);

module.exports = router;
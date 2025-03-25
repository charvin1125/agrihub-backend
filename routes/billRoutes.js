const express = require("express");
const router = express.Router();
const { getUserBills, getBillById } = require("../controllers/billController");

router.get("/list", getUserBills);
router.get("/:id", getBillById); 

module.exports = router;

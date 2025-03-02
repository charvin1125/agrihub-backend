const express = require("express");
const { getCart, addToCart, removeFromCart, clearCart } = require("../controllers/cartController");
const { isAuthenticated} = require("../middlewares/auth");
const router = express.Router();

router.get("/", isAuthenticated,getCart);
router.post("/add",  isAuthenticated,addToCart);
router.delete("/remove/:productId",  isAuthenticated,removeFromCart);
router.delete("/clear",  isAuthenticated,clearCart);

module.exports = router;

// const express = require("express");
// const {
//   registerUser,
//   loginUser,
//   getUserProfile,
//   logoutUser,
//   changePassword,
// } = require("../controllers/userController");
// const { isAuthenticated } = require("../middlewares/auth");
// const { getUserDetails } = require("../controllers/userController");
// const router = express.Router();
// router.get("/me", isAuthenticated, getUserDetails);
// router.post("/register", registerUser);
// router.post("/login", loginUser);
// router.get("/profile", isAuthenticated, getUserProfile);
// router.post("/logout", isAuthenticated, logoutUser);
// router.put("/change-password", isAuthenticated, changePassword);
// module.exports = router;
// const express = require("express");
// const {
//   registerUser,
//   loginUser,
//   getUserProfile,
//   logoutUser,
//   changePassword,
//   forgotPassword,
// } = require("../controllers/userController");
// const { isAuthenticated, isAdmin } = require("../middlewares/auth");
// const { getUserDetails } = require("../controllers/userController");
// const router = express.Router();

// router.get("/me", isAuthenticated, getUserDetails);
// router.post("/register", registerUser);
// router.post("/login", loginUser);
// router.get("/profile", isAuthenticated, getUserProfile);
// router.post("/logout", isAuthenticated, isAdmin,logoutUser);
// router.put("/change-password", isAuthenticated, changePassword);
// router.post("/forgot-password", forgotPassword);
// module.exports = router;

const express = require("express");
const {
  registerUser,
  loginUser,
  getUserProfile,
  logoutUser,
  changePassword,
  forgotPassword,
  getUserDetails,
  getAllCustomers,
  deleteCustomer,
  // getUserById,
  // addToWishlist,
  // removeFromWishlist,
  // getWishlist,
} = require("../controllers/userController");
const { isAuthenticated, isAdmin } = require("../middlewares/auth");
const router = express.Router();

router.get("/me", isAuthenticated, getUserDetails);
router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/profile", isAuthenticated, getUserProfile);
router.post("/logout", isAuthenticated, logoutUser); // Remove isAdmin here
router.put("/change-password", isAuthenticated, changePassword);
router.post("/forgot-password", forgotPassword);
router.get("/customers",getAllCustomers);
router.delete("/users/:id", deleteCustomer);
// router.get("/:userId", getUserById);
// router.post("/wishlist/add", addToWishlist);
// router.post("/wishlist/remove", removeFromWishlist);
// router.get("/wishlist", getWishlist);
module.exports = router;
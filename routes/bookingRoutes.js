const express = require("express");
const router = express.Router();
const { bookService, getAllBookings, approveBooking,getUserBookings } = require("../controllers/BookingController");
const { isAuthenticated, isAdmin } = require("../middlewares/auth");

router.post("/book-service", isAuthenticated, bookService);
router.get("/all", isAuthenticated, isAdmin, getAllBookings);
router.put("/approve/:id", isAuthenticated, isAdmin, approveBooking);
router.get("/my-bookings", isAuthenticated, getUserBookings);

module.exports = router;
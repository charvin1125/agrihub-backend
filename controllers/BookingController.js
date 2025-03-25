const Booking = require("../models/Booking");
const Labor = require("../models/Labor");

exports.bookService = async (req, res) => {
  try {
    const userId = req.session?.user?.id || req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized. Please log in." });
    }

    const {
      serviceId,
      serviceName,
      customerName,
      contactNumber,
      crop,
      medicineName,
      areaInSqFt,
      farmAddress,
      pincode,
      problem,          
      expectedDate,   
      remarks,         
      totalPrice,
    } = req.body;

    // Validate all required fields
    if (
      !serviceId ||
      !serviceName ||
      !customerName ||
      !contactNumber ||
      !crop ||
      !medicineName ||
      !areaInSqFt ||
      !farmAddress ||
      !pincode ||
      !problem ||       
      !expectedDate ||  
      totalPrice === undefined
    ) {
      return res.status(400).json({ message: "All required fields must be provided" });
    }

    const booking = new Booking({
      userId,
      serviceId,
      serviceName,
      customerName,
      contactNumber,
      crop,
      medicineName,
      areaInSqFt,
      farmAddress,
      pincode,
      problem,         
      expectedDate,   
      remarks,          
      totalPrice,
    });

    await booking.save();
    res.json({ bookingId: booking._id });
  } catch (error) {
    console.error("Booking Error:", error);
    res.status(500).json({ message: "Failed to book service", error: error.message });
  }
};

exports.getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate("userId", "name")
      .populate("laborId", "name");
    res.json(bookings);
  } catch (error) {
    console.error("Error fetching bookings:", error);
    res.status(500).json({ message: "Failed to fetch bookings" });
  }
};

exports.approveBooking = async (req, res) => {
  try {
    const { laborId, serviceDate } = req.body;
    console.log("Approve Request:", { id: req.params.id, laborId, serviceDate });
    if (!laborId || !serviceDate) {
      return res.status(400).json({ message: "Labor ID and service date are required" });
    }

    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { laborId, serviceDate, status: "Approved" },
      { new: true }
    ).populate("laborId", "name");
    if (!booking) {
      console.log("Booking not found for ID:", req.params.id);
      return res.status(404).json({ message: "Booking not found" });
    }

    const labor = await Labor.findByIdAndUpdate(laborId, { availability: false }, { new: true });
    if (!labor) {
      console.log("Labor not found for ID:", laborId);
      return res.status(404).json({ message: "Labor not found" });
    }

    console.log("Booking Approved:", booking);
    res.json({
      message: "Booking approved",
      booking: {
        ...booking.toObject(),
        laborName: labor.name,
      },
    });
  } catch (error) {
    console.error("Error approving booking:", error);
    res.status(500).json({ message: "Failed to approve booking", error: error.message });
  }
};

exports.getUserBookings = async (req, res) => {
  try {
    const userId = req.session?.user?.id || req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized. Please log in." });
    }

    const bookings = await Booking.find({ userId }).populate("laborId", "name mobile");
    res.json(bookings);
  } catch (error) {
    console.error("Error fetching user bookings:", error);
    res.status(500).json({ message: "Failed to fetch bookings" });
  }
};
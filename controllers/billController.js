const Bill = require("../models/Bill");
const Order = require("../models/Order");

exports.getUserBills = async (req, res) => {
  try {
    if (!req.session.user || !req.session.user.id) {
      return res.status(401).json({ error: "Unauthorized. Please log in." });
    }

    const userId = req.session.user.id;

    // Fetch all bills for the logged-in user, sorted from latest to oldest
    const bills = await Bill.find({ userId }).sort({ date: -1 });

    if (bills.length === 0) {
      return res.status(404).json({ message: "No previous bills found." });
    }

    res.json(bills);
  } catch (error) {
    console.error("Error fetching user bills:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};


exports.getBillById = async (req, res) => {
  try {
    const { id } = req.params;

    const bill = await Bill.findOne({ billId: id });

    if (!bill) {
      return res.status(404).json({ message: "Bill not found." });
    }

    const order = await Order.findOne({ orderId: bill.orderId }).populate("products");

    res.json({
      ...bill.toObject(),
      products: order ? order.products : [],
      dues: bill.dues, // ✅ Ensure dues is included in the response
    });

  } catch (error) {
    console.error("Error fetching bill details:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};


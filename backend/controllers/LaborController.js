// Controllers/LaborController.js
const Labor = require("../models/Labor");

exports.listLabors = async (req, res) => {
  try {
    const labors = await Labor.find();
    res.json(labors);
  } catch (error) {
    console.error("Error fetching labors:", error);
    res.status(500).json({ message: "Failed to fetch labors" });
  }
};
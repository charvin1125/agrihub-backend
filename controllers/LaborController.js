const Labor = require("../models/Labor");

// List all labors
exports.listLabors = async (req, res) => {
  try {
    const labors = await Labor.find();
    res.json(labors);
  } catch (error) {
    console.error("Error fetching labors:", error.message);
    res.status(500).json({ message: "Failed to fetch labors", error: error.message });
  }
};

// Add a new labor
exports.addLabor = async (req, res) => {
  try {
    const { name, mobile, availability } = req.body;

    // Validate required fields
    if (!name || !mobile) {
      return res.status(400).json({ message: "Name and mobile number are required" });
    }

    // Create new labor entry
    const newLabor = new Labor({
      name,
      mobile,
      availability: availability !== undefined ? availability : true, // Default to true if not provided
    });

    await newLabor.save();
    res.status(201).json({ message: "Labor added successfully", labor: newLabor });
  } catch (error) {
    console.error("Error adding labor:", error.message);
    if (error.code === 11000) {
      return res.status(400).json({ message: "Mobile number already exists" });
    }
    if (error.name === "ValidationError") {
      return res.status(400).json({ message: error.message });
    }
    res.status(500).json({ message: "Failed to add labor", error: error.message });
  }
};

// Edit an existing labor
exports.editLabor = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, mobile, availability } = req.body;

    // Validate required fields
    if (!name || !mobile) {
      return res.status(400).json({ message: "Name and mobile number are required" });
    }

    // Find and update labor
    const updatedLabor = await Labor.findByIdAndUpdate(
      id,
      { name, mobile, availability },
      { new: true, runValidators: true } // Return updated doc and run schema validators
    );

    if (!updatedLabor) {
      return res.status(404).json({ message: "Labor not found" });
    }

    res.json({ message: "Labor updated successfully", labor: updatedLabor });
  } catch (error) {
    console.error("Error editing labor:", error.message);
    if (error.code === 11000) {
      return res.status(400).json({ message: "Mobile number already exists" });
    }
    if (error.name === "ValidationError") {
      return res.status(400).json({ message: error.message });
    }
    res.status(500).json({ message: "Failed to edit labor", error: error.message });
  }
};

// Delete a labor
exports.deleteLabor = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedLabor = await Labor.findByIdAndDelete(id);
    if (!deletedLabor) {
      return res.status(404).json({ message: "Labor not found" });
    }

    res.json({ message: "Labor deleted successfully" });
  } catch (error) {
    console.error("Error deleting labor:", error.message);
    res.status(500).json({ message: "Failed to delete labor", error: error.message });
  }
};

module.exports = exports;
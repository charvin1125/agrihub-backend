const Vendor = require("../models/Vendor");

// Add a new vendor
const addVendor = async (req, res) => {
  const { name, email, phone, address } = req.body;
  try {
    const vendor = new Vendor({ name, email, phone, address });
    await vendor.save();
    res.status(201).json({ message: "Vendor added successfully", vendor });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get all vendors
const getVendors = async (req, res) => {
  try {
    const vendors = await Vendor.find();
    res.status(200).json(vendors);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = {
  addVendor,
  getVendors,
};
const updateVendor = async (req, res) => {
  const { id } = req.params;
  const { name, email, phone, address } = req.body;
  try {
    const updatedVendor = await Vendor.findByIdAndUpdate(
      id,
      { name, email, phone, address },
      { new: true } // Return the updated document
    );
    if (!updatedVendor) throw new Error("Vendor not found");
    res.status(200).json({ message: "Vendor updated successfully", updatedVendor });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete a vendor
const deleteVendor = async (req, res) => {
  const { id } = req.params;
  try {
    const deletedVendor = await Vendor.findByIdAndDelete(id);
    if (!deletedVendor) throw new Error("Vendor not found");
    res.status(200).json({ message: "Vendor deleted successfully" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = {
  addVendor,
  getVendors,
  updateVendor,
  deleteVendor,
};
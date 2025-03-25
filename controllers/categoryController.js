const Category = require("../models/Category");

// Add a new category
const addCategory = async (req, res) => {
  const { name, description } = req.body;
  try {
    const category = new Category({ name, description });
    await category.save();
    res.status(201).json({ message: "Category added successfully", category });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get all categories
const getCategories = async (req, res) => {
  try {
    const categories = await Category.find();
    res.status(200).json(categories);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const updateCategory = async (req, res) => {
  const { id } = req.params;
  const { name, description } = req.body;
  try {
    const updatedCategory = await Category.findByIdAndUpdate(
      id,
      { name, description },
      { new: true }
    );
    if (!updatedCategory) throw new Error("Category not found");
    res.status(200).json({ message: "Category updated successfully", updatedCategory });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete a category
const deleteCategory = async (req, res) => {
  const { id } = req.params;
  try {
    const deletedCategory = await Category.findByIdAndDelete(id);
    if (!deletedCategory) throw new Error("Category not found");
    res.status(200).json({ message: "Category deleted successfully" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
module.exports = {
  addCategory,
  getCategories,
  updateCategory,
  deleteCategory,
};

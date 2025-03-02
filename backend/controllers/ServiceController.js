const Service = require("../models/Service");
const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: "./uploads/",
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`),
});
const upload = multer({ storage });

exports.addService = async (req, res) => {
  try {
    const { name, description, pricePer100SqFt } = req.body;
    const image = req.file ? req.file.path : null;
    const service = new Service({ name, description, pricePer100SqFt, image });
    await service.save();
    res.status(201).json(service);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.listServices = async (req, res) => {
  try {
    const services = await Service.find();
    res.json(services);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateService = async (req, res) => {
  try {
    const { name, description, pricePer100SqFt } = req.body;
    const image = req.file ? req.file.path : undefined;
    const updateData = { name, description, pricePer100SqFt };
    if (image) updateData.image = image;
    const service = await Service.findByIdAndUpdate(req.params.id, updateData, { new: true });
    res.json(service);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteService = async (req, res) => {
  try {
    await Service.findByIdAndDelete(req.params.id);
    res.json({ message: "Service deleted" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
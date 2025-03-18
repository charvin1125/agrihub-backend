const validateCropPlan = (req, res, next) => {
    const { cropName, plantingDate, area } = req.body;
  
    if (!cropName || !plantingDate || !area) {
      return res.status(400).json({ error: "All fields (cropName, plantingDate, area) are required" });
    }
  
    if (isNaN(parseFloat(area)) || parseFloat(area) <= 0) {
      return res.status(400).json({ error: "Area must be a positive number" });
    }
  
    // Basic date validation
    const date = new Date(plantingDate);
    if (isNaN(date.getTime())) {
      return res.status(400).json({ error: "Invalid planting date" });
    }
  
    next();
  };
  
  module.exports = validateCropPlan;
// routes/laborRoutes.js
const express = require("express");
const router = express.Router();
const { listLabors, addLabor, editLabor, deleteLabor } = require("../controllers/LaborController");

router.get("/list", listLabors);         // GET /api/labor/list
router.post("/add", addLabor);           // POST /api/labor/add
router.put("/edit/:id", editLabor);      // PUT /api/labor/edit/:id
router.delete("/delete/:id", deleteLabor); // DELETE /api/labor/delete/:id

module.exports = router;
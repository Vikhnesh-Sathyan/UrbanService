const express = require("express");

const {
  predictService,
} = require("../Controllers/MLController");

const router = express.Router();


// =====================================================
// SMART SERVICE ASSISTANT ROUTE
// React → Node → Python ML API
// =====================================================

router.post("/predict", predictService);


module.exports = router;
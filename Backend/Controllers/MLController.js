const axios = require("axios");

// =====================================================
// SMART SERVICE ASSISTANT
// Sends customer problem to Python ML API
// and returns the prediction to React
// =====================================================

const predictService = async (req, res) => {
  try {
    // -------------------------------------------------
    // 1. Get customer's problem from request
    // -------------------------------------------------

    const { problem_description } = req.body;

    if (!problem_description || !problem_description.trim()) {
      return res.status(400).json({
        success: false,
        message: "Problem description is required",
      });
    }


    // -------------------------------------------------
    // 2. Send problem to Python ML API
    // Python API runs on port 5001
    // -------------------------------------------------

    const response = await axios.post(
      "http://localhost:5001/predict",
      {
        problem_description: problem_description.trim(),
      }
    );


    // -------------------------------------------------
    // 3. Return ML prediction to React
    // -------------------------------------------------

    return res.status(200).json(response.data);

  } catch (error) {
    console.error(
      "ML prediction error:",
      error.response?.data || error.message
    );

    return res.status(500).json({
      success: false,
      message: "Unable to generate service prediction",
    });
  }
};


// =====================================================
// Export controller
// =====================================================

module.exports = {
  predictService,
};
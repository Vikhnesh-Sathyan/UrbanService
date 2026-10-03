import axios from "axios";

// =====================================================
// SMART SERVICE ASSISTANT
// Connects React with Node ML API
// =====================================================

const API = "http://localhost:5000/api/ml";


// =====================================================
// Send customer problem for ML prediction
// React → Node → Python → ML models
// =====================================================

export const predictService = async (problemDescription) => {
  const response = await axios.post(`${API}/predict`, {
    problem_description: problemDescription,
  });

  return response.data;
};
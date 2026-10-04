import axios from "axios";

// =====================================================
// SMART SERVICE ASSISTANT
// Connects React with Node ML API
// =====================================================

const API = "https://urbanservice-backend-x1op.onrender.com/api/ml";

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
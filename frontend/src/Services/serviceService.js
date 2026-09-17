//It contains functions for adding, fetching, updating, deleting, and resubmitting services.

import axios from "axios";

const API = "http://localhost:5000/api/services";

const getAuthConfig = () => {
  const token = localStorage.getItem("token");

  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

// Get logged-in provider's services
export const getMyServices = async () => {
  const response = await axios.get(
    `${API}/my-services`,
    getAuthConfig()
  );

  console.log("GET MY SERVICES RESPONSE:", response.data);

  if (Array.isArray(response.data)) {
    return response.data;
  }

  if (Array.isArray(response.data?.services)) {
    return response.data.services;
  }

  return [];
};

// Get all active categories
export const getServiceCategories = async () => {
  const response = await axios.get(
    "http://localhost:5000/api/categories"
  );

  return response.data;
};

// Get subcategories for a selected category
export const getServiceSubCategories = async (
  categoryId
) => {
  const response = await axios.get(
    `http://localhost:5000/api/categories/${categoryId}/subcategories`
  );

  return response.data;
};

// Add service
export const addService = async (formData) => {
  const response = await axios.post(
    `${API}/add`,
    formData,
    getAuthConfig()
  );

  return response.data;
};

// Update service
export const updateService = async (serviceId, formData) => {
  const response = await axios.put(
    `${API}/${serviceId}`,
    formData,
    getAuthConfig()
  );

  return response.data;
};

// Delete service
export const deleteService = async (serviceId) => {
  const response = await axios.delete(
    `${API}/${serviceId}`,
    getAuthConfig()
  );

  return response.data;
};

// Resubmit service after admin requested changes
export const resubmitService = async (serviceId) => {
  const response = await axios.patch(
    `${API}/${serviceId}/resubmit`,
    {},
    getAuthConfig()
  );

  return response.data;
};

// ==========================================
// ADMIN: CREATE CATEGORY
// ==========================================

export const createCategory = async (name) => {
  const response = await axios.post(
    "http://localhost:5000/api/categories",
    { name },
    getAuthConfig()
  );

  return response.data;
};


// ==========================================
// ADMIN: ADD SUBCATEGORY
// ==========================================

export const addSubCategory = async (
  categoryId,
  name
) => {
  const response = await axios.post(
    `http://localhost:5000/api/categories/${categoryId}/subcategories`,
    { name },
    getAuthConfig()
  );

  return response.data;
};

// ==========================================
// ADMIN: DELETE CATEGORY
// ==========================================

export const deleteCategory = async (
  categoryId
) => {
  const response = await axios.delete(
    `http://localhost:5000/api/categories/${categoryId}`,
    getAuthConfig()
  );

  return response.data;
};


// ==========================================
// ADMIN: DELETE SUBCATEGORY
// ==========================================

export const deleteSubCategory = async (
  categoryId,
  subCategoryId
) => {
  const response = await axios.delete(
    `http://localhost:5000/api/categories/${categoryId}/subcategories/${subCategoryId}`,
    getAuthConfig()
  );

  return response.data;
};
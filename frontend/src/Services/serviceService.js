// It contains functions for adding, fetching, updating,
// deleting, and resubmitting services.

import axios from "axios";

const API = "http://localhost:5000/api/services";

const CATEGORY_API =
  "http://localhost:5000/api/categories";


// ==========================================
// AUTH CONFIG
// Used for protected API requests
// ==========================================

const getAuthConfig = () => {
  const token = localStorage.getItem("token");

  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};


// ==========================================
// PROVIDER: GET MY SERVICES
// ==========================================

export const getMyServices = async () => {
  const response = await axios.get(
    `${API}/my-services`,
    getAuthConfig()
  );

  console.log(
    "GET MY SERVICES RESPONSE:",
    response.data
  );

  if (Array.isArray(response.data)) {
    return response.data;
  }

  if (Array.isArray(response.data?.services)) {
    return response.data.services;
  }

  return [];
};


// ==========================================
// GET ALL ACTIVE CATEGORIES
// Used by provider when adding a service
// ==========================================

export const getServiceCategories = async () => {
  const response = await axios.get(
    CATEGORY_API
  );

  return response.data;
};


// ==========================================
// GET SUBCATEGORIES
// Gets subcategories for selected category
// ==========================================

export const getServiceSubCategories = async (
  categoryId
) => {
  const response = await axios.get(
    `${CATEGORY_API}/${categoryId}/subcategories`
  );

  return response.data;
};


// ==========================================
// ADD SERVICE
// ==========================================

export const addService = async (formData) => {
  const response = await axios.post(
    `${API}/add`,
    formData,
    getAuthConfig()
  );

  return response.data;
};


// ==========================================
// UPDATE SERVICE
// ==========================================

export const updateService = async (
  serviceId,
  formData
) => {
  const response = await axios.put(
    `${API}/${serviceId}`,
    formData,
    getAuthConfig()
  );

  return response.data;
};


// ==========================================
// DELETE SERVICE
// ==========================================

export const deleteService = async (
  serviceId
) => {
  const response = await axios.delete(
    `${API}/${serviceId}`,
    getAuthConfig()
  );

  return response.data;
};


// ==========================================
// RESUBMIT SERVICE
// After admin requested changes
// ==========================================

export const resubmitService = async (
  serviceId
) => {
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

export const createCategory = async (
  name
) => {
  const response = await axios.post(
    CATEGORY_API,
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
    `${CATEGORY_API}/${categoryId}/subcategories`,
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
    `${CATEGORY_API}/${categoryId}`,
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
    `${CATEGORY_API}/${categoryId}/subcategories/${subCategoryId}`,
    getAuthConfig()
  );

  return response.data;
};
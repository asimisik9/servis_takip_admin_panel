import axios from 'axios';
import { buildAuthHeaders } from './authService';
import { ADMIN_API_URL } from './config';

const API_URL = `${ADMIN_API_URL}/schools`;

/**
 * Fetch schools with pagination
 * @param {number} skip - Number of items to skip
 * @param {number} limit - Number of items per page
 * @returns {Promise<{items: Array, total: number, skip: number, limit: number}>}
 */
export const fetchSchools = async (skip = 0, limit = 20) => {
  const response = await axios.get(API_URL, {
    headers: buildAuthHeaders(),
    params: { skip, limit }
  });
  return response.data;
};

export const createSchool = async (schoolData) => {
  const response = await axios.post(API_URL, schoolData, {
    headers: buildAuthHeaders(),
  });
  return response.data;
};

export const updateSchool = async (schoolId, schoolData) => {
  const response = await axios.put(`${API_URL}/${schoolId}`, schoolData, {
    headers: buildAuthHeaders(),
  });
  return response.data;
};

export const deleteSchool = async (schoolId) => {
  const response = await axios.delete(`${API_URL}/${schoolId}`, {
    headers: buildAuthHeaders(),
  });
  return response.data;
};

export const getSchoolById = async (schoolId) => {
  const response = await axios.get(`${API_URL}/${schoolId}`, {
    headers: buildAuthHeaders(),
  });
  return response.data;
};

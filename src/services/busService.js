import axios from 'axios';
import { buildAuthHeaders } from './authService';
import { ADMIN_API_URL } from './config';

const API_URL = `${ADMIN_API_URL}/buses`;

/**
 * Fetch buses with pagination
 * @param {number} skip - Number of items to skip
 * @param {number} limit - Number of items per page
 * @returns {Promise<{items: Array, total: number, skip: number, limit: number}>}
 */
export const fetchBuses = async (skip = 0, limit = 20, schoolId = null) => {
  const params = { skip, limit };
  if (schoolId) params.school_id = schoolId;

  const response = await axios.get(API_URL, {
    headers: buildAuthHeaders(),
    params
  });
  return response.data;
};

export const createBus = async (busData) => {
  const response = await axios.post(API_URL, busData, {
    headers: buildAuthHeaders(),
  });
  return response.data;
};

export const updateBus = async (busId, busData) => {
  const response = await axios.put(`${API_URL}/${busId}`, busData, {
    headers: buildAuthHeaders(),
  });
  return response.data;
};

export const deleteBus = async (busId) => {
  const response = await axios.delete(`${API_URL}/${busId}`, {
    headers: buildAuthHeaders(),
  });
  return response.data;
};

export const getBusById = async (busId) => {
  const response = await axios.get(`${API_URL}/${busId}`, {
    headers: buildAuthHeaders(),
  });
  return response.data;
};

import axios from 'axios';
import { buildAuthHeaders } from './authService';
import { ADMIN_API_URL } from './config';

const API_URL = `${ADMIN_API_URL}/users`;

/**
 * Fetch users with pagination
 * @param {number} skip - Number of items to skip
 * @param {number} limit - Number of items per page
 * @returns {Promise<{items: Array, total: number, skip: number, limit: number}>}
 */
export const fetchUsers = async (skip = 0, limit = 20, organizationId = null) => {
  const params = { skip, limit };
  if (organizationId) {
    params.organization_id = organizationId;
  }
  const response = await axios.get(API_URL, {
    headers: buildAuthHeaders(),
    params
  });
  return response.data; // Returns {items, total, skip, limit}
};

export const createUser = async (userData) => {
  const response = await axios.post(API_URL, userData, {
    headers: buildAuthHeaders(),
  });
  return response.data;
};

export const updateUser = async (userId, userData) => {
  const response = await axios.put(`${API_URL}/${userId}`, userData, {
    headers: buildAuthHeaders(),
  });
  return response.data;
};

export const deleteUser = async (userId) => {
  const response = await axios.delete(`${API_URL}/${userId}`, {
    headers: buildAuthHeaders(),
  });
  return response.data;
};

export const getUserById = async (userId) => {
  const response = await axios.get(`${API_URL}/${userId}`, {
    headers: buildAuthHeaders(),
  });
  return response.data;
};

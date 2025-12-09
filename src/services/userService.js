import axios from 'axios';
import { getToken } from './authService';
import { ADMIN_API_URL } from './config';

const API_URL = `${ADMIN_API_URL}/users`;

export const fetchUsers = async () => {
  const response = await axios.get(API_URL, {
    headers: { Authorization: `Bearer ${getToken()}` },
  });
  return response.data;
};

export const createUser = async (userData) => {
  const response = await axios.post(API_URL, userData, {
    headers: { Authorization: `Bearer ${getToken()}` },
  });
  return response.data;
};

export const updateUser = async (userId, userData) => {
  const response = await axios.put(`${API_URL}/${userId}`, userData, {
    headers: { Authorization: `Bearer ${getToken()}` },
  });
  return response.data;
};

export const deleteUser = async (userId) => {
  const response = await axios.delete(`${API_URL}/${userId}`, {
    headers: { Authorization: `Bearer ${getToken()}` },
  });
  return response.data;
};

export const getUserById = async (userId) => {
  const response = await axios.get(`${API_URL}/${userId}`, {
    headers: { Authorization: `Bearer ${getToken()}` },
  });
  return response.data;
}

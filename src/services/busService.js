import axios from 'axios';
import { getToken } from './authService';

const API_URL = 'http://localhost:8000/api/admin/buses';

export const fetchBuses = async () => {
  const response = await axios.get(API_URL, {
    headers: { Authorization: `Bearer ${getToken()}` },
  });
  return response.data;
};

export const createBus = async (busData) => {
  const response = await axios.post(API_URL, busData, {
    headers: { Authorization: `Bearer ${getToken()}` },
  });
  return response.data;
};

export const updateBus = async (busId, busData) => {
  const response = await axios.put(`${API_URL}/${busId}`, busData, {
    headers: { Authorization: `Bearer ${getToken()}` },
  });
  return response.data;
};

export const deleteBus = async (busId) => {
  const response = await axios.delete(`${API_URL}/${busId}`, {
    headers: { Authorization: `Bearer ${getToken()}` },
  });
  return response.data;
};

export const getBusById = async (busId) => {
  const response = await axios.get(`${API_URL}/${busId}`, {
    headers: { Authorization: `Bearer ${getToken()}` },
  });
  return response.data;
};

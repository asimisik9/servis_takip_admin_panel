import axios from 'axios';
import { getToken } from './authService';

const API_URL = 'http://localhost:8000/api/admin/schools';

export const fetchSchools = async () => {
  const response = await axios.get(API_URL, {
    headers: { Authorization: `Bearer ${getToken()}` },
  });
  return response.data;
};

export const createSchool = async (schoolData) => {
  const response = await axios.post(API_URL, schoolData, {
    headers: { Authorization: `Bearer ${getToken()}` },
  });
  return response.data;
};

export const updateSchool = async (schoolId, schoolData) => {
  const response = await axios.put(`${API_URL}/${schoolId}`, schoolData, {
    headers: { Authorization: `Bearer ${getToken()}` },
  });
  return response.data;
};

export const deleteSchool = async (schoolId) => {
  const response = await axios.delete(`${API_URL}/${schoolId}`, {
    headers: { Authorization: `Bearer ${getToken()}` },
  });
  return response.data;
};

export const getSchoolById = async (schoolId) => {
  const response = await axios.get(`${API_URL}/${schoolId}`, {
    headers: { Authorization: `Bearer ${getToken()}` },
  });
  return response.data;
};

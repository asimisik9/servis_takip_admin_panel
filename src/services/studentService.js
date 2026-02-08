import axios from 'axios';
import { buildAuthHeaders } from './authService';
import { ADMIN_API_URL } from './config';

const API_URL = `${ADMIN_API_URL}/students`;

/**
 * Fetch students with pagination
 * @param {number} skip - Number of items to skip
 * @param {number} limit - Number of items per page
 * @returns {Promise<{items: Array, total: number, skip: number, limit: number}>}
 */
export const fetchStudents = async (skip = 0, limit = 20, schoolId = null) => {
  const params = { skip, limit };
  if (schoolId) params.school_id = schoolId;

  const response = await axios.get(API_URL, {
    headers: buildAuthHeaders(),
    params
  });
  return response.data;
};

export const createStudent = async (studentData) => {
  const response = await axios.post(API_URL, studentData, {
    headers: buildAuthHeaders(),
  });
  return response.data;
};

export const updateStudent = async (studentId, studentData) => {
  const response = await axios.put(`${API_URL}/${studentId}`, studentData, {
    headers: buildAuthHeaders(),
  });
  return response.data;
};

export const deleteStudent = async (studentId) => {
  const response = await axios.delete(`${API_URL}/${studentId}`, {
    headers: buildAuthHeaders(),
  });
  return response.data;
};

export const getStudentById = async (studentId) => {
  const response = await axios.get(`${API_URL}/${studentId}`, {
    headers: buildAuthHeaders(),
  });
  return response.data;
};

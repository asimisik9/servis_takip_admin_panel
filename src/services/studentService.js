import axios from 'axios';
import { getToken } from './authService';

const API_URL = 'http://localhost:8000/api/admin/students';

export const fetchStudents = async () => {
  const response = await axios.get(API_URL, {
    headers: { Authorization: `Bearer ${getToken()}` },
  });
  return response.data;
};

export const createStudent = async (studentData) => {
  const response = await axios.post(API_URL, studentData, {
    headers: { Authorization: `Bearer ${getToken()}` },
  });
  return response.data;
};

export const updateStudent = async (studentId, studentData) => {
  const response = await axios.put(`${API_URL}/${studentId}`, studentData, {
    headers: { Authorization: `Bearer ${getToken()}` },
  });
  return response.data;
};

export const deleteStudent = async (studentId) => {
  const response = await axios.delete(`${API_URL}/${studentId}`, {
    headers: { Authorization: `Bearer ${getToken()}` },
  });
  return response.data;
};

export const getStudentById = async (studentId) => {
  const response = await axios.get(`${API_URL}/${studentId}`, {
    headers: { Authorization: `Bearer ${getToken()}` },
  });
  return response.data;
};

import axios from 'axios';
import { getToken } from './authService';
import { ADMIN_API_URL } from './config';

// Student-Bus Assignments
export const fetchStudentBusAssignments = async () => {
  const response = await axios.get(`${ADMIN_API_URL}/assignments/student-bus`, {
    headers: { Authorization: `Bearer ${getToken()}` },
  });
  return response.data;
};

export const assignBusToStudent = async (studentId, busId) => {
  const response = await axios.post(
    `${ADMIN_API_URL}/students/${studentId}/assign-bus?bus_id=${busId}`,
    {},
    {
      headers: { Authorization: `Bearer ${getToken()}` },
    }
  );
  return response.data;
};

export const deleteStudentBusAssignment = async (assignmentId) => {
  const response = await axios.delete(
    `${ADMIN_API_URL}/assignments/student-bus/${assignmentId}`,
    {
      headers: { Authorization: `Bearer ${getToken()}` },
    }
  );
  return response.data;
};

// Parent-Student Relations
export const fetchParentStudentRelations = async () => {
  const response = await axios.get(`${ADMIN_API_URL}/assignments/parent-student`, {
    headers: { Authorization: `Bearer ${getToken()}` },
  });
  return response.data;
};

export const assignParentToStudent = async (studentId, parentId) => {
  const response = await axios.post(
    `${ADMIN_API_URL}/students/${studentId}/assign-parent?parent_id=${parentId}`,
    {},
    {
      headers: { Authorization: `Bearer ${getToken()}` },
    }
  );
  return response.data;
};

export const deleteParentStudentRelation = async (relationId) => {
  const response = await axios.delete(
    `${ADMIN_API_URL}/assignments/parent-student/${relationId}`,
    {
      headers: { Authorization: `Bearer ${getToken()}` },
    }
  );
  return response.data;
};

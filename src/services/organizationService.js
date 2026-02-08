import axios from 'axios';
import { getToken } from './authService';
import { ADMIN_API_URL } from './config';

const API_URL = `${ADMIN_API_URL}/organizations`;

/**
 * Fetch organizations with pagination
 * @param {number} skip - Number of items to skip
 * @param {number} limit - Number of items per page
 * @returns {Promise<{items: Array, total: number, skip: number, limit: number}>}
 */
export const fetchOrganizations = async (skip = 0, limit = 20) => {
    const response = await axios.get(API_URL, {
        headers: { Authorization: `Bearer ${getToken()}` },
        params: { skip, limit }
    });
    return response.data;
};

/**
 * Fetch all organizations (for dropdowns, no pagination)
 */
export const fetchAllOrganizations = async () => {
    const response = await axios.get(API_URL, {
        headers: { Authorization: `Bearer ${getToken()}` },
        params: { skip: 0, limit: 1000 }
    });
    return response.data.items || [];
};

export const createOrganization = async (orgData) => {
    const response = await axios.post(API_URL, orgData, {
        headers: { Authorization: `Bearer ${getToken()}` },
    });
    return response.data;
};

export const updateOrganization = async (orgId, orgData) => {
    const response = await axios.put(`${API_URL}/${orgId}`, orgData, {
        headers: { Authorization: `Bearer ${getToken()}` },
    });
    return response.data;
};

export const deleteOrganization = async (orgId) => {
    const response = await axios.delete(`${API_URL}/${orgId}`, {
        headers: { Authorization: `Bearer ${getToken()}` },
    });
    return response.data;
};

export const getOrganizationById = async (orgId) => {
    const response = await axios.get(`${API_URL}/${orgId}`, {
        headers: { Authorization: `Bearer ${getToken()}` },
    });
    return response.data;
};

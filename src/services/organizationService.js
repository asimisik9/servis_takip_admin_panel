import axios from 'axios';
import { buildAuthHeaders } from './authService';
import { ADMIN_API_URL } from './config';

const API_URL = `${ADMIN_API_URL}/organizations`;
const CONTRACTS_API_URL = `${API_URL}/contracts`;

/**
 * Fetch organizations with pagination
 * @param {number} skip - Number of items to skip
 * @param {number} limit - Number of items per page
 * @returns {Promise<{items: Array, total: number, skip: number, limit: number}>}
 */
export const fetchOrganizations = async (skip = 0, limit = 20) => {
    const response = await axios.get(API_URL, {
        headers: buildAuthHeaders(),
        params: { skip, limit }
    });
    return response.data;
};

/**
 * Fetch all organizations (for dropdowns, no pagination)
 */
export const fetchAllOrganizations = async () => {
    const allOrganizations = [];
    const pageSize = 500;
    let skip = 0;
    let total = null;

    while (total === null || skip < total) {
        const response = await axios.get(API_URL, {
            headers: buildAuthHeaders(),
            params: { skip, limit: pageSize }
        });

        const payload = response.data;
        const items = Array.isArray(payload) ? payload : (payload?.items || []);
        allOrganizations.push(...items);

        if (Array.isArray(payload)) {
            break;
        }

        total = typeof payload?.total === 'number' ? payload.total : allOrganizations.length;
        if (items.length === 0) {
            break;
        }
        skip += items.length;
    }

    return allOrganizations;
};

export const createOrganization = async (orgData) => {
    const response = await axios.post(API_URL, orgData, {
        headers: buildAuthHeaders(),
    });
    return response.data;
};

export const updateOrganization = async (orgId, orgData) => {
    const response = await axios.put(`${API_URL}/${orgId}`, orgData, {
        headers: buildAuthHeaders(),
    });
    return response.data;
};

export const deleteOrganization = async (orgId) => {
    const response = await axios.delete(`${API_URL}/${orgId}`, {
        headers: buildAuthHeaders(),
    });
    return response.data;
};

export const getOrganizationById = async (orgId) => {
    const response = await axios.get(`${API_URL}/${orgId}`, {
        headers: buildAuthHeaders(),
    });
    return response.data;
};

export const fetchContracts = async ({
    schoolOrgId = null,
    companyOrgId = null,
    activeOnly = true,
    skip = 0,
    limit = 200
} = {}) => {
    const params = {
        active_only: activeOnly,
        skip,
        limit
    };

    if (schoolOrgId) {
        params.school_org_id = schoolOrgId;
    }
    if (companyOrgId) {
        params.company_org_id = companyOrgId;
    }

    const response = await axios.get(CONTRACTS_API_URL, {
        headers: buildAuthHeaders(),
        params
    });
    return response.data;
};

export const createContract = async (contractData) => {
    const response = await axios.post(CONTRACTS_API_URL, contractData, {
        headers: buildAuthHeaders(),
    });
    return response.data;
};

export const terminateContract = async (contractId) => {
    const response = await axios.delete(`${CONTRACTS_API_URL}/${contractId}`, {
        headers: buildAuthHeaders(),
    });
    return response.data;
};

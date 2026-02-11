import axios from 'axios';

// ---------------------------------------------------------------------------
// SMART URL SELECTION
// If we are on the internet (Vercel), use the Render Backend.
// If we are on your laptop (Localhost), use your local Spring Boot.
// ---------------------------------------------------------------------------
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

// 1. Purchase Order API
export const getAllPOs = () => axios.get(`${API_URL}/po`);
export const createPO = (po) => axios.post(`${API_URL}/po`, po);

// 2. Goods Receipt API
export const getAllGRNs = () => axios.get(`${API_URL}/grn`);
export const createGRN = (grn) => axios.post(`${API_URL}/grn`, grn);

// 3. Invoice API
export const getAllInvoices = () => axios.get(`${API_URL}/invoice`);
export const createInvoice = (invoice) => axios.post(`${API_URL}/invoice`, invoice);

// 4. Matching Logic
export const runMatch = (invoiceNumber) => axios.post(`${API_URL}/match/${invoiceNumber}`);
export const getMatchResult = (invoiceNumber) => axios.get(`${API_URL}/match/${invoiceNumber}`);

// --- FILE UPLOAD APIs ---
export const uploadPOFile = (file) => {
    const formData = new FormData();
    formData.append("file", file);
    return axios.post(`${API_URL}/upload/po`, formData, {
        headers: { "Content-Type": "multipart/form-data" }
    });
};

export const uploadGRNFile = (file) => {
    const formData = new FormData();
    formData.append("file", file);
    return axios.post(`${API_URL}/upload/grn`, formData, {
        headers: { "Content-Type": "multipart/form-data" }
    });
};

export const uploadInvoiceFile = (file) => {
    const formData = new FormData();
    formData.append("file", file);
    return axios.post(`${API_URL}/upload/invoice`, formData, {
        headers: { "Content-Type": "multipart/form-data" }
    });
};
import api from './axios';

export const getPayments = (params = {}) => api.get('/payments', { params });

export const getPayment = (id) => api.get(`/payments/${id}`);

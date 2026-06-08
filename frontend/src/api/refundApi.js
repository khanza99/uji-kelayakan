import api from './axios';

export const getRefunds = (params = {}) => api.get('/refunds', { params });

export const getRefund = (id) => api.get(`/refunds/${id}`);

export const createRefund = (data) => api.post('/refunds', data);

export const updateRefund = (id, data) => api.patch(`/refunds/${id}`, data);

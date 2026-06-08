import api from './axios';

export const getOrders = (params = {}) => api.get('/orders', { params });

export const getOrder = (id) => api.get(`/orders/${id}`);

export const createOrder = (data) => api.post('/orders', data);

export const confirmPayment = (orderId, data = {}) =>
  api.post(`/orders/${orderId}/confirm-payment`, data);

export const cancelOrder = (orderId) => api.post(`/orders/${orderId}/cancel`);

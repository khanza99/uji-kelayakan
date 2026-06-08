import api from './axios';

export const getTickets = (params = {}) => api.get('/tickets', { params });

export const getTicket = (id) => api.get(`/tickets/${id}`);

export const getTicketQR = (id) =>
  api.get(`/tickets/${id}/qr`, { responseType: 'blob' });

export const downloadTicketPDF = (id) =>
  api.get(`/tickets/${id}/download`, { responseType: 'blob' });

export const validateTicketQR = (qrToken) =>
  api.post('/tickets/validate', { qr_token: qrToken });

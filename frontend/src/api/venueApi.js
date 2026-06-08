import api from './axios';

export const getVenues = (params = {}) => api.get('/venues', { params });

export const getVenue = (id) => api.get(`/venues/${id}`);

export const createVenue = (data) => api.post('/venues', data);

export const updateVenue = (id, data) => api.put(`/venues/${id}`, data);

export const deleteVenue = (id) => api.delete(`/venues/${id}`);

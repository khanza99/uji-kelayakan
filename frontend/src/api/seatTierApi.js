import api from './axios';

export const getSeatTiers = (concertId) =>
  api.get('/seat-tiers', { params: { concert_id: concertId } });

export const getSeatTier = (id) => api.get(`/seat-tiers/${id}`);

export const createSeatTier = (data) => api.post('/seat-tiers', data);

export const updateSeatTier = (id, data) => api.put(`/seat-tiers/${id}`, data);

export const deleteSeatTier = (id) => api.delete(`/seat-tiers/${id}`);

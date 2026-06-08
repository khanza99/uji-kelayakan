import api from './axios';

export const getSeats = (seatTierId) =>
  api.get('/seats', { params: { seat_tier_id: seatTierId } });

export const getSeat = (id) => api.get(`/seats/${id}`);

export const updateSeat = (id, data) => api.patch(`/seats/${id}`, data);

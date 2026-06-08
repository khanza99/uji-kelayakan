import api from './axios';

export const getConcerts = (params = {}) => api.get('/concerts', { params });

export const getConcert = (id) => api.get(`/concerts/${id}`);

export const createConcert = (data) => {
  const formData = new FormData();
  Object.entries(data).forEach(([key, value]) => {
    if (value !== null && value !== undefined) {
      formData.append(key, value);
    }
  });
  return api.post('/concerts', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};

export const updateConcert = (id, data) => {
  // For PUT/PATCH with file upload, use FormData with _method spoofing
  if (data instanceof FormData || data.poster_image) {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        formData.append(key, value);
      }
    });
    formData.append('_method', 'PUT');
    return api.post(`/concerts/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  }
  return api.patch(`/concerts/${id}`, data);
};

export const deleteConcert = (id) => api.delete(`/concerts/${id}`);

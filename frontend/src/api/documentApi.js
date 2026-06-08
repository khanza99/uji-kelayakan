import api from './axios';

export const getDocuments = (concertId) =>
  api.get('/documents', { params: { concert_id: concertId } });

export const getDocument = (id) => api.get(`/documents/${id}`);

export const uploadDocument = (data) => {
  const formData = new FormData();
  formData.append('concert_id', data.concert_id);
  formData.append('file', data.file);
  formData.append('doc_type', data.doc_type);
  return api.post('/documents', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};

export const deleteDocument = (id) => api.delete(`/documents/${id}`);

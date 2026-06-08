import api from './axios';

export const exportOrdersPdf = (params = {}) =>
  api.get('/export/orders/pdf', { params, responseType: 'blob' });

export const exportOrdersExcel = (params = {}) =>
  api.get('/export/orders/excel', { params, responseType: 'blob' });

export const exportTicketsExcel = (params = {}) =>
  api.get('/export/tickets/excel', { params, responseType: 'blob' });

export const exportConcertsExcel = () =>
  api.get('/export/concerts/excel', { responseType: 'blob' });

// Helper to trigger browser download from blob response
export const downloadBlob = (blob, filename) => {
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(url);
};

import { useQuery, useMutation } from '@tanstack/react-query';
import * as ticketApi from '@/api/ticketApi';

export function useTickets(params = {}) {
  return useQuery({
    queryKey: ['tickets', params],
    queryFn: () => ticketApi.getTickets(params).then((r) => r.data),
  });
}

export function useTicket(id) {
  return useQuery({
    queryKey: ['tickets', id],
    queryFn: () => ticketApi.getTicket(id).then((r) => r.data),
    enabled: !!id,
  });
}

export function useTicketQR(id) {
  return useQuery({
    queryKey: ['tickets', id, 'qr'],
    queryFn: async () => {
      const response = await ticketApi.getTicketQR(id);
      // SVG comes as blob — create object URL with correct svg mime type
      const blob = new Blob([response.data], { type: 'image/svg+xml' });
      return URL.createObjectURL(blob);
    },
    enabled: !!id,
  });
}

export function useValidateTicket() {
  return useMutation({
    mutationFn: ticketApi.validateTicketQR,
  });
}

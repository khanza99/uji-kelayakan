import { useQuery } from '@tanstack/react-query';
import * as paymentApi from '@/api/paymentApi';

export function usePayments(params = {}) {
  return useQuery({
    queryKey: ['payments', params],
    queryFn: () => paymentApi.getPayments(params).then((r) => r.data),
  });
}

export function usePayment(id) {
  return useQuery({
    queryKey: ['payments', id],
    queryFn: () => paymentApi.getPayment(id).then((r) => r.data),
    enabled: !!id,
  });
}

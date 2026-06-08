import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as orderApi from '@/api/orderApi';

export function useOrders(params = {}) {
  return useQuery({
    queryKey: ['orders', params],
    queryFn: () => orderApi.getOrders(params).then((r) => r.data),
  });
}

export function useOrder(id) {
  return useQuery({
    queryKey: ['orders', id],
    queryFn: () => orderApi.getOrder(id).then((r) => r.data),
    enabled: !!id,
  });
}

export function useCreateOrder() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: orderApi.createOrder,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['orders'] });
      qc.invalidateQueries({ queryKey: ['seats'] });
    },
  });
}

export function useConfirmPayment() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ orderId, data }) => orderApi.confirmPayment(orderId, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['orders'] });
      qc.invalidateQueries({ queryKey: ['tickets'] });
      qc.invalidateQueries({ queryKey: ['payments'] });
    },
  });
}

export function useCancelOrder() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: orderApi.cancelOrder,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['orders'] });
      qc.invalidateQueries({ queryKey: ['seats'] });
    },
  });
}

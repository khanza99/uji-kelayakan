import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as refundApi from '@/api/refundApi';

export function useRefunds(params = {}) {
  return useQuery({
    queryKey: ['refunds', params],
    queryFn: () => refundApi.getRefunds(params).then((r) => r.data),
  });
}

export function useRefund(id) {
  return useQuery({
    queryKey: ['refunds', id],
    queryFn: () => refundApi.getRefund(id).then((r) => r.data),
    enabled: !!id,
  });
}

export function useCreateRefund() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: refundApi.createRefund,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['refunds'] }),
  });
}

export function useUpdateRefund() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => refundApi.updateRefund(id, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['refunds'] });
      qc.invalidateQueries({ queryKey: ['tickets'] });
      qc.invalidateQueries({ queryKey: ['orders'] });
    },
  });
}

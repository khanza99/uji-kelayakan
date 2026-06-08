import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as seatTierApi from '@/api/seatTierApi';

export function useSeatTiers(concertId) {
  return useQuery({
    queryKey: ['seatTiers', concertId],
    queryFn: () => seatTierApi.getSeatTiers(concertId).then((r) => r.data),
    enabled: !!concertId,
  });
}

export function useSeatTier(id) {
  return useQuery({
    queryKey: ['seatTiers', 'detail', id],
    queryFn: () => seatTierApi.getSeatTier(id).then((r) => r.data),
    enabled: !!id,
  });
}

export function useCreateSeatTier() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: seatTierApi.createSeatTier,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['seatTiers'] }),
  });
}

export function useUpdateSeatTier() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => seatTierApi.updateSeatTier(id, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['seatTiers'] }),
  });
}

export function useDeleteSeatTier() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: seatTierApi.deleteSeatTier,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['seatTiers'] }),
  });
}

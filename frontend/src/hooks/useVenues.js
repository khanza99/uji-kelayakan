import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as venueApi from '@/api/venueApi';

export function useVenues(params = {}) {
  return useQuery({
    queryKey: ['venues', params],
    queryFn: () => venueApi.getVenues(params).then((r) => r.data),
  });
}

export function useVenue(id) {
  return useQuery({
    queryKey: ['venues', id],
    queryFn: () => venueApi.getVenue(id).then((r) => r.data),
    enabled: !!id,
  });
}

export function useCreateVenue() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: venueApi.createVenue,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['venues'] }),
  });
}

export function useUpdateVenue() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => venueApi.updateVenue(id, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['venues'] }),
  });
}

export function useDeleteVenue() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: venueApi.deleteVenue,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['venues'] }),
  });
}

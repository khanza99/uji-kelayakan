import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as concertApi from '@/api/concertApi';

export function useConcerts(params = {}) {
  return useQuery({
    queryKey: ['concerts', params],
    queryFn: () => concertApi.getConcerts(params).then((r) => r.data),
  });
}

export function useConcert(id) {
  return useQuery({
    queryKey: ['concerts', id],
    queryFn: () => concertApi.getConcert(id).then((r) => r.data),
    enabled: !!id,
  });
}

export function useCreateConcert() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: concertApi.createConcert,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['concerts'] }),
  });
}

export function useUpdateConcert() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => concertApi.updateConcert(id, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['concerts'] }),
  });
}

export function useDeleteConcert() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: concertApi.deleteConcert,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['concerts'] }),
  });
}

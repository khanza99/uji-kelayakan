import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as documentApi from '@/api/documentApi';

export function useDocuments(concertId) {
  return useQuery({
    queryKey: ['documents', concertId],
    queryFn: () => documentApi.getDocuments(concertId).then((r) => r.data),
    enabled: !!concertId,
  });
}

export function useUploadDocument() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: documentApi.uploadDocument,
    onSuccess: () => qc.invalidateQueries(['documents']),
  });
}

export function useDeleteDocument() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: documentApi.deleteDocument,
    onSuccess: () => qc.invalidateQueries(['documents']),
  });
}

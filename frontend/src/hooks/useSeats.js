import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as seatApi from '@/api/seatApi';

export function useSeats(seatTierId) {
  return useQuery({
    queryKey: ['seats', seatTierId],
    queryFn: () => seatApi.getSeats(seatTierId).then((r) => r.data),
    enabled: !!seatTierId,
  });
}

export function useUpdateSeat() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => seatApi.updateSeat(id, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['seats'] }),
  });
}

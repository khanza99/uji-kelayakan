import { useQuery } from '@tanstack/react-query';
import * as dashboardApi from '@/api/dashboardApi';

export function useDashboard() {
  return useQuery({
    queryKey: ['dashboard'],
    queryFn: () => dashboardApi.getDashboard().then((r) => r.data),
    staleTime: 30_000, // 30 seconds
  });
}

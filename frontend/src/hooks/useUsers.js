import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as userApi from '@/api/userApi';

export function useUsers(params = {}) {
  return useQuery({
    queryKey: ['users', params],
    queryFn: () => userApi.getUsers(params).then((r) => r.data),
  });
}

export function useUser(id) {
  return useQuery({
    queryKey: ['users', id],
    queryFn: () => userApi.getUser(id).then((r) => r.data),
    enabled: !!id,
  });
}

export function useCreateUser() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: userApi.createUser,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['users'] }),
  });
}

export function useUpdateUser() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => userApi.updateUser(id, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['users'] }),
  });
}

export function useDeleteUser() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: userApi.deleteUser,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['users'] }),
  });
}

import { useMutation, useQuery } from '@tanstack/react-query';
import { api } from './api';
import { QUERY_KEYS } from '../constants/queries';
import type { IResponseError, IResponseGeneric } from '../interfaces/response.interface';
import type { IUser } from '../interfaces/user.interface';
import { useStore } from '../store';
import { queryClient } from './queryClient';

interface IMembersResponse extends IResponseGeneric {
  users: IUser[];
}

export const useMembersQuery = () => {
  const { setMembers } = useStore();
  return useQuery<IMembersResponse, IResponseError>({
    queryKey: [QUERY_KEYS.MEMBERS],
    queryFn: async () => {
      const { data } = await api.get<IMembersResponse>('/users', {
        params: {
          role: 'MEMBER',
        },
      });
      setMembers(data.users || []);
      return data;
    },
  });
};

export const useInviteMemberMutation = () => {
  return useMutation<IResponseGeneric, IResponseError, { email: string; fullName: string }>({
    mutationFn: async payload => {
      const { data } = await api.post<IResponseGeneric>('/users', payload);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.MEMBERS] });
    },
  });
};

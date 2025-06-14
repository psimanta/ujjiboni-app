import { useQuery } from '@tanstack/react-query';
import { api } from './api';
import { QUERY_KEYS } from '../constants/queries';
import type { IResponseError, IResponseGeneric } from '../interfaces/response.interface';
import type { IUser } from '../interfaces/user.interface';

interface IMembersResponse extends IResponseGeneric {
  users: IUser[];
}

export const useMembersQuery = () => {
  return useQuery<IMembersResponse, IResponseError>({
    queryKey: [QUERY_KEYS.MEMBERS],
    queryFn: async () => {
      const { data } = await api.get<IMembersResponse>('/users', {
        params: {
          role: 'MEMBER',
        },
      });
      return data;
    },
  });
};

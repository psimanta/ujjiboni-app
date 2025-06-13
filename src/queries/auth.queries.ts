import { useMutation, useQuery } from '@tanstack/react-query';
import { api } from './api';
import { QUERY_KEYS } from '../constants/queries';
import type { IUser } from '../interfaces/user.interface';
import type { IResponseGeneric } from '../interfaces/response.interface';

interface ILoginCredentials {
  email: string;
  password: string;
}

interface ILoginResponse extends IResponseGeneric {
  token: string;
  user: IUser;
}

export const useLoginMutation = () => {
  return useMutation({
    mutationFn: async (credentials: ILoginCredentials) => {
      const { data } = await api.post<ILoginResponse>('/auth/login', credentials);
      return data;
    },
  });
};

export const useProfileQuery = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.PROFILE],
    queryFn: async () => {
      const { data } = await api.get<ILoginResponse>('/auth/profile');
      return data;
    },
    refetchOnWindowFocus: true,
    refetchOnMount: true,
    refetchOnReconnect: true,
    refetchInterval: 1000 * 60 * 5, // 5 minutes
  });
};

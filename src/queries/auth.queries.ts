import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from './api';
import { QUERY_KEYS } from '../constants/queries';
import type { IUser } from '../interfaces/user.interface';
import type { IResponseError, IResponseGeneric } from '../interfaces/response.interface';
import type { IRequestConfig } from '../interfaces/request.interface';

interface ILoginCredentials {
  email: string;
  password: string;
}

interface ILoginResponse extends IResponseGeneric {
  token: string;
  user: IUser;
}

export const useLoginMutation = () => {
  const queryClient = useQueryClient();
  return useMutation<ILoginResponse, IResponseError, ILoginCredentials>({
    mutationFn: async (credentials: ILoginCredentials) => {
      const { data } = await api.post<ILoginResponse>('/auth/login', credentials, {
        skipAuth: true,
      } as IRequestConfig);
      return data;
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.PROFILE] });
    },
  });
};

export const useProfileQuery = () => {
  return useQuery<ILoginResponse, IResponseError>({
    queryKey: [QUERY_KEYS.PROFILE],
    queryFn: async () => {
      const { data } = await api.get<ILoginResponse>('/auth/profile');
      return data;
    },
    refetchOnWindowFocus: true,
    refetchOnMount: true,
    refetchOnReconnect: true,
    refetchInterval: 1000 * 60 * 5, // 5 minutes
    retry: 3,
  });
};

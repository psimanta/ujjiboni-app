import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from './api';
import { QUERY_KEYS } from '../constants/queries';
import type { IUser } from '../interfaces/user.interface';
import type { IResponseError, IResponseGeneric } from '../interfaces/response.interface';
import type { IRequestConfig } from '../interfaces/request.interface';
import { useStore } from '../store';

interface ILoginCredentials {
  email: string;
  password: string;
}

interface ILoginResponse extends IResponseGeneric {
  token: string;
  user: IUser;
}

interface IProfileResponse extends IResponseGeneric {
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
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.PROFILE] });
    },
  });
};

export const useProfileQuery = () => {
  const { setUser } = useStore(state => state);
  return useQuery<IProfileResponse, IResponseError>({
    queryKey: [QUERY_KEYS.PROFILE],
    queryFn: async () => {
      const { data } = await api.get<ILoginResponse>('/auth/profile');
      setUser(data.user);
      return data;
    },
    staleTime: 0,
    gcTime: 0,
    refetchOnWindowFocus: true,
    refetchOnMount: true,
    refetchOnReconnect: true,
    retry: 3,
  });
};

export const usePasswordChangeMutation = () => {
  return useMutation<
    IResponseGeneric,
    IResponseError,
    { currentPassword: string; newPassword: string; confirmPassword: string }
  >({
    mutationFn: async ({
      currentPassword,
      newPassword,
      confirmPassword,
    }: {
      currentPassword: string;
      newPassword: string;
      confirmPassword: string;
    }) => {
      const { data } = await api.post<IResponseGeneric>('/auth/change-password', {
        currentPassword,
        newPassword,
        confirmPassword,
      });
      return data;
    },
  });
};

interface ISetupPasswordResponse extends IResponseGeneric {
  token?: string;
}

export const useSetupPasswordMutation = () => {
  return useMutation<
    ISetupPasswordResponse,
    IResponseError,
    { password: string; email: string; confirmPassword: string; otpCode: string }
  >({
    mutationFn: async payload => {
      const { data } = await api.post<IResponseGeneric>('/auth/setup-password-with-otp', payload);
      return data;
    },
  });
};

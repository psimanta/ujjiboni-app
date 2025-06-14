import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from './api';
import { QUERY_KEYS } from '../constants/queries';
import type { IResponseError, IResponseGeneric } from '../interfaces/response.interface';
import type { IAccount, ITransaction } from '../interfaces/account.interface';

interface IAccountResponse extends IResponseGeneric {
  accounts: IAccount[];
}

interface ICreateAccountPayload {
  name: string;
  accountHolder: string;
}

interface ICreateAccountResponse extends IResponseGeneric {
  account: IAccount;
}

interface IAccountDetailsResponse extends IResponseGeneric {
  account: IAccount;
  transactions: ITransaction[];
}

export const useCreateAccountMutation = () => {
  const queryClient = useQueryClient();
  return useMutation<ICreateAccountResponse, IResponseError, ICreateAccountPayload>({
    mutationFn: async payload => {
      const { data } = await api.post<ICreateAccountResponse>('/accounts', payload);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.ACCOUNTS] });
    },
  });
};

export const useAccountsQuery = () => {
  return useQuery<IAccountResponse, IResponseError>({
    queryKey: [QUERY_KEYS.ACCOUNTS],
    queryFn: async () => {
      const { data } = await api.get<IAccountResponse>('/accounts');
      return data;
    },
  });
};

export const useAccountTransactionsQuery = (id: string, page: number, limit: number = 20) => {
  return useQuery<IAccountDetailsResponse, IResponseError>({
    queryKey: [QUERY_KEYS.ACCOUNT_DETAILS, id, page, limit],
    queryFn: async () => {
      const { data } = await api.get<IAccountDetailsResponse>(`/transactions/account/${id}`, {
        params: {
          page,
          limit,
        },
      });
      return data;
    },
  });
};

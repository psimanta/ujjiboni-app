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
  type: string;
}

interface ICreateAccountResponse extends IResponseGeneric {
  account: IAccount;
}

interface IAccountTransactionsResponse extends IResponseGeneric {
  account: IAccount;
  transactions: ITransaction[];
}

interface IAccountDetailsResponse extends IResponseGeneric {
  account: IAccount;
}

interface IEnterTransactionPayload {
  accountId: string;
  amount: number;
  type: 'debit' | 'credit';
  comment: string;
  transactionDate: Date | null;
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

export const useAccountDetailsQuery = (id: string) => {
  return useQuery<IAccountDetailsResponse, IResponseError>({
    queryKey: [QUERY_KEYS.ACCOUNT_DETAILS, id],
    queryFn: async () => {
      const { data } = await api.get<IAccountDetailsResponse>(`/accounts/${id}`);
      return data;
    },
  });
};

export const useAccountTransactionsQuery = (id: string, page: number, limit: number = 20) => {
  return useQuery<IAccountTransactionsResponse, IResponseError>({
    queryKey: [QUERY_KEYS.ACCOUNT_TRANSACTIONS, id, page, limit],
    queryFn: async () => {
      const { data } = await api.get<IAccountTransactionsResponse>(`/transactions/account/${id}`, {
        params: {
          page,
          limit,
        },
      });
      return data;
    },
  });
};

export const useEnterTransactionMutation = () => {
  const queryClient = useQueryClient();
  return useMutation<IResponseGeneric, IResponseError, IEnterTransactionPayload>({
    mutationFn: async payload => {
      const { data } = await api.post<IResponseGeneric>('/transactions', payload);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.ACCOUNT_DETAILS],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.ACCOUNT_TRANSACTIONS],
      });
    },
  });
};

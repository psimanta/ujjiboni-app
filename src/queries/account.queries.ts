import { useQuery } from '@tanstack/react-query';
import { api } from './api';
import { QUERY_KEYS } from '../constants/queries';
import type { IResponseError, IResponseGeneric } from '../interfaces/response.interface';
import type { IAccount } from '../interfaces/account.interface';

interface IAccountResponse extends IResponseGeneric {
  accounts: IAccount[];
}

export const useAccountsQuery = () => {
  return useQuery<IAccountResponse, IResponseError>({
    queryKey: [QUERY_KEYS.ACCOUNTS],
    queryFn: async () => {
      const { data } = await api.get<IAccountResponse>('/accounts');
      return data;
    },
  });
};

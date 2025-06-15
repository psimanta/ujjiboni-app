import { useQuery } from '@tanstack/react-query';
import { api } from './api';
import { QUERY_KEYS } from '../constants/queries';
import type { IResponseError, IResponseGeneric } from '../interfaces/response.interface';
import type { ILoan } from '../interfaces/loan.interface';

interface ILoansResponse extends IResponseGeneric {
  loans: ILoan[];
}

export const useLoansQuery = (page: number = 1, limit: number = 20) => {
  return useQuery<ILoansResponse, IResponseError>({
    queryKey: [QUERY_KEYS.LOANS, page, limit],
    queryFn: async () => {
      const { data } = await api.get<ILoansResponse>('/loans', {
        params: {
          page,
          limit,
        },
      });
      return data;
    },
  });
};

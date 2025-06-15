import { useQuery } from '@tanstack/react-query';
import { api } from './api';
import { QUERY_KEYS } from '../constants/queries';
import type { IResponseError, IResponseGeneric } from '../interfaces/response.interface';
import type { ILoan } from '../interfaces/loan.interface';

interface ILoansResponse extends IResponseGeneric {
  loans: ILoan[];
}

export const useLoansQuery = (
  page: number = 1,
  limit: number = 20,
  memberId?: string,
  status?: string
) => {
  return useQuery<ILoansResponse, IResponseError>({
    queryKey: [QUERY_KEYS.LOANS, page, limit, memberId, status],
    queryFn: async () => {
      const params: {
        page: number;
        limit: number;
        memberId?: string;
        status?: string;
      } = {
        page,
        limit,
      };

      if (memberId && memberId !== 'all') {
        params.memberId = memberId;
      }

      if (status && status !== 'all') {
        params.status = status;
      }

      const { data } = await api.get<ILoansResponse>('/loans', {
        params,
      });
      return data;
    },
  });
};

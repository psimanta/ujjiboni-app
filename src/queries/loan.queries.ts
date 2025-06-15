import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from './api';
import { QUERY_KEYS } from '../constants/queries';
import type { IResponseError, IResponseGeneric } from '../interfaces/response.interface';
import type { ILoan, LoanType } from '../interfaces/loan.interface';

interface ILoansResponse extends IResponseGeneric {
  loans: ILoan[];
}

interface ILoanCreationResponse extends IResponseGeneric {
  loan: ILoan;
}
interface ICreateLoanPayload {
  memberId: string;
  loanType: LoanType;
  principalAmount: number;
  monthlyInterestRate: number;
  notes: string;
  interestStartMonth: string;
  loanDisbursementMonth: string;
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

export const useCreateLoanMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<ILoanCreationResponse, IResponseError, ICreateLoanPayload>({
    mutationFn: async payload => {
      const { data } = await api.post<ILoanCreationResponse>('/loans', payload);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.LOANS] });
    },
  });
};

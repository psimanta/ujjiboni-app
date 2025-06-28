import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from './api';
import { QUERY_KEYS } from '../constants/queries';
import type { IResponseError } from '../interfaces/response.interface';
import type {
  ILoanCreationResponse,
  ILoansResponse,
  ILoanResponse,
  ICreateLoanPayload,
  ICreateLoanEMIPayload,
  ILoanEMICreationResponse,
  ICreateLoanInterestPayload,
  ILoanInterestsResponse,
  ILoanEMIsResponse,
  ILoanStatsResponse,
  IOrgLoanStatsResponse,
} from '../interfaces/loan.interface';

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

export const useLoanQuery = (id: string) => {
  return useQuery<ILoanResponse, IResponseError>({
    queryKey: [QUERY_KEYS.LOAN, id],
    queryFn: async () => {
      const { data } = await api.get<ILoanResponse>(`/loans/${id}`);
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

export const useLoanEMIsQuery = (loanId: string) => {
  return useQuery<ILoanEMIsResponse, IResponseError>({
    queryKey: [QUERY_KEYS.LOAN_EMIS, loanId],
    queryFn: async () => {
      const { data } = await api.get<ILoanEMIsResponse>(`/loans/${loanId}/payments`);
      return data;
    },
    enabled: !!loanId,
  });
};

export const useCreateLoanEMIMutation = () => {
  const queryClient = useQueryClient();
  return useMutation<
    ILoanEMICreationResponse,
    IResponseError,
    { loanId: string; payload: ICreateLoanEMIPayload }
  >({
    mutationFn: async ({ loanId, payload }) => {
      const { data } = await api.post<ILoanEMICreationResponse>(
        `/loans/${loanId}/payments`,
        payload
      );
      return data;
    },
    onSuccess: (_, { loanId }) => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.LOAN_EMIS, loanId] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.LOAN, loanId] });
    },
  });
};

export const useLoanInterestsQuery = (loanId: string) => {
  return useQuery<ILoanInterestsResponse, IResponseError>({
    queryKey: [QUERY_KEYS.LOAN_INTERESTS, loanId],
    queryFn: async () => {
      const { data } = await api.get<ILoanInterestsResponse>(`/loans/${loanId}/interests`);
      return data;
    },
    enabled: !!loanId,
  });
};

export const useCreateLoanInterestMutation = () => {
  const queryClient = useQueryClient();
  return useMutation<
    ILoanInterestsResponse,
    IResponseError,
    {
      loanId: string;
      payload: ICreateLoanInterestPayload;
    }
  >({
    mutationFn: async ({ loanId, payload }) => {
      const { data } = await api.post(`/loans/${loanId}/interests`, payload);
      return data;
    },
    onSuccess: (_, { loanId }) => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.LOAN_INTERESTS, loanId] });
    },
  });
};

export const useLoanMemberStatsQuery = () => {
  return useQuery<ILoanStatsResponse, IResponseError>({
    queryKey: [QUERY_KEYS.LOAN_STATS],
    queryFn: async () => {
      const { data } = await api.get('/loans/member/stats');
      return data;
    },
  });
};

export const useOrgLoanStatsQuery = () => {
  return useQuery<IOrgLoanStatsResponse, IResponseError>({
    queryKey: [QUERY_KEYS.ORG_LOAN_STATS],
    queryFn: async () => {
      const { data } = await api.get('/loans/stats');
      return data;
    },
  });
};

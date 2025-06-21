import type { IResponseGeneric } from './response.interface';

export enum LoanStatus {
  ACTIVE = 'ACTIVE',
  COMPLETED = 'COMPLETED',
}

export enum LoanType {
  PERSONAL = 'PERSONAL',
  BUSINESS = 'BUSINESS',
  EMERGENCY = 'EMERGENCY',
  EDUCATION = 'EDUCATION',
}

export interface ILoan {
  _id: string;
  memberId: {
    _id: string;
    email: string;
    fullName: string;
  };
  loanType: LoanType;
  loanNumber: string;
  principalAmount: number;
  monthlyInterestRate: number;
  status: LoanStatus;
  notes?: string;
  loanDisbursementMonth: string;
  interestStartMonth: string;
  enteredBy: {
    _id: string;
    email: string;
    fullName: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface ILoanEMI {
  _id: string;
  loan: {
    _id: string;
    loanNumber: string;
    principalAmount: number;
    id: string;
  };
  paymentDate: string;
  amount: number;
  enteredBy: {
    _id: string;
    email: string;
    fullName: string;
  };
  notes: string;
  createdAt: string;
  updatedAt: string;
}

export interface ILoanInterest {
  _id: string;
  loan: ILoan;
  paymentDate?: string;
  penaltyAmount: number;
  interestAmount: number;
  paidAmount: number;
  enteredBy: {
    _id: string;
    email: string;
    fullName: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface ILoansResponse extends IResponseGeneric {
  loans: ILoan[];
}

export interface ILoanResponse extends IResponseGeneric {
  loan: ILoan;
  outstandingBalance: number;
}

export interface ILoanCreationResponse extends IResponseGeneric {
  loan: ILoan;
}
export interface ICreateLoanPayload {
  memberId: string;
  loanType: LoanType;
  principalAmount: number;
  monthlyInterestRate: number;
  notes: string;
  interestStartMonth: string;
  loanDisbursementMonth: string;
}

export interface ICreateLoanEMIPayload {
  amount: number;
  notes: string;
  paymentDate: Date;
}

export interface ILoanEMICreationResponse extends IResponseGeneric {
  payment: ILoanEMI;
}

export interface ICreateLoanInterestPayload {
  interestAmount: number;
  paidAmount: number;
  paymentDate: string;
}

export interface ILoanInterestsResponse extends IResponseGeneric {
  interests: ILoanInterest[];
  paymentSummary: {
    totalPayments: number;
    totalInterest: number;
    totalPaidAmount: number;
  };
}

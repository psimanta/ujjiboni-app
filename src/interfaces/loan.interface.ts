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
  loanId: string;
  amount: number;
  dueDate: string;
  paidDate?: string;
  status: 'PENDING' | 'PAID' | 'OVERDUE';
  enteredBy?: {
    _id: string;
    email: string;
    fullName: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface ILoanInterest {
  _id: string;
  loanId: string;
  amount: number;
  month: string;
  paidDate?: string;
  status: 'PENDING' | 'PAID' | 'OVERDUE';
  enteredBy?: {
    _id: string;
    email: string;
    fullName: string;
  };
  createdAt: string;
  updatedAt: string;
}

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

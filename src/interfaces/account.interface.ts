export interface IAccount {
  name: string;
  balance: number;
  _id: string;
  accountHolder: {
    _id: string;
    email: string;
    fullName: string;
  };
  createdBy?: {
    _id: string;
    email: string;
    fullName: string;
  };
  isLocked: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ITransaction {
  _id: string;
  accountId: string;
  type: 'debit' | 'credit';
  amount: number;
  comment: string;
  enteredBy: string;
  transactionDate: string;
  createdAt: string;
  updatedAt: string;
}

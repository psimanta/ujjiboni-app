export const TRANSACTION_TYPE = {
  debit: 'Withdraw',
  credit: 'Deposit',
};

export const ACCOUNT_TYPES = [
  { value: 'savings', label: 'Savings Account' },
  { value: 'cash', label: 'Cash' },
  { value: 'fdr', label: 'Fixed Deposit Receipt (FDR)' },
  { value: 'dps', label: 'Deposit Pension Scheme (DPS)' },
  { value: 'shanchaypatra', label: 'Shanchay Patra' },
  { value: 'other', label: 'Other' },
];

export const ACCOUNT_TYPES_MAP = {
  savings: 'Savings',
  cash: 'Cash',
  fdr: 'FDR',
  dps: 'DPS',
  shanchaypatra: 'Shanchay Patra',
  other: 'Other',
};

export const ACCOUNT_TYPES_COLORS = {
  savings: 'blue',
  cash: 'green',
  fdr: 'orange',
  dps: 'indigo',
  shanchaypatra: 'cyan',
  other: 'gray',
};

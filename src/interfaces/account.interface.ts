export interface IAccount {
  id: string;
  name: string;
  accountHolder: {
    _id: string;
    email: string;
    fullName: string;
  };
  isLocked: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface IUser {
  _id: string;
  email: string;
  fullName: string;
  role: 'MEMBER' | 'ADMIN';
  isFirstLogin: boolean;
  createdAt: string;
  updatedAt: string;
  __v: number;
  lastLogin: string;
}

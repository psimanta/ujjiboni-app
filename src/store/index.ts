import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { MantineColorScheme } from '@mantine/core';
import type { IUser } from '../interfaces/user.interface';
import { storage } from '../utils/local-storage';

interface IStore {
  isAuthenticated: boolean;
  theme: MantineColorScheme;
  user: IUser | null;
  members: IUser[];
}

interface IStoreActions {
  setIsAuthenticated: (isAuthenticated: boolean) => void;
  toggleTheme: () => void;
  setUser: (user: IUser) => void;
  logout: () => void;
  setMembers: (members: IUser[]) => void;
}

export const useStore = create<IStore & IStoreActions>()(
  persist(
    set => ({
      theme: 'dark',
      isAuthenticated: false,
      user: null,
      members: [],
      setMembers: (members: IUser[]) => set({ members }),
      setIsAuthenticated: (isAuthenticated: boolean) => set({ isAuthenticated }),
      toggleTheme: () => set(state => ({ theme: state.theme === 'dark' ? 'light' : 'dark' })),
      setUser: (user: IUser) => set({ user }),
      logout: () => {
        set({ isAuthenticated: false, user: null });
        storage.remove('token');
      },
    }),
    {
      name: 'ujjiboni-store',
      storage: createJSONStorage(() => localStorage),
    }
  )
);

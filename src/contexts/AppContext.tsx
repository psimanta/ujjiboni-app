import type { MantineColorScheme } from '@mantine/core';
import {
  createContext,
  useContext,
  useEffect,
  useState,
  type Dispatch,
  type ReactNode,
  type SetStateAction,
} from 'react';
import { storage } from '../utils/local-storage';

const getSystemColorScheme = (): MantineColorScheme => {
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
};
interface AppContextType {
  colorScheme: MantineColorScheme;
  setColorScheme: Dispatch<SetStateAction<MantineColorScheme>>;
  toggleColorScheme: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppContextProvider({ children }: { children: ReactNode }) {
  const [colorScheme, setColorScheme] = useState<MantineColorScheme>(() => {
    // First try to get from localStorage
    const storedTheme = storage.get<MantineColorScheme>('ujjiboni-app-color-scheme');
    if (storedTheme) return storedTheme;

    // If no stored theme, use system preference
    return getSystemColorScheme();
  });

  // Save to localStorage whenever colorScheme changes
  useEffect(() => {
    storage.set('ujjiboni-app-color-scheme', colorScheme);
  }, [colorScheme]);

  const toggleColorScheme = () => {
    setColorScheme(current => (current === 'dark' ? 'light' : 'dark'));
  };

  return (
    <AppContext.Provider value={{ colorScheme, setColorScheme, toggleColorScheme }}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
}

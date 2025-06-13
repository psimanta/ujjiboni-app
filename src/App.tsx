import { MantineProvider, createTheme } from '@mantine/core';
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { AuthProvider } from './contexts/AuthContext';
import { AppContextProvider, useAppContext } from './contexts/AppContext';
import { queryClient } from './queries/queryClient';
import { AppRouter } from './router';

function AppContent() {
  const { colorScheme } = useAppContext();

  const theme = createTheme({
    cursorType: 'pointer',
  });

  return (
    <QueryClientProvider client={queryClient}>
      <MantineProvider theme={theme} forceColorScheme={colorScheme as 'light' | 'dark'}>
        <AppRouter />
      </MantineProvider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}

function App() {
  return (
    <AppContextProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </AppContextProvider>
  );
}

export default App;

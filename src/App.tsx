import { MantineProvider, createTheme } from '@mantine/core';
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { queryClient } from './queries/queryClient';
import { AppRouter } from './router';
import { useStore } from './store';

function AppContent() {
  const { theme: colorScheme } = useStore();

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
  return <AppContent />;
}

export default App;

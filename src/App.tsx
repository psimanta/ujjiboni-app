import { MantineProvider } from "@mantine/core";
import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { AuthProvider } from "./contexts/AuthContext";
import { ThemeProvider } from "./contexts/ThemeContext";
import { useTheme } from "./contexts/ThemeContext";
import { queryClient } from "./queries/queryClient";
import { AppRouter } from "../router/router";

function AppContent() {
  const { colorScheme } = useTheme();

  return (
    <QueryClientProvider client={queryClient}>
      <MantineProvider
        defaultColorScheme={colorScheme}
        forceColorScheme={colorScheme as "light" | "dark"}
      >
        <AppRouter />
      </MantineProvider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;

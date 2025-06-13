import { AppShell, Image, Group, Container, ActionIcon } from '@mantine/core';
import { Outlet } from 'react-router-dom';
import { ThemeToggle } from '../components/ThemeToggle';
import logo from '../assets/ujjiboni_logo.png';
import { useProfileQuery } from '../queries/auth.queries';
import { IconPower } from '@tabler/icons-react';
import { useStore } from '../store';
import { useEffect } from 'react';
import { FullPageLoader } from '../components/FullPageLoader';

export function AppLayout() {
  const { isError, isPending } = useProfileQuery();
  const { logout, isAuthenticated } = useStore(state => state);

  useEffect(() => {
    if (isError) {
      logout();
    }
  }, [isError, logout]);

  return (
    <AppShell header={{ height: 60 }} padding="md" layout="default" withBorder={false}>
      <AppShell.Header
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 1000,
        }}
        className="shadow-sm"
      >
        <Group h={60} px="md" justify="space-between">
          <Group gap={4}>
            <Image
              src={logo}
              alt="Ujjiboni Logo"
              style={{ width: 36, height: 36, cursor: 'pointer' }}
              onClick={() => (window.location.href = '/')}
            />
          </Group>
          {/* <Burger opened={false} hiddenFrom="sm" size="sm" /> */}
          <Group gap={8}>
            <ThemeToggle />
            {isAuthenticated && (
              <ActionIcon variant="transparent" onClick={() => logout()}>
                <IconPower color="var(--mantine-color-red-5)" size={22} stroke={1.5} />
              </ActionIcon>
            )}
          </Group>
        </Group>
      </AppShell.Header>

      <AppShell.Main>
        {isPending ? (
          <FullPageLoader />
        ) : (
          <Container className="h-[calc(100vh-100px)]">
            <Outlet />
          </Container>
        )}
      </AppShell.Main>
    </AppShell>
  );
}

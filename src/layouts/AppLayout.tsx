import { AppShell, Image, Group, Container } from '@mantine/core';
import { Outlet } from 'react-router-dom';
import { ThemeToggle } from '../components/ThemeToggle';
import logo from '../assets/ujjiboni_logo.png';
import { useProfileQuery } from '../queries/auth.queries';

export function AppLayout() {
  const { data: profile, error } = useProfileQuery();

  console.log(profile, error);

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
          <ThemeToggle />
        </Group>
      </AppShell.Header>

      <AppShell.Main>
        <Container className="h-[calc(100vh-100px)]">
          <Outlet />
        </Container>
      </AppShell.Main>
    </AppShell>
  );
}

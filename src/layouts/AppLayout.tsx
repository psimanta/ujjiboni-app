import { AppShell, Burger, Group } from '@mantine/core';
import { Outlet } from 'react-router-dom';
import { ThemeToggle } from '../components/ThemeToggle';

export function AppLayout() {
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
      >
        <Group h="100%" px="md" justify="space-between">
          <Burger opened={false} hiddenFrom="sm" size="sm" />
          <ThemeToggle />
        </Group>
      </AppShell.Header>

      <AppShell.Main pt={60} style={{ paddingTop: 60 }}>
        <Outlet />
      </AppShell.Main>
    </AppShell>
  );
}

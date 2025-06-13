import {
  AppShell,
  Image,
  Group,
  Container,
  ActionIcon,
  NavLink,
  Stack,
  Burger,
} from '@mantine/core';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useDisclosure } from '@mantine/hooks';
import { ThemeToggle } from '../components/ThemeToggle';
import logo from '../assets/ujjiboni_logo.png';
import { useProfileQuery } from '../queries/auth.queries';
import {
  IconPower,
  IconLayoutDashboard,
  IconSettings,
  IconBuildingBank,
} from '@tabler/icons-react';
import { useStore } from '../store';
import { useEffect } from 'react';
import { FullPageLoader } from '../components/FullPageLoader';

const navigationItems = [
  { label: 'Dashboard', icon: IconLayoutDashboard, path: '/' },
  { label: 'Accounts', icon: IconBuildingBank, path: '/accounts' },
  { label: 'Settings', icon: IconSettings, path: '/settings' },
];

export function AppLayout() {
  const { isError, isPending } = useProfileQuery();
  const { logout, isAuthenticated } = useStore(state => state);
  const location = useLocation();
  const navigate = useNavigate();
  const [opened, { toggle, close }] = useDisclosure();

  useEffect(() => {
    if (isError) {
      logout();
    }
  }, [isError, logout]);

  return (
    <AppShell
      header={{ height: 60 }}
      navbar={
        isAuthenticated
          ? {
              width: 280,
              breakpoint: 'sm',
              collapsed: { mobile: !opened },
            }
          : undefined
      }
      padding="md"
      layout="default"
      withBorder
    >
      <AppShell.Header
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 1000,
        }}
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
          <Group gap={8}>
            <ThemeToggle />
            {isAuthenticated && (
              <>
                <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
                <ActionIcon variant="transparent" onClick={() => logout()}>
                  <IconPower color="var(--mantine-color-red-5)" size={22} stroke={1.5} />
                </ActionIcon>
              </>
            )}
          </Group>
        </Group>
      </AppShell.Header>

      {isAuthenticated && (
        <AppShell.Navbar p="md">
          <Stack gap="xs">
            {/* Navigation Items */}
            {navigationItems.map(item => (
              <NavLink
                key={item.path}
                href={item.path}
                label={item.label}
                leftSection={<item.icon size={20} stroke={1.5} />}
                active={location.pathname === item.path}
                onClick={e => {
                  e.preventDefault();
                  navigate(item.path);
                  close(); // Close sidebar on mobile after navigation
                }}
                style={{
                  borderRadius: 'var(--mantine-radius-sm)',
                }}
              />
            ))}
          </Stack>
        </AppShell.Navbar>
      )}

      <AppShell.Main>
        {isPending ? (
          <FullPageLoader />
        ) : (
          <Container className="h-[calc(100vh-100px)]" size="xl">
            <Outlet />
          </Container>
        )}
      </AppShell.Main>
    </AppShell>
  );
}

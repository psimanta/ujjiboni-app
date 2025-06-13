import { Container, Title, Text, Stack, Card, Group, Badge } from '@mantine/core';
import { IconLayoutDashboard } from '@tabler/icons-react';
import { useStore } from '../store';

export function HomePage() {
  const { user } = useStore(state => state);

  return (
    <Container size="md" py="xl">
      <Stack gap="xl">
        <Stack gap="md" align="flex-start">
          <Group gap="sm">
            <IconLayoutDashboard size={32} stroke={1.5} />
            <Title order={1} size="h2" fw={600} c="dimmed">
              Hello, {user?.fullName}!
            </Title>
          </Group>
        </Stack>

        {/* Status Section */}
        <Group gap="md">
          <Badge variant="light" color="green" size="lg">
            System Online
          </Badge>
          <Badge variant="light" color="blue" size="lg">
            All Services Running
          </Badge>
        </Group>

        {/* Quick Stats */}
        <Group gap="md" w="100%" maw={600}>
          <Card shadow="xs" padding="md" radius="md" flex={1}>
            <Stack gap="xs" align="center">
              <Text size="xl" fw={700} c="blue">
                24/7
              </Text>
              <Text size="sm" c="dimmed" ta="center">
                Uptime
              </Text>
            </Stack>
          </Card>

          <Card shadow="xs" padding="md" radius="md" flex={1}>
            <Stack gap="xs" align="center">
              <Text size="xl" fw={700} c="green">
                100%
              </Text>
              <Text size="sm" c="dimmed" ta="center">
                Performance
              </Text>
            </Stack>
          </Card>

          <Card shadow="xs" padding="md" radius="md" flex={1}>
            <Stack gap="xs" align="center">
              <Text size="xl" fw={700} c="orange">
                0
              </Text>
              <Text size="sm" c="dimmed" ta="center">
                Issues
              </Text>
            </Stack>
          </Card>
        </Group>
      </Stack>
    </Container>
  );
}

import {
  Card,
  Text,
  Group,
  Stack,
  Badge,
  ActionIcon,
  SimpleGrid,
  Skeleton,
  NumberFormatter,
  Title,
} from '@mantine/core';
import { IconBuildingBank, IconEye, IconArrowRight } from '@tabler/icons-react';
import { useAccountsQuery } from '../../queries/account.queries';

// Generate dummy balance for demonstration
const generateDummyBalance = (accountId: string) => {
  const seed = accountId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return (seed % 500000) + 50000; // Balance between 50,000 and 550,000 BDT
};

export function ListAccounts() {
  const { data, isPending } = useAccountsQuery();
  const accounts = data?.accounts;

  return (
    <Stack gap="lg">
      <Title order={2} size="h3" fw={600}>
        Accounts
      </Title>

      {isPending ? (
        <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }} spacing="md">
          {Array.from({ length: 6 }).map((_, index) => (
            <Skeleton key={index} height={180} radius="md" />
          ))}
        </SimpleGrid>
      ) : !accounts || accounts.length === 0 ? (
        <Card shadow="sm" padding="xl" radius="md" withBorder>
          <Stack align="center" gap="md">
            <IconBuildingBank size={48} stroke={1.5} color="var(--mantine-color-gray-5)" />
            <Text size="lg" fw={500} c="dimmed">
              No accounts found
            </Text>
            <Text size="sm" c="dimmed" ta="center">
              You don't have any accounts yet. Contact your administrator to set up accounts.
            </Text>
          </Stack>
        </Card>
      ) : (
        <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }} spacing="md">
          {accounts.map(account => {
            const balance = generateDummyBalance(account.id);

            return (
              <Card
                key={account.id}
                shadow="sm"
                padding="lg"
                radius="md"
                withBorder
                style={{
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: 'var(--mantine-shadow-md)',
                  },
                }}
                onClick={() => {
                  // Handle card click - navigate to account details
                  console.log('Navigate to account:', account.id);
                }}
              >
                <Stack gap="md">
                  {/* Header with Bank Icon and Actions */}
                  <Group justify="space-between" align="flex-start">
                    <Group gap="sm">
                      <div
                        style={{
                          width: 40,
                          height: 40,
                          borderRadius: '8px',
                          backgroundColor: 'var(--mantine-color-blue-1)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <IconBuildingBank size={20} color="var(--mantine-color-blue-6)" />
                      </div>
                      <Badge variant="light" color="blue" size="sm">
                        Savings
                      </Badge>
                    </Group>
                    <Group gap="xs">
                      <ActionIcon
                        variant="subtle"
                        color="gray"
                        size="sm"
                        onClick={e => {
                          e.stopPropagation();
                          console.log('View account details:', account.id);
                        }}
                      >
                        <IconEye size={16} />
                      </ActionIcon>
                      <ActionIcon
                        variant="subtle"
                        color="blue"
                        size="sm"
                        onClick={e => {
                          e.stopPropagation();
                          console.log('Navigate to account:', account.id);
                        }}
                      >
                        <IconArrowRight size={16} />
                      </ActionIcon>
                    </Group>
                  </Group>

                  {/* Account Information */}
                  <Stack gap="xs">
                    <Text size="lg" fw={600} lineClamp={1}>
                      {account.name}
                    </Text>
                    <Text size="sm" c="dimmed" lineClamp={1}>
                      Account Holder: {account.accountHolder.fullName || 'N/A'}
                    </Text>
                    <Text size="xs" c="dimmed" ff="monospace">
                      ID: {account.id}
                    </Text>
                  </Stack>

                  {/* Balance */}
                  <Group justify="space-between" align="center" mt="auto">
                    <Stack gap={2}>
                      <Text size="xs" c="dimmed" tt="uppercase" fw={500}>
                        Balance
                      </Text>
                      <Text size="xl" fw={700} c="green">
                        <NumberFormatter value={balance} prefix="৳ " thousandSeparator="," />
                      </Text>
                    </Stack>
                    {account.isLocked ? (
                      <Badge variant="dot" color="red" size="sm">
                        Locked
                      </Badge>
                    ) : (
                      <Badge variant="dot" color="green" size="sm">
                        Active
                      </Badge>
                    )}
                  </Group>
                </Stack>
              </Card>
            );
          })}
        </SimpleGrid>
      )}
    </Stack>
  );
}

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
  Button,
} from '@mantine/core';
import { IconBuildingBank, IconArrowRight, IconPlus } from '@tabler/icons-react';
import { useDisclosure } from '@mantine/hooks';
import { useAccountsQuery } from '../../queries/account.queries';
import { CreateAccountModal } from './CreateAccountModal';
import { useNavigate } from 'react-router-dom';

export function ListAccounts() {
  const { data, isPending } = useAccountsQuery();
  const accounts = data?.accounts || [];
  const [modalOpened, { open: openModal, close: closeModal }] = useDisclosure(false);
  const navigate = useNavigate();

  return (
    <Stack gap="lg">
      <Group justify="space-between" align="center">
        <Title order={2} size="h3" fw={600}>
          Accounts
        </Title>
        <Button
          leftSection={<IconPlus size={16} />}
          onClick={openModal}
          variant="filled"
          radius="md"
        >
          Create Account
        </Button>
      </Group>

      {isPending ? (
        <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }} spacing="md">
          {Array.from({ length: 6 }).map((_, index) => (
            <Skeleton key={index} height={180} radius="md" />
          ))}
        </SimpleGrid>
      ) : !accounts || accounts.length === 0 ? (
        <Card shadow="sm" padding="xl" radius="lg" withBorder>
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
        <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }} spacing="lg">
          {accounts.map(account => {
            const balance = account.balance;

            return (
              <Card
                key={account._id}
                shadow="sm"
                padding="lg"
                radius="lg"
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
                  console.log('Navigate to account:', account._id);
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
                        color="blue"
                        size="sm"
                        onClick={e => {
                          e.stopPropagation();
                          navigate(`/accounts/${account._id}`);
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

      <CreateAccountModal opened={modalOpened} onClose={closeModal} />
    </Stack>
  );
}

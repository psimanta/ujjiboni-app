import {
  Card,
  Text,
  Group,
  Stack,
  Badge,
  SimpleGrid,
  Skeleton,
  NumberFormatter,
  Title,
  Button,
  Select,
} from '@mantine/core';
import { IconBuildingBank, IconPlus } from '@tabler/icons-react';
import { useDisclosure } from '@mantine/hooks';
import { useAccountsQuery } from '../../../queries/account.queries';
import { CreateAccountModal } from './CreateAccountModal';
import { useNavigate } from 'react-router-dom';
import { ACCOUNT_TYPES_COLORS, ACCOUNT_TYPES_MAP, ACCOUNT_TYPES } from '../../../constants/account';
import { useState } from 'react';

export function ListAccounts() {
  const { data, isPending } = useAccountsQuery();
  const accounts = data?.accounts || [];
  const [modalOpened, { open: openModal, close: closeModal }] = useDisclosure(false);
  const navigate = useNavigate();
  const [selectedAccountType, setSelectedAccountType] = useState<string>('all');

  // Filter accounts based on selected type
  const filteredAccounts =
    selectedAccountType === 'all'
      ? accounts
      : accounts.filter(account => account.type === selectedAccountType);

  const accountTypeOptions = [{ value: 'all', label: 'All Types' }, ...ACCOUNT_TYPES];

  return (
    <Stack gap="lg">
      <Group justify="space-between" align="center">
        <Title order={2} size="h3" fw={600}>
          Accounts
        </Title>
        {/* Filter Controls */}
        <Group justify="flex-start">
          <Select
            placeholder="Select account type"
            data={accountTypeOptions}
            value={selectedAccountType}
            onChange={value => setSelectedAccountType(value || 'all')}
            clearable={false}
            radius="md"
            size="sm"
            w={200}
          />
          <Button
            leftSection={<IconPlus size={16} />}
            onClick={openModal}
            variant="filled"
            size="sm"
            radius="md"
          >
            Create Account
          </Button>
        </Group>
      </Group>

      {isPending ? (
        <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }} spacing="md">
          {Array.from({ length: 6 }).map((_, index) => (
            <Skeleton key={index} height={180} radius="md" />
          ))}
        </SimpleGrid>
      ) : !filteredAccounts || filteredAccounts.length === 0 ? (
        <Card shadow="sm" padding="xl" radius="lg" withBorder>
          <Stack align="center" gap="md">
            <IconBuildingBank size={48} stroke={1.5} color="var(--mantine-color-gray-5)" />
            <Text size="lg" fw={500} c="dimmed">
              {selectedAccountType === 'all'
                ? 'No accounts found'
                : `No ${ACCOUNT_TYPES_MAP[selectedAccountType as keyof typeof ACCOUNT_TYPES_MAP]} accounts found`}
            </Text>
            <Text size="sm" c="dimmed" ta="center">
              {selectedAccountType === 'all'
                ? "You don't have any accounts yet. Contact your administrator to set up accounts."
                : `No accounts of type "${ACCOUNT_TYPES_MAP[selectedAccountType as keyof typeof ACCOUNT_TYPES_MAP]}" are available.`}
            </Text>
          </Stack>
        </Card>
      ) : (
        <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }} spacing="lg">
          {filteredAccounts.map(account => {
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
                  navigate(`/accounts/${account._id}`);
                }}
              >
                <Stack gap="md">
                  <Stack gap="xs">
                    <Group justify="space-between">
                      <Text size="lg" fw={600} lineClamp={1}>
                        {account.name}
                      </Text>
                      <Badge variant="light" color={ACCOUNT_TYPES_COLORS[account.type]} size="md">
                        {ACCOUNT_TYPES_MAP[account.type]}
                      </Badge>
                    </Group>

                    <Text size="sm" c="dimmed" lineClamp={1}>
                      Account Holder: {account.accountHolder.fullName || 'N/A'}
                    </Text>
                  </Stack>

                  {/* Balance */}
                  <Group justify="space-between" align="flex-end" mt="auto">
                    <Stack gap={2}>
                      <Text size="xs" c="dimmed" tt="uppercase" fw={500}>
                        Balance
                      </Text>
                      <Text size="xl" fw={700} c="green">
                        <NumberFormatter
                          value={balance}
                          prefix="৳ "
                          thousandSeparator=","
                          thousandsGroupStyle="lakh"
                        />
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

import {
  Table,
  Text,
  Card,
  Stack,
  NumberFormatter,
  ScrollArea,
  Center,
  Badge,
  Title,
  Group,
} from '@mantine/core';
import { IconBuildingBank } from '@tabler/icons-react';
import { useAccountsQuery } from '../../../queries/account.queries';
import { ACCOUNT_TYPES_MAP, ACCOUNT_TYPES_COLORS } from '../../../constants/account';
import { useOrgLoanStatsQuery } from '../../../queries/loan.queries';

export function OrganizationSummary() {
  const { data, isPending } = useAccountsQuery({ sortBy: 'type', sortOrder: 'asc' });
  const { data: loanStats } = useOrgLoanStatsQuery();
  const accounts = data?.accounts || [];

  const orgLoanStats = loanStats?.data;
  const totalOutstandingBalance = orgLoanStats?.totalOutstandingBalance;
  const totalInterestDue = orgLoanStats?.totalInterestDue;

  // Calculate total balance
  const totalNetBalance = accounts.reduce((sum, account) => sum + account.balance, 0);
  const grossTotal = (totalOutstandingBalance ?? 0) + (totalInterestDue ?? 0) + totalNetBalance;

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder>
      <Stack gap="md">
        <Group justify="space-between" align="center">
          <Group gap="sm">
            <IconBuildingBank size={20} />
            <Title order={3} size="h4" fw={600}>
              Organization Summary
            </Title>
          </Group>
          <Badge variant="light" color="green" size="lg">
            {accounts.length} Accounts
          </Badge>
        </Group>

        <ScrollArea>
          <Table striped highlightOnHover withTableBorder withColumnBorders>
            <Table.Thead>
              <Table.Tr>
                <Table.Th>Account Name</Table.Th>
                <Table.Th>Type</Table.Th>
                <Table.Th>Current Balance</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {isPending ? (
                // Loading skeleton
                Array.from({ length: 3 }).map((_, index) => (
                  <Table.Tr key={index}>
                    <Table.Td>
                      <div
                        style={{
                          height: 16,
                          backgroundColor: 'var(--mantine-color-gray-3)',
                          borderRadius: 4,
                        }}
                      />
                    </Table.Td>
                    <Table.Td>
                      <div
                        style={{
                          height: 20,
                          width: 80,
                          backgroundColor: 'var(--mantine-color-gray-3)',
                          borderRadius: 4,
                        }}
                      />
                    </Table.Td>
                    <Table.Td>
                      <div
                        style={{
                          height: 16,
                          width: 100,
                          backgroundColor: 'var(--mantine-color-gray-3)',
                          borderRadius: 4,
                        }}
                      />
                    </Table.Td>
                  </Table.Tr>
                ))
              ) : accounts.length === 0 ? (
                <Table.Tr>
                  <Table.Td colSpan={3}>
                    <Center py="xl">
                      <Stack align="center" gap="md">
                        <IconBuildingBank
                          size={48}
                          stroke={1.5}
                          color="var(--mantine-color-gray-5)"
                        />
                        <Text size="lg" fw={500} c="dimmed">
                          No accounts found
                        </Text>
                        <Text size="sm" c="dimmed" ta="center">
                          There are no accounts to display.
                        </Text>
                      </Stack>
                    </Center>
                  </Table.Td>
                </Table.Tr>
              ) : (
                <>
                  {/* Account rows */}
                  {accounts.map(account => (
                    <Table.Tr key={account._id}>
                      <Table.Td>
                        <Text size="sm" fw={500}>
                          {account.name}
                        </Text>
                      </Table.Td>
                      <Table.Td>
                        <Badge variant="light" color={ACCOUNT_TYPES_COLORS[account.type]} size="sm">
                          {ACCOUNT_TYPES_MAP[account.type]}
                        </Badge>
                      </Table.Td>
                      <Table.Td>
                        <Text size="sm" fw={600} c="green">
                          <NumberFormatter
                            value={account.balance}
                            prefix="৳ "
                            thousandSeparator=","
                            thousandsGroupStyle="lakh"
                          />
                        </Text>
                      </Table.Td>
                    </Table.Tr>
                  ))}

                  {/* Total row */}
                  <Table.Tr>
                    <Table.Td colSpan={2}>
                      <Text size="sm" fw={700} ta="right">
                        Net Total
                      </Text>
                    </Table.Td>
                    <Table.Td>
                      <Text size="md" fw={700} c="blue">
                        <NumberFormatter
                          value={totalNetBalance}
                          prefix="৳ "
                          thousandSeparator=","
                          thousandsGroupStyle="lakh"
                        />
                      </Text>
                    </Table.Td>
                  </Table.Tr>
                  <Table.Tr>
                    <Table.Td colSpan={2}>
                      <Text size="sm" fw={700} ta="right">
                        Total Loan Due
                      </Text>
                    </Table.Td>
                    <Table.Td>
                      <Text size="md" fw={700} c="orange">
                        <NumberFormatter
                          value={totalOutstandingBalance}
                          prefix="৳ "
                          thousandSeparator=","
                          thousandsGroupStyle="lakh"
                        />
                      </Text>
                    </Table.Td>
                  </Table.Tr>
                  <Table.Tr>
                    <Table.Td colSpan={2}>
                      <Text size="sm" fw={700} ta="right">
                        Total Interest Due
                      </Text>
                    </Table.Td>
                    <Table.Td>
                      <Text size="md" fw={700} c="red">
                        <NumberFormatter
                          value={totalInterestDue}
                          prefix="৳ "
                          thousandSeparator=","
                          thousandsGroupStyle="lakh"
                        />
                      </Text>
                    </Table.Td>
                  </Table.Tr>
                  <Table.Tr>
                    <Table.Td colSpan={2}>
                      <Text size="sm" fw={700} ta="right">
                        Gross Total
                      </Text>
                    </Table.Td>
                    <Table.Td>
                      <Text size="md" fw={700} c="blue">
                        <NumberFormatter
                          value={grossTotal}
                          prefix="৳ "
                          thousandSeparator=","
                          thousandsGroupStyle="lakh"
                        />
                      </Text>
                    </Table.Td>
                  </Table.Tr>
                </>
              )}
            </Table.Tbody>
          </Table>
        </ScrollArea>
      </Stack>
    </Card>
  );
}

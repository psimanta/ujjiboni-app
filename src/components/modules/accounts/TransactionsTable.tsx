import {
  Table,
  Badge,
  Text,
  Group,
  ActionIcon,
  Card,
  Stack,
  Title,
  NumberFormatter,
  ScrollArea,
  Tooltip,
  Center,
  Pagination,
  Select,
  Divider,
} from '@mantine/core';
import { IconArrowUp, IconArrowDown, IconReceipt, IconTrash, IconEdit } from '@tabler/icons-react';
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import {
  useAccountDetailsQuery,
  useAccountTransactionsQuery,
} from '../../../queries/account.queries';
import type { ITransaction } from '../../../interfaces/account.interface';
import { TRANSACTION_TYPE } from '../../../constants/account';
import { TransactionTableLoading } from './loaders/TransactionTableLoading';
import { TransactionForm } from './TransactionForm';

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

const LIMIT_OPTIONS = [
  { value: '5', label: '5 per page' },
  { value: '10', label: '10 per page' },
  { value: '20', label: '20 per page' },
  { value: '50', label: '50 per page' },
];

const TransactionRow = ({ transaction }: { transaction: ITransaction }) => {
  const isCredit = transaction.type === 'credit';

  return (
    <Table.Tr>
      <Table.Td>
        <Group gap="sm">
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: '50%',
              backgroundColor: isCredit
                ? 'var(--mantine-color-green-1)'
                : 'var(--mantine-color-red-1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {isCredit ? (
              <IconArrowDown size={16} color="var(--mantine-color-green-6)" />
            ) : (
              <IconArrowUp size={16} color="var(--mantine-color-red-6)" />
            )}
          </div>
          <Stack gap={2}>
            <Text size="sm" fw={500}>
              {TRANSACTION_TYPE[transaction.type]}
            </Text>
            <Text size="xs" c="dimmed">
              {formatDate(transaction.transactionDate)}
            </Text>
          </Stack>
        </Group>
      </Table.Td>

      <Table.Td>
        <Text size="sm" lineClamp={2}>
          {transaction.comment || 'No description'}
        </Text>
      </Table.Td>

      <Table.Td>
        <Text size="sm" fw={600} c={isCredit ? 'green' : 'red'}>
          {isCredit ? '+' : '-'}
          <NumberFormatter
            value={transaction.amount}
            prefix="৳ "
            thousandSeparator=","
            thousandsGroupStyle="lakh"
          />
        </Text>
      </Table.Td>

      <Table.Td>
        <Stack gap={2}>
          <Text size="sm" fw={500}>
            {transaction.enteredBy.fullName}
          </Text>
          <Text size="xs" c="dimmed">
            {transaction.enteredBy.email}
          </Text>
        </Stack>
      </Table.Td>

      <Table.Td>
        <Group gap="xs" justify="center">
          <Tooltip label="Edit Transaction">
            <ActionIcon
              variant="subtle"
              color="gray"
              disabled
              size="sm"
              onClick={() => {
                console.log('View transaction details:', transaction._id);
              }}
            >
              <IconEdit size={16} />
            </ActionIcon>
          </Tooltip>
          <Tooltip label="Delete Transaction">
            <ActionIcon
              variant="subtle"
              color="red"
              disabled
              size="sm"
              onClick={() => {
                console.log('View transaction details:', transaction._id);
              }}
            >
              <IconTrash size={16} />
            </ActionIcon>
          </Tooltip>
        </Group>
      </Table.Td>
    </Table.Tr>
  );
};

export function TransactionsTable({
  setBreadCrumbItems,
}: {
  setBreadCrumbItems: (items: { label: string; href: string }[]) => void;
}) {
  const { id } = useParams();
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState('5');
  const { data, isPending } = useAccountTransactionsQuery(id || '', page, parseInt(limit));
  const { data: accountDetails } = useAccountDetailsQuery(id || '');

  const transactions = data?.transactions || [];
  const account = data?.account;
  const totalPages = data?.pagination?.pages || 1;
  const totalTransactions = data?.pagination?.total || 0;

  useEffect(() => {
    if (account) {
      setBreadCrumbItems([
        { label: 'Accounts', href: '/accounts' },
        { label: account.name, href: `/accounts/${id}` },
      ]);
    }
  }, [account, id, setBreadCrumbItems]);

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const handleLimitChange = (newLimit: string | null) => {
    if (newLimit) {
      setLimit(newLimit);
      setPage(1); // Reset to first page when changing limit
    }
  };

  return (
    <Stack gap="lg">
      {/* Account Summary */}
      {accountDetails && (
        <Card shadow="sm" padding="lg" radius="lg" withBorder>
          <Stack gap="md">
            <Group justify="space-between" align="center">
              <Stack gap="xs">
                <Text size="lg" fw={600}>
                  {accountDetails.account.name}
                </Text>
                <Text size="sm" c="dimmed">
                  Account Holder: {accountDetails.account.accountHolder.fullName}
                </Text>
              </Stack>
              <Stack gap="xs" align="flex-end">
                <Text size="xs" c="dimmed" tt="uppercase" fw={500}>
                  Current Balance
                </Text>
                <Text size="xl" fw={700} c="blue">
                  <NumberFormatter
                    value={accountDetails.account.balance}
                    allowNegative={false}
                    thousandsGroupStyle="lakh"
                    prefix="৳ "
                    thousandSeparator=","
                  />
                </Text>
              </Stack>
            </Group>
            <Divider />
            <TransactionForm />
          </Stack>
        </Card>
      )}

      {/* Transactions Table */}
      <Card shadow="sm" padding="lg" radius="lg" withBorder>
        <Stack gap="md">
          <Group justify="space-between" align="center">
            <Group gap="sm">
              <IconReceipt size={20} />
              <Title order={3} size="h4" fw={600}>
                Transaction History
              </Title>
            </Group>
            <Group gap="md">
              <Select
                value={limit}
                onChange={handleLimitChange}
                data={LIMIT_OPTIONS}
                size="sm"
                w={140}
                radius="md"
              />
              <Badge variant="light" color="blue" size="lg">
                {totalTransactions} Total
              </Badge>
            </Group>
          </Group>

          <ScrollArea>
            <Table striped highlightOnHover withTableBorder withColumnBorders>
              <Table.Thead>
                <Table.Tr>
                  <Table.Th>Transaction</Table.Th>
                  <Table.Th>Description</Table.Th>
                  <Table.Th>Amount</Table.Th>
                  <Table.Th>Entered By</Table.Th>
                  <Table.Th>Actions</Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {isPending ? (
                  <TransactionTableLoading />
                ) : transactions.length === 0 ? (
                  <Table.Tr>
                    <Table.Td colSpan={5}>
                      <Center py="xl">
                        <Stack align="center" gap="md">
                          <IconReceipt size={48} stroke={1.5} color="var(--mantine-color-gray-5)" />
                          <Text size="lg" fw={500} c="dimmed">
                            No transactions found
                          </Text>
                          <Text size="sm" c="dimmed" ta="center">
                            This account doesn't have any transactions yet.
                          </Text>
                        </Stack>
                      </Center>
                    </Table.Td>
                  </Table.Tr>
                ) : (
                  transactions.map(transaction => (
                    <TransactionRow key={transaction._id} transaction={transaction} />
                  ))
                )}
              </Table.Tbody>
            </Table>
          </ScrollArea>

          {/* Pagination Controls */}
          {!isPending && transactions.length > 0 && (
            <Group justify="space-between" align="center" mt="md">
              <Text size="sm" c="dimmed">
                Showing {(page - 1) * parseInt(limit) + 1} to{' '}
                {Math.min(page * parseInt(limit), totalTransactions)} of {totalTransactions}
                &nbsp;transactions
              </Text>
              <Pagination
                value={page}
                onChange={handlePageChange}
                total={totalPages}
                size="sm"
                withEdges
              />
            </Group>
          )}
        </Stack>
      </Card>
    </Stack>
  );
}

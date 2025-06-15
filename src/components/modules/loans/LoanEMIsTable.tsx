import {
  Table,
  Badge,
  Text,
  Group,
  ActionIcon,
  Card,
  Stack,
  NumberFormatter,
  ScrollArea,
  Tooltip,
  Center,
  Skeleton,
} from '@mantine/core';
import { IconCoin, IconEye, IconEdit } from '@tabler/icons-react';
import type { ILoanEMI } from '../../../interfaces/loan.interface';

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

const getStatusColor = (status: 'PENDING' | 'PAID' | 'OVERDUE') => {
  switch (status) {
    case 'PAID':
      return 'green';
    case 'PENDING':
      return 'yellow';
    case 'OVERDUE':
      return 'red';
    default:
      return 'gray';
  }
};

const EMIRow = ({ emi }: { emi: ILoanEMI }) => (
  <Table.Tr>
    <Table.Td>
      <NumberFormatter value={emi.amount} prefix="৳ " thousandSeparator="," />
    </Table.Td>
    <Table.Td>{formatDate(emi.dueDate)}</Table.Td>
    <Table.Td>{emi.paidDate ? formatDate(emi.paidDate) : '-'}</Table.Td>
    <Table.Td>
      <Badge variant="light" color={getStatusColor(emi.status)} size="sm">
        {emi.status}
      </Badge>
    </Table.Td>
    <Table.Td>
      {emi.enteredBy ? (
        <Stack gap={2}>
          <Text size="sm" fw={500}>
            {emi.enteredBy.fullName}
          </Text>
          <Text size="xs" c="dimmed">
            {emi.enteredBy.email}
          </Text>
        </Stack>
      ) : (
        '-'
      )}
    </Table.Td>
    <Table.Td>
      <Group gap="xs" justify="center">
        <Tooltip label="View Details">
          <ActionIcon variant="subtle" color="blue" size="sm">
            <IconEye size={16} />
          </ActionIcon>
        </Tooltip>
        <Tooltip label="Edit EMI">
          <ActionIcon variant="subtle" color="gray" size="sm" disabled>
            <IconEdit size={16} />
          </ActionIcon>
        </Tooltip>
      </Group>
    </Table.Td>
  </Table.Tr>
);

const LoadingSkeleton = ({ rows = 3 }: { rows?: number }) => (
  <>
    {Array.from({ length: rows }).map((_, index) => (
      <Table.Tr key={index}>
        <Table.Td>
          <Skeleton height={16} width={100} />
        </Table.Td>
        <Table.Td>
          <Skeleton height={16} width={120} />
        </Table.Td>
        <Table.Td>
          <Skeleton height={16} width={120} />
        </Table.Td>
        <Table.Td>
          <Skeleton height={20} width={70} />
        </Table.Td>
        <Table.Td>
          <Stack gap={2}>
            <Skeleton height={16} width={120} />
            <Skeleton height={12} width={150} />
          </Stack>
        </Table.Td>
        <Table.Td>
          <Group gap="xs" justify="center">
            <Skeleton height={24} width={24} />
            <Skeleton height={24} width={24} />
          </Group>
        </Table.Td>
      </Table.Tr>
    ))}
  </>
);

interface LoanEMIsTableProps {
  emis: ILoanEMI[];
  isLoading: boolean;
}

export function LoanEMIsTable({ emis, isLoading }: LoanEMIsTableProps) {
  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder>
      <ScrollArea>
        <Table striped highlightOnHover withTableBorder withColumnBorders>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Amount</Table.Th>
              <Table.Th>Due Date</Table.Th>
              <Table.Th>Paid Date</Table.Th>
              <Table.Th>Status</Table.Th>
              <Table.Th>Entered By</Table.Th>
              <Table.Th>Actions</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {isLoading ? (
              <LoadingSkeleton />
            ) : emis.length === 0 ? (
              <Table.Tr>
                <Table.Td colSpan={6}>
                  <Center py="xl">
                    <Stack align="center" gap="md">
                      <IconCoin size={48} stroke={1.5} color="var(--mantine-color-gray-5)" />
                      <Text size="lg" fw={500} c="dimmed">
                        No EMIs found
                      </Text>
                      <Text size="sm" c="dimmed" ta="center">
                        No EMI records have been created for this loan yet.
                      </Text>
                    </Stack>
                  </Center>
                </Table.Td>
              </Table.Tr>
            ) : (
              emis.map(emi => <EMIRow key={emi._id} emi={emi} />)
            )}
          </Table.Tbody>
        </Table>
      </ScrollArea>
    </Card>
  );
}

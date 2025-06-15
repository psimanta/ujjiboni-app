import {
  Table,
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
import { IconCoin, IconEdit, IconTrash } from '@tabler/icons-react';
import type { ILoanEMI } from '../../../interfaces/loan.interface';
import { EMIForm } from './EMIForm';

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

const EMIRow = ({ emi }: { emi: ILoanEMI }) => (
  <Table.Tr>
    <Table.Td>
      <NumberFormatter
        value={emi.amount}
        prefix="৳ "
        thousandSeparator=","
        thousandsGroupStyle="lakh"
      />
    </Table.Td>
    <Table.Td>{formatDate(emi.paymentDate)}</Table.Td>
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
        <Tooltip label="Edit EMI">
          <ActionIcon variant="subtle" color="gray" size="sm" disabled>
            <IconEdit size={16} />
          </ActionIcon>
        </Tooltip>
        <Tooltip label="Delete EMI">
          <ActionIcon variant="subtle" color="red" size="sm" disabled>
            <IconTrash size={16} />
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
      <EMIForm />
      <ScrollArea mt="md">
        <Table striped highlightOnHover withTableBorder withColumnBorders>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Amount</Table.Th>
              <Table.Th>Payment Date</Table.Th>
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

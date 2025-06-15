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
  Title,
} from '@mantine/core';
import { IconFileText, IconEye, IconEdit } from '@tabler/icons-react';
import type { ILoanInterest } from '../../../interfaces/loan.interface';

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

const formatMonth = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
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

const InterestRow = ({ interest }: { interest: ILoanInterest }) => (
  <Table.Tr>
    <Table.Td>
      <NumberFormatter value={interest.amount} prefix="৳ " thousandSeparator="," />
    </Table.Td>
    <Table.Td>{formatMonth(interest.month)}</Table.Td>
    <Table.Td>{interest.paidDate ? formatDate(interest.paidDate) : '-'}</Table.Td>
    <Table.Td>
      <Badge variant="light" color={getStatusColor(interest.status)} size="sm">
        {interest.status}
      </Badge>
    </Table.Td>
    <Table.Td>
      {interest.enteredBy ? (
        <Stack gap={2}>
          <Text size="sm" fw={500}>
            {interest.enteredBy.fullName}
          </Text>
          <Text size="xs" c="dimmed">
            {interest.enteredBy.email}
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
        <Tooltip label="Edit Interest">
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

interface LoanInterestsTableProps {
  interests: ILoanInterest[];
  isLoading: boolean;
}

export function LoanInterestsTable({ interests, isLoading }: LoanInterestsTableProps) {
  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder>
      <Stack gap="md">
        <Title order={3} size="h4" fw={600}>
          Interests
        </Title>
        <ScrollArea>
          <Table striped highlightOnHover withTableBorder withColumnBorders>
            <Table.Thead>
              <Table.Tr>
                <Table.Th>Amount</Table.Th>
                <Table.Th>Month</Table.Th>
                <Table.Th>Paid Date</Table.Th>
                <Table.Th>Status</Table.Th>
                <Table.Th>Entered By</Table.Th>
                <Table.Th>Actions</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {isLoading ? (
                <LoadingSkeleton />
              ) : interests.length === 0 ? (
                <Table.Tr>
                  <Table.Td colSpan={6}>
                    <Center py="xl">
                      <Stack align="center" gap="md">
                        <IconFileText size={48} stroke={1.5} color="var(--mantine-color-gray-5)" />
                        <Text size="lg" fw={500} c="dimmed">
                          No interests found
                        </Text>
                        <Text size="sm" c="dimmed" ta="center">
                          No interest records have been created for this loan yet.
                        </Text>
                      </Stack>
                    </Center>
                  </Table.Td>
                </Table.Tr>
              ) : (
                interests.map(interest => <InterestRow key={interest._id} interest={interest} />)
              )}
            </Table.Tbody>
          </Table>
        </ScrollArea>
      </Stack>
    </Card>
  );
}

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
  Pagination,
  Select,
  Skeleton,
  SimpleGrid,
} from '@mantine/core';
import { IconEye, IconEdit, IconTrash, IconBuildingBank } from '@tabler/icons-react';
import { useState } from 'react';
import { useLoansQuery } from '../../../queries/loan.queries';
import type { ILoan, LoanStatus, LoanType } from '../../../interfaces/loan.interface';
import { useStore } from '../../../store';

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

const STATUS_OPTIONS = [
  { value: 'all', label: 'All Status' },
  { value: 'ACTIVE', label: 'Active' },
  { value: 'COMPLETED', label: 'Completed' },
];

const getStatusColor = (status: LoanStatus) => {
  switch (status) {
    case 'ACTIVE':
      return 'green';
    case 'COMPLETED':
      return 'blue';
    default:
      return 'gray';
  }
};

const getLoanTypeColor = (type: LoanType) => {
  switch (type) {
    case 'PERSONAL':
      return 'blue';
    case 'BUSINESS':
      return 'green';
    case 'EMERGENCY':
      return 'red';
    case 'EDUCATION':
      return 'orange';
    default:
      return 'gray';
  }
};

const LoanRow = ({ loan }: { loan: ILoan }) => {
  return (
    <Table.Tr>
      <Table.Td>
        <Group gap="sm">
          <Stack gap={2}>
            <Text size="sm" fw={500}>
              {loan.loanNumber}
            </Text>
            <Text size="xs" c="dimmed">
              {formatDate(loan.loanDisbursementMonth)}
            </Text>
          </Stack>
        </Group>
      </Table.Td>

      <Table.Td>
        <Stack gap={2}>
          <Text size="sm" fw={500}>
            {loan.memberId.fullName}
          </Text>
          <Text size="xs" c="dimmed">
            {loan.memberId.email}
          </Text>
        </Stack>
      </Table.Td>

      <Table.Td>
        <Badge variant="light" color={getLoanTypeColor(loan.loanType)} size="sm">
          {loan.loanType}
        </Badge>
      </Table.Td>

      <Table.Td>
        <Text size="sm" fw={600} c="blue">
          <NumberFormatter value={loan.principalAmount} prefix="৳ " thousandSeparator="," />
        </Text>
      </Table.Td>

      <Table.Td>
        <Text size="sm" fw={500}>
          {loan.monthlyInterestRate}%
        </Text>
      </Table.Td>

      <Table.Td>
        <Badge variant="light" color={getStatusColor(loan.status)} size="sm">
          {loan.status}
        </Badge>
      </Table.Td>

      <Table.Td>
        <Stack gap={2}>
          <Text size="sm" fw={500}>
            {loan.enteredBy.fullName}
          </Text>
          <Text size="xs" c="dimmed">
            {loan.enteredBy.email}
          </Text>
        </Stack>
      </Table.Td>

      <Table.Td>
        <Group gap="xs" justify="center">
          <Tooltip label="View Details">
            <ActionIcon
              variant="subtle"
              color="blue"
              size="sm"
              onClick={() => {
                console.log('View loan details:', loan._id);
              }}
            >
              <IconEye size={16} />
            </ActionIcon>
          </Tooltip>
          <Tooltip label="Edit Loan">
            <ActionIcon
              variant="subtle"
              color="gray"
              disabled
              size="sm"
              onClick={() => {
                console.log('Edit loan:', loan._id);
              }}
            >
              <IconEdit size={16} />
            </ActionIcon>
          </Tooltip>
          <Tooltip label="Delete Loan">
            <ActionIcon
              variant="subtle"
              color="red"
              disabled
              size="sm"
              onClick={() => {
                console.log('Delete loan:', loan._id);
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

const LoadingSkeleton = () => (
  <>
    {Array.from({ length: 5 }).map((_, index) => (
      <Table.Tr key={index}>
        <Table.Td>
          <Group gap="sm">
            <Skeleton height={32} circle />
            <Stack gap={2}>
              <Skeleton height={16} width={100} />
              <Skeleton height={12} width={80} />
            </Stack>
          </Group>
        </Table.Td>
        <Table.Td>
          <Stack gap={2}>
            <Skeleton height={16} width={120} />
            <Skeleton height={12} width={150} />
          </Stack>
        </Table.Td>
        <Table.Td>
          <Skeleton height={20} width={80} />
        </Table.Td>
        <Table.Td>
          <Skeleton height={16} width={100} />
        </Table.Td>
        <Table.Td>
          <Skeleton height={16} width={40} />
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
            <Skeleton height={24} width={24} />
          </Group>
        </Table.Td>
      </Table.Tr>
    ))}
  </>
);

export function LoansTable() {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState('10');
  const [selectedMember, setSelectedMember] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('ACTIVE');

  const { data, isPending } = useLoansQuery(page, parseInt(limit), selectedMember, selectedStatus);
  const { members } = useStore();

  const membersData = [
    { value: 'all', label: 'All Members' },
    ...(members?.map(member => ({
      value: member._id,
      label: member.fullName,
    })) || []),
  ];

  const loans = data?.loans || [];
  const totalPages = data?.pagination?.pages || 1;
  const totalLoans = data?.pagination?.total || 0;

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const handleLimitChange = (newLimit: string | null) => {
    if (newLimit) {
      setLimit(newLimit);
      setPage(1); // Reset to first page when changing limit
    }
  };

  const handleMemberChange = (memberId: string | null) => {
    setSelectedMember(memberId || 'all');
    setPage(1); // Reset to first page when changing filter
  };

  const handleStatusChange = (status: string | null) => {
    setSelectedStatus(status || 'ACTIVE');
    setPage(1); // Reset to first page when changing filter
  };

  return (
    <Stack gap="lg">
      <Card shadow="sm" padding="lg" radius="md" withBorder>
        <Stack gap="md">
          <Group justify="space-between" align="flex-end">
            {/* Filters */}
            <SimpleGrid cols={{ base: 1, sm: 2, md: 3 }} spacing="md">
              <Select
                label="Filter by Member"
                placeholder="Select member"
                value={selectedMember}
                onChange={handleMemberChange}
                data={membersData}
                searchable
                clearable={false}
                size="sm"
              />
              <Select
                label="Filter by Status"
                placeholder="Select status"
                value={selectedStatus}
                onChange={handleStatusChange}
                data={STATUS_OPTIONS}
                clearable={false}
                size="sm"
              />
              <div /> {/* Empty div for grid alignment */}
            </SimpleGrid>
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
                {totalLoans} Total
              </Badge>
            </Group>
          </Group>

          <ScrollArea>
            <Table striped highlightOnHover withTableBorder withColumnBorders>
              <Table.Thead>
                <Table.Tr>
                  <Table.Th>Loan Number</Table.Th>
                  <Table.Th>Member</Table.Th>
                  <Table.Th>Type</Table.Th>
                  <Table.Th>Principal Amount</Table.Th>
                  <Table.Th>Interest Rate</Table.Th>
                  <Table.Th>Status</Table.Th>
                  <Table.Th>Entered By</Table.Th>
                  <Table.Th>Actions</Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {isPending ? (
                  <LoadingSkeleton />
                ) : loans.length === 0 ? (
                  <Table.Tr>
                    <Table.Td colSpan={8}>
                      <Center py="xl">
                        <Stack align="center" gap="md">
                          <IconBuildingBank
                            size={48}
                            stroke={1.5}
                            color="var(--mantine-color-gray-5)"
                          />
                          <Text size="lg" fw={500} c="dimmed">
                            No loans found
                          </Text>
                          <Text size="sm" c="dimmed" ta="center">
                            There are no loans in the system yet.
                          </Text>
                        </Stack>
                      </Center>
                    </Table.Td>
                  </Table.Tr>
                ) : (
                  loans.map(loan => <LoanRow key={loan._id} loan={loan} />)
                )}
              </Table.Tbody>
            </Table>
          </ScrollArea>

          {/* Pagination Controls */}
          {!isPending && loans.length > 0 && (
            <Group justify="space-between" align="center" mt="md">
              <Text size="sm" c="dimmed">
                Showing {(page - 1) * parseInt(limit) + 1} to{' '}
                {Math.min(page * parseInt(limit), totalLoans)} of {totalLoans} loans
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

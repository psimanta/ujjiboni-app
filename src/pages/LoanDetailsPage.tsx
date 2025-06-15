import {
  Stack,
  Card,
  Group,
  Text,
  Badge,
  NumberFormatter,
  Title,
  Table,
  ScrollArea,
  Center,
  Skeleton,
  SimpleGrid,
  ActionIcon,
  Tooltip,
} from '@mantine/core';
import {
  IconCoin,
  IconCalendar,
  IconUser,
  IconFileText,
  IconEye,
  IconEdit,
} from '@tabler/icons-react';
import { useEffect, useState } from 'react';
import { CustomBreadCrumbs } from '../components/CustomBreadCrumb';
import { useParams } from 'react-router-dom';
import { useLoanQuery, useLoanEMIsQuery, useLoanInterestsQuery } from '../queries/loan.queries';
import type { LoanStatus, LoanType, ILoanEMI, ILoanInterest } from '../interfaces/loan.interface';

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

const getStatusColor = (status: LoanStatus | 'PENDING' | 'PAID' | 'OVERDUE') => {
  switch (status) {
    case 'ACTIVE':
      return 'green';
    case 'COMPLETED':
      return 'blue';
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

export function LoanDetailsPage() {
  const [breadCrumbItems, setBreadCrumbItems] = useState<{ label: string; href: string }[]>([]);
  const { id } = useParams();
  const { data: loanData, isPending: isLoanPending } = useLoanQuery(id || '');
  const { data: emisData, isPending: isEMIsPending } = useLoanEMIsQuery(id || '');
  const { data: interestsData, isPending: isInterestsPending } = useLoanInterestsQuery(id || '');

  const loan = loanData?.loan;
  const emis = emisData?.emis || [];
  const interests = interestsData?.interests || [];

  useEffect(() => {
    if (loan) {
      setBreadCrumbItems([
        { label: 'Loans', href: '/loans' },
        { label: loan.loanNumber, href: `/loans/${id}` },
      ]);
    }
  }, [loan, id]);

  if (isLoanPending) {
    return (
      <Stack gap="xl" mt="md" pb="xl">
        <CustomBreadCrumbs
          items={[
            { label: 'Loans', href: '/loans' },
            { label: 'Loading...', href: '#' },
          ]}
        />
        <Card shadow="sm" padding="lg" radius="md" withBorder>
          <Stack gap="md">
            <Skeleton height={32} width={200} />
            <SimpleGrid cols={{ base: 1, sm: 2, md: 3 }} spacing="md">
              <Skeleton height={80} />
              <Skeleton height={80} />
              <Skeleton height={80} />
            </SimpleGrid>
          </Stack>
        </Card>
      </Stack>
    );
  }

  if (!loan) {
    return (
      <Stack gap="xl" mt="md" pb="xl">
        <CustomBreadCrumbs
          items={[
            { label: 'Loans', href: '/loans' },
            { label: 'Not Found', href: '#' },
          ]}
        />
        <Center py="xl">
          <Text size="lg" c="dimmed">
            Loan not found
          </Text>
        </Center>
      </Stack>
    );
  }

  return (
    <Stack gap="xl" mt="md" pb="xl">
      <CustomBreadCrumbs items={breadCrumbItems} />

      {/* Loan Details Card */}
      <Card shadow="sm" padding="lg" radius="md" withBorder>
        <Stack gap="md">
          <Group justify="space-between" align="center">
            <Group gap="sm">
              <IconCoin
                size={24}
                color={`var(--mantine-color-${getLoanTypeColor(loan.loanType)}-6)`}
              />
              <Title order={2} size="h3" fw={600}>
                {loan.loanNumber}
              </Title>
            </Group>
            <Badge variant="light" color={getStatusColor(loan.status)} size="lg">
              {loan.status}
            </Badge>
          </Group>

          <SimpleGrid cols={{ base: 1, sm: 2, md: 4 }} spacing="md">
            <Card withBorder radius="md" p="md">
              <Stack gap="xs">
                <Group gap="xs">
                  <IconUser size={16} />
                  <Text size="sm" c="dimmed">
                    Member
                  </Text>
                </Group>
                <Text fw={600}>{loan.memberId.fullName}</Text>
                <Text size="xs" c="dimmed">
                  {loan.memberId.email}
                </Text>
              </Stack>
            </Card>

            <Card withBorder radius="md" p="md">
              <Stack gap="xs">
                <Group gap="xs">
                  <IconCoin size={16} />
                  <Text size="sm" c="dimmed">
                    Principal Amount
                  </Text>
                </Group>
                <Text fw={600} c="blue">
                  <NumberFormatter value={loan.principalAmount} prefix="৳ " thousandSeparator="," />
                </Text>
              </Stack>
            </Card>

            <Card withBorder radius="md" p="md">
              <Stack gap="xs">
                <Group gap="xs">
                  <IconFileText size={16} />
                  <Text size="sm" c="dimmed">
                    Interest Rate
                  </Text>
                </Group>
                <Text fw={600}>{loan.monthlyInterestRate}% / month</Text>
              </Stack>
            </Card>

            <Card withBorder radius="md" p="md">
              <Stack gap="xs">
                <Group gap="xs">
                  <IconCalendar size={16} />
                  <Text size="sm" c="dimmed">
                    Loan Type
                  </Text>
                </Group>
                <Badge variant="light" color={getLoanTypeColor(loan.loanType)}>
                  {loan.loanType}
                </Badge>
              </Stack>
            </Card>
          </SimpleGrid>

          <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md">
            <Card withBorder radius="md" p="md">
              <Stack gap="xs">
                <Text size="sm" c="dimmed">
                  Disbursement Month
                </Text>
                <Text fw={500}>{formatMonth(loan.loanDisbursementMonth)}</Text>
              </Stack>
            </Card>

            <Card withBorder radius="md" p="md">
              <Stack gap="xs">
                <Text size="sm" c="dimmed">
                  Interest Start Month
                </Text>
                <Text fw={500}>{formatMonth(loan.interestStartMonth)}</Text>
              </Stack>
            </Card>
          </SimpleGrid>

          {loan.notes && (
            <Card withBorder radius="md" p="md">
              <Stack gap="xs">
                <Text size="sm" c="dimmed">
                  Notes
                </Text>
                <Text>{loan.notes}</Text>
              </Stack>
            </Card>
          )}
        </Stack>
      </Card>

      {/* EMIs Section */}
      <Card shadow="sm" padding="lg" radius="md" withBorder>
        <Stack gap="md">
          <Title order={3} size="h4" fw={600}>
            EMIs
          </Title>
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
                {isEMIsPending ? (
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
        </Stack>
      </Card>

      {/* Interests Section */}
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
                {isInterestsPending ? (
                  <LoadingSkeleton />
                ) : interests.length === 0 ? (
                  <Table.Tr>
                    <Table.Td colSpan={6}>
                      <Center py="xl">
                        <Stack align="center" gap="md">
                          <IconFileText
                            size={48}
                            stroke={1.5}
                            color="var(--mantine-color-gray-5)"
                          />
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
    </Stack>
  );
}

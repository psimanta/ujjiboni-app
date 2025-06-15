import {
  Stack,
  Card,
  Group,
  Text,
  Badge,
  NumberFormatter,
  Title,
  Center,
  Skeleton,
  SimpleGrid,
} from '@mantine/core';
import { IconCoin, IconCalendar, IconUser, IconFileText } from '@tabler/icons-react';
import { useEffect, useState } from 'react';
import { CustomBreadCrumbs } from '../components/CustomBreadCrumb';
import { useParams } from 'react-router-dom';
import { useLoanQuery, useLoanEMIsQuery, useLoanInterestsQuery } from '../queries/loan.queries';
import { LoanEMIsTable } from '../components/modules/loans/LoanEMIsTable';
import { LoanInterestsTable } from '../components/modules/loans/LoanInterestsTable';
import type { LoanStatus, LoanType } from '../interfaces/loan.interface';

const formatMonth = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
  });
};

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
      <LoanEMIsTable emis={emis} isLoading={isEMIsPending} />

      {/* Interests Section */}
      <LoanInterestsTable interests={interests} isLoading={isInterestsPending} />
    </Stack>
  );
}

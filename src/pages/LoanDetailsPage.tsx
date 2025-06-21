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
  Tabs,
} from '@mantine/core';
import { IconCoin, IconUser, IconFileText, IconReceipt } from '@tabler/icons-react';
import { useEffect, useMemo, useState } from 'react';
import { CustomBreadCrumbs } from '../components/CustomBreadCrumb';
import { useParams } from 'react-router-dom';
import { useLoanQuery, useLoanEMIsQuery, useLoanInterestsQuery } from '../queries/loan.queries';
import { LoanEMIsTable } from '../components/modules/loans/LoanEMIsTable';
import { LoanInterestsTable } from '../components/modules/loans/LoanInterestsTable';
import type { LoanStatus, LoanType } from '../interfaces/loan.interface';
import dayjs from 'dayjs';

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
  const emis = emisData?.payments || [];

  const interestPaymentMonth = useMemo(() => {
    if (!loan?.loanDisbursementMonth) return '';
    const lastInterestPaymentDate = interestsData?.interests[0]?.paymentDate;
    if (lastInterestPaymentDate) {
      console.log('lastInterestPaymentDate', lastInterestPaymentDate);
      console.log(dayjs(lastInterestPaymentDate).add(1, 'month').format('YYYY-MM-DD'));
      return dayjs(lastInterestPaymentDate).add(1, 'month').format('YYYY-MM-DD');
    }
    return dayjs(loan?.loanDisbursementMonth).add(2, 'month').format('YYYY-MM-DD');
  }, [loan?.loanDisbursementMonth, interestsData?.interests]);

  const currentMonthInterest =
    ((loanData?.outstandingBalance || 0) * (loan?.monthlyInterestRate || 0)) / 100;

  const totalInterestDue =
    (interestsData?.paymentSummary?.totalInterest || 0) -
    (interestsData?.paymentSummary?.totalPaidAmount || 0);

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
              <Badge variant="light" color={getLoanTypeColor(loan.loanType)}>
                {loan.loanType}
              </Badge>
            </Group>
            <Badge variant="light" color={getStatusColor(loan.status)} size="lg">
              {loan.status}
            </Badge>
          </Group>

          <SimpleGrid cols={{ base: 1, sm: 2, md: 3 }} spacing="md">
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
              <Stack>
                <Stack gap="xs">
                  <Group gap="xs">
                    <IconCoin size={16} />
                    <Text size="sm" c="dimmed">
                      Principal Amount
                    </Text>
                  </Group>
                  <Text fw={600} c="blue">
                    <NumberFormatter
                      value={loan.principalAmount}
                      prefix="৳ "
                      thousandSeparator=","
                    />
                  </Text>
                </Stack>
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
          </SimpleGrid>

          <SimpleGrid cols={{ base: 1, sm: 4 }} spacing="md">
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

            <Card withBorder radius="md" p="md">
              <Stack gap="xs">
                <Text size="sm" c="dimmed">
                  Outstanding Balance
                </Text>
                <Text fw={500} c="red">
                  <NumberFormatter
                    value={loanData?.outstandingBalance}
                    prefix="৳ "
                    thousandSeparator=","
                    thousandsGroupStyle="lakh"
                  />
                </Text>
              </Stack>
            </Card>

            <Card withBorder radius="md" p="md">
              <Stack gap="xs">
                <Text size="sm" c="dimmed">
                  Total Interest Paid
                </Text>
                <Text fw={500} c="green">
                  <NumberFormatter
                    value={interestsData?.paymentSummary?.totalPaidAmount}
                    prefix="৳ "
                    thousandSeparator=","
                    thousandsGroupStyle="lakh"
                  />
                </Text>
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

      {/* EMIs and Interests Tabs */}
      <Tabs defaultValue="emis" radius="md">
        <Tabs.List>
          <Tabs.Tab value="emis" leftSection={<IconCoin size={16} />}>
            EMIs ({emis.length})
          </Tabs.Tab>
          <Tabs.Tab value="interests" leftSection={<IconReceipt size={16} />}>
            Interests ({interestsData?.interests.length})
          </Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="emis" pt="md">
          <LoanEMIsTable emis={emis} isLoading={isEMIsPending} />
        </Tabs.Panel>

        <Tabs.Panel value="interests" pt="md">
          <LoanInterestsTable
            interests={interestsData?.interests || []}
            isLoading={isInterestsPending}
            interestPaymentMonth={interestPaymentMonth}
            currentMonthInterest={currentMonthInterest}
            totalInterestDue={totalInterestDue}
          />
        </Tabs.Panel>
      </Tabs>
    </Stack>
  );
}

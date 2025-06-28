import { Container, Title, Text, Stack, Card, Group, NumberFormatter } from '@mantine/core';
import { IconLayoutDashboard } from '@tabler/icons-react';
import { useStore } from '../store';
import { useLoanStatsQuery } from '../queries/loan.queries';

export function HomePage() {
  const { user } = useStore(state => state);
  const { data: loanStats } = useLoanStatsQuery();
  const loans = loanStats?.loans || [];

  const totalOutstandingBalance = loans.reduce(
    (acc, loan) => acc + (loan.outstandingBalance || 0),
    0
  );
  const totalInterestDue = loans.reduce(
    (acc, loan) =>
      acc +
      (loan.interestPaymentSummary?.totalInterest || 0) -
      (loan.interestPaymentSummary?.totalPaidAmount || 0),
    0
  );

  return (
    <Container size="xl" py="xl">
      <Stack gap="xl">
        <Stack gap="md" align="flex-start">
          <Group gap="sm">
            <IconLayoutDashboard size={32} stroke={1.5} />
            <Title order={1} size="h2" fw={600} c="dimmed">
              Hello, {user?.fullName}!
            </Title>
          </Group>
        </Stack>

        {/* Status Section */}
        {/* <Group gap="md">
          <Badge variant="light" color="green" size="lg">
            System Online
          </Badge>
          <Badge variant="light" color="blue" size="lg">
            All Services Running
          </Badge>
        </Group> */}

        {/* Quick Stats */}
        <Group gap="md" w="100%" maw={600} wrap="wrap">
          <Card shadow="xs" padding="md" radius="md">
            <Stack gap="xs" align="center">
              <Text size="xl" fw={700} c="orange">
                {loans.length}
              </Text>
              <Text size="sm" c="dimmed" ta="center">
                Total Active Loans
              </Text>
            </Stack>
          </Card>

          <Card shadow="xs" padding="md" radius="md">
            <Stack gap="xs" align="center">
              <Text size="xl" fw={700} c="blue">
                <NumberFormatter
                  value={totalOutstandingBalance}
                  prefix="৳ "
                  thousandSeparator=","
                />
              </Text>
              <Text size="sm" c="dimmed" ta="center">
                Total Outstanding
              </Text>
            </Stack>
          </Card>

          <Card shadow="xs" padding="md" radius="md">
            <Stack gap="xs" align="center">
              <Text size="xl" fw={700} c="red">
                <NumberFormatter value={totalInterestDue} prefix="৳ " thousandSeparator="," />
              </Text>
              <Text size="sm" c="dimmed" ta="center">
                Total Interest Due
              </Text>
            </Stack>
          </Card>
        </Group>
      </Stack>
    </Container>
  );
}

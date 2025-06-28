import {
  Table,
  Text,
  Group,
  Card,
  Stack,
  NumberFormatter,
  ScrollArea,
  Center,
  Badge,
  Title,
  Anchor,
} from '@mantine/core';
import { IconCoin } from '@tabler/icons-react';
import { Link } from 'react-router-dom';
import type { ILoan } from '../../../interfaces/loan.interface';

const LoanRow = ({ loan }: { loan: ILoan }) => {
  const totalInterestPaid = loan.interestPaymentSummary?.totalPaidAmount || 0;
  const totalInterestDue = (loan.interestPaymentSummary?.totalInterest || 0) - totalInterestPaid;

  return (
    <Table.Tr>
      <Table.Td>
        <Anchor component={Link} to={`/loans/${loan._id}`} fw={500} c="blue">
          {loan.loanNumber}
        </Anchor>
      </Table.Td>

      <Table.Td>
        <Text size="sm" fw={600} c="blue">
          <NumberFormatter
            value={loan.principalAmount}
            prefix="৳ "
            thousandSeparator=","
            thousandsGroupStyle="lakh"
          />
        </Text>
      </Table.Td>

      <Table.Td>
        <Text size="sm" fw={600} c="orange">
          <NumberFormatter
            value={loan.outstandingBalance || 0}
            prefix="৳ "
            thousandSeparator=","
            thousandsGroupStyle="lakh"
          />
        </Text>
      </Table.Td>

      <Table.Td>
        <Text size="sm" fw={500} c="green">
          <NumberFormatter
            value={totalInterestPaid}
            prefix="৳ "
            thousandSeparator=","
            thousandsGroupStyle="lakh"
          />
        </Text>
      </Table.Td>

      <Table.Td>
        <Text size="sm" fw={500} c={totalInterestDue > 0 ? 'red' : 'gray'}>
          <NumberFormatter
            value={totalInterestDue}
            prefix="৳ "
            thousandSeparator=","
            thousandsGroupStyle="lakh"
          />
        </Text>
      </Table.Td>
    </Table.Tr>
  );
};

export function LoansTable({ loans }: { loans: ILoan[] }) {
  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder>
      <Stack gap="md">
        <Group justify="space-between" align="center">
          <Group gap="sm">
            <IconCoin size={20} />
            <Title order={3} size="h4" fw={600}>
              Your active loans
            </Title>
          </Group>
          <Badge variant="light" color="blue" size="lg">
            {loans.length} Loans
          </Badge>
        </Group>

        <ScrollArea>
          <Table striped highlightOnHover withTableBorder withColumnBorders>
            <Table.Thead>
              <Table.Tr>
                <Table.Th>Loan Number</Table.Th>
                <Table.Th>Principal Amount</Table.Th>
                <Table.Th>Outstanding Balance</Table.Th>
                <Table.Th>Total Interest Paid</Table.Th>
                <Table.Th>Total Interest Due</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {loans.length === 0 ? (
                <Table.Tr>
                  <Table.Td colSpan={5}>
                    <Center py="xl">
                      <Stack align="center" gap="md">
                        <IconCoin size={48} stroke={1.5} color="var(--mantine-color-gray-5)" />
                        <Text size="lg" fw={500} c="dimmed">
                          No loans found
                        </Text>
                        <Text size="sm" c="dimmed" ta="center">
                          There are no active loans to display.
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
      </Stack>
    </Card>
  );
}

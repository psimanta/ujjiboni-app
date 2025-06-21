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
import { IconFileText, IconEdit } from '@tabler/icons-react';
import type { ILoanInterest } from '../../../interfaces/loan.interface';
import { InterestForm } from './InterestForm';

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

const InterestRow = ({ interest }: { interest: ILoanInterest }) => {
  return (
    <Table.Tr>
      <Table.Td>{interest.paymentDate ? formatDate(interest.paymentDate) : '-'}</Table.Td>
      <Table.Td>
        <NumberFormatter value={interest.previousInterestDue} prefix="৳ " thousandSeparator="," />
      </Table.Td>
      <Table.Td>
        <NumberFormatter value={interest.interestAmount} prefix="৳ " thousandSeparator="," />
      </Table.Td>
      <Table.Td>
        <NumberFormatter
          value={interest.previousInterestDue + interest.interestAmount}
          prefix="৳ "
          thousandSeparator=","
        />
      </Table.Td>
      <Table.Td>
        <NumberFormatter value={interest.paidAmount} prefix="৳ " thousandSeparator="," />
      </Table.Td>
      <Table.Td>
        <NumberFormatter
          value={interest.dueAfterInterestPayment}
          prefix="৳ "
          thousandSeparator=","
        />
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
          <Tooltip label="Edit Interest">
            <ActionIcon variant="subtle" color="gray" size="sm" disabled>
              <IconEdit size={16} />
            </ActionIcon>
          </Tooltip>
        </Group>
      </Table.Td>
    </Table.Tr>
  );
};

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
  interestPaymentMonth: string;
  currentMonthInterest: number;
  totalInterestDue: number;
}

export function LoanInterestsTable({
  interests,
  isLoading,
  interestPaymentMonth,
  currentMonthInterest,
  totalInterestDue,
}: LoanInterestsTableProps) {
  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder>
      <InterestForm
        interestPaymentMonth={interestPaymentMonth}
        currentMonthInterest={currentMonthInterest}
        totalInterestDue={totalInterestDue}
      />
      <ScrollArea>
        <Table striped highlightOnHover withTableBorder withColumnBorders>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Month</Table.Th>
              <Table.Th>Previous Due</Table.Th>
              <Table.Th>Interest Amount</Table.Th>
              <Table.Th>Total Due</Table.Th>
              <Table.Th>Paid Amount</Table.Th>
              <Table.Th>Due After Payment</Table.Th>
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
    </Card>
  );
}

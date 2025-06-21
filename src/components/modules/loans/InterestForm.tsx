import { NumberInput, Button, Text, Stack, Alert, SimpleGrid, Paper } from '@mantine/core';
import { useForm } from '@mantine/form';
import { IconReceipt, IconX as _IconX } from '@tabler/icons-react';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useCreateLoanInterestMutation } from '../../../queries/loan.queries';
import type { ICreateLoanInterestPayload } from '../../../interfaces/loan.interface';

interface InterestFormData {
  amount: number;
  month: string;
  dueAmount?: number;
}

const InfoCard = ({
  label,
  value,
  color = 'blue',
  prefix = '৳ ',
}: {
  label: string;
  value: number | string;
  color?: string;
  prefix?: string;
}) => (
  <Paper withBorder p="sm" radius="md" style={{ borderColor: `var(--mantine-color-${color}-3)` }}>
    <Stack gap={4}>
      <Text size="xs" fw={500} c="dimmed" tt="uppercase">
        {label}
      </Text>
      <Text size="sm" fw={600} c={color}>
        {typeof value === 'number' ? `${prefix}${value.toLocaleString()}` : value}
      </Text>
    </Stack>
  </Paper>
);

export function InterestForm({
  interestPaymentMonth,
  currentMonthInterest,
  totalInterestDue,
}: {
  interestPaymentMonth: string;
  currentMonthInterest: number;
  totalInterestDue: number;
}) {
  console.log(totalInterestDue);
  const { id: loanId } = useParams();
  const [error, setError] = useState<string | null>(null);
  const [dueAmount, setDueAmount] = useState<number | undefined>(undefined);
  const { mutate, isPending } = useCreateLoanInterestMutation();

  const totalInterestDueWithCurrentMonthInterest = totalInterestDue + currentMonthInterest;

  const form = useForm<InterestFormData>({
    initialValues: {
      month: interestPaymentMonth,
      amount: 0,
    },
    validate: {
      amount: value => {
        if (typeof value !== 'number' || value < 0)
          return 'Amount must be greater than or equal to 0';
        if (value > totalInterestDueWithCurrentMonthInterest)
          return `Amount cannot exceed ৳${totalInterestDueWithCurrentMonthInterest}`;
        return null;
      },
      month: value => (!value ? 'Month is required' : null),
    },
  });

  const handleSubmit = (values: InterestFormData) => {
    console.log(values);
    if (!loanId) {
      setError('Loan ID is missing');
      return;
    }

    if (!values.month) {
      setError('Please select a month');
      return;
    }

    const payload: ICreateLoanInterestPayload = {
      interestAmount: currentMonthInterest,
      paidAmount: values.amount,
      paymentDate: values.month,
      dueAfterInterestPayment: dueAmount || 0,
      previousInterestDue: totalInterestDue,
    };

    mutate(
      { loanId, payload },
      {
        onSuccess: () => {
          setError(null);
        },
        onError: error => {
          setError(error.message);
        },
      }
    );
  };

  useEffect(() => {
    setDueAmount(totalInterestDueWithCurrentMonthInterest - form.values.amount);
  }, [form.values.amount, totalInterestDueWithCurrentMonthInterest]);

  useEffect(() => {
    form.setFieldValue('month', interestPaymentMonth);
  }, [interestPaymentMonth]);

  const formatMonth = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
    });
  };

  return (
    <Paper radius="md" p="md" mb="md">
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Stack gap="md">
          {/* Summary Cards */}
          <SimpleGrid cols={{ base: 2, sm: 4 }} spacing="sm">
            <InfoCard
              label="Payment Month"
              value={formatMonth(interestPaymentMonth)}
              color="blue"
              prefix=""
            />
            <InfoCard label="Previous Due" value={totalInterestDue} color="orange" />
            <InfoCard label="Current Interest" value={currentMonthInterest} color="green" />
            <InfoCard
              label="Total Due"
              value={totalInterestDueWithCurrentMonthInterest}
              color="red"
            />
          </SimpleGrid>

          {/* Input Fields */}
          <SimpleGrid cols={{ base: 1, sm: 3 }} spacing="md">
            <NumberInput
              label="Paid Amount"
              placeholder="Enter paid amount"
              leftSection={<Text size="sm">৳</Text>}
              radius="md"
              min={0}
              max={totalInterestDueWithCurrentMonthInterest}
              thousandSeparator=","
              thousandsGroupStyle="lakh"
              size="sm"
              {...form.getInputProps('amount')}
            />

            <NumberInput
              label="Due After Payment"
              value={dueAmount || 0}
              readOnly
              radius="md"
              min={0}
              thousandSeparator=","
              thousandsGroupStyle="lakh"
              size="sm"
            />

            <Button
              type="submit"
              leftSection={<IconReceipt size={16} />}
              radius="md"
              size="sm"
              loading={isPending}
              style={{ alignSelf: 'end' }}
            >
              Add Payment
            </Button>
          </SimpleGrid>

          {error && <Alert color="red" title={error} radius="md" />}
        </Stack>
      </form>
    </Paper>
  );
}

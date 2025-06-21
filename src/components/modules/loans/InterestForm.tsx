import { NumberInput, Button, Text, Stack, Alert, SimpleGrid, Paper } from '@mantine/core';
import { MonthPickerInput } from '@mantine/dates';
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

  return (
    <Paper radius="md" p="md" mb="md">
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Stack gap="md">
          <SimpleGrid
            cols={{ base: 1, sm: 2, md: 2 }}
            style={{
              alignItems: 'flex-end',
            }}
          >
            <MonthPickerInput
              label="Month"
              placeholder="Select month"
              radius="md"
              size="sm"
              readOnly
              styles={{
                input: {
                  cursor: 'not-allowed',
                },
              }}
              {...form.getInputProps('month')}
            />

            <NumberInput
              label="Previous Due"
              value={totalInterestDue}
              readOnly
              radius="md"
              min={0}
              thousandSeparator=","
              thousandsGroupStyle="lakh"
              size="sm"
            />

            <NumberInput
              label="Current Month Interest"
              value={currentMonthInterest}
              readOnly
              radius="md"
              min={0}
              thousandSeparator=","
              thousandsGroupStyle="lakh"
              size="sm"
            />

            <NumberInput
              label="Total Interest Due"
              value={totalInterestDueWithCurrentMonthInterest}
              readOnly
              radius="md"
              min={0}
              thousandSeparator=","
              thousandsGroupStyle="lakh"
              size="sm"
            />

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
              readOnly
              label="Due Amount"
              placeholder="Enter due amount"
              leftSection={<Text size="sm">৳</Text>}
              radius="md"
              min={0}
              thousandSeparator=","
              thousandsGroupStyle="lakh"
              size="sm"
              styles={{
                input: {
                  cursor: 'not-allowed',
                },
              }}
              value={dueAmount}
            />

            <SimpleGrid cols={2}>
              <Button
                type="submit"
                leftSection={<IconReceipt size={16} />}
                radius="md"
                size="sm"
                loading={isPending}
              >
                Add
              </Button>
              {/* <Button
                disabled={isPending}
                type="button"
                variant="light"
                leftSection={<IconX size={16} />}
                color="gray"
                onClick={() => form.reset()}
                radius="md"
                size="sm"
              >
                Clear
              </Button> */}
            </SimpleGrid>
          </SimpleGrid>
          {error && <Alert color="red" title={error} radius="md" />}
        </Stack>
      </form>
    </Paper>
  );
}

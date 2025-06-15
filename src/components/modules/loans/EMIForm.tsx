import { Group, NumberInput, Button, Text, Stack, Alert, SimpleGrid } from '@mantine/core';
import { DateInput } from '@mantine/dates';
import { useForm } from '@mantine/form';
import { IconReceipt, IconX } from '@tabler/icons-react';
import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useCreateLoanEMIMutation } from '../../../queries/loan.queries';

interface EMIFormData {
  amount: number;
  paymentDate: Date | null;
}

export function EMIForm() {
  const { id: loanId } = useParams();
  const [error, setError] = useState<string | null>(null);
  const { mutate, isPending } = useCreateLoanEMIMutation();

  const form = useForm<EMIFormData>({
    initialValues: {
      amount: 0,
      paymentDate: new Date(),
    },
    validate: {
      amount: value => {
        if (!value || value <= 0) return 'Amount must be greater than 0';
        if (value > 10000000) return 'Amount cannot exceed ৳10,000,000';
        return null;
      },
      paymentDate: value => (!value ? 'Payment date is required' : null),
    },
  });

  const handleSubmit = (values: EMIFormData) => {
    if (!loanId) {
      setError('Loan ID is missing');
      return;
    }

    if (!values.paymentDate) {
      setError('Please select a payment date');
      return;
    }

    const payload = {
      amount: values.amount,
      paymentDate: values.paymentDate,
      notes: '',
    };

    mutate(
      { loanId, payload },
      {
        onSuccess: () => {
          form.reset();
          setError(null);
        },
        onError: error => {
          setError(error.message);
        },
      }
    );
  };

  return (
    <form onSubmit={form.onSubmit(handleSubmit)}>
      <Stack gap="md">
        <Group grow align="flex-end">
          <NumberInput
            label="EMI Amount"
            placeholder="Enter payment amount"
            leftSection={<Text size="sm">৳</Text>}
            radius="md"
            min={0}
            max={10000000}
            thousandSeparator=","
            thousandsGroupStyle="lakh"
            size="sm"
            {...form.getInputProps('amount')}
          />

          <DateInput
            label="Payment Date"
            placeholder="Select payment date"
            radius="md"
            size="sm"
            {...form.getInputProps('paymentDate')}
          />

          <SimpleGrid cols={2}>
            <Button
              type="submit"
              loading={isPending}
              leftSection={<IconReceipt size={16} />}
              radius="md"
              size="sm"
            >
              Add EMI
            </Button>
            <Button
              type="button"
              variant="light"
              color="gray"
              onClick={() => form.reset()}
              leftSection={<IconX size={16} />}
              radius="md"
              size="sm"
            >
              Clear
            </Button>
          </SimpleGrid>
        </Group>
        {error && <Alert color="red" title={error} radius="md" />}
      </Stack>
    </form>
  );
}

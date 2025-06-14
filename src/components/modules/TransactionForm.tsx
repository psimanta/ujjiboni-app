import {
  Select,
  Textarea,
  Button,
  Group,
  Stack,
  NumberInput,
  Alert,
  Collapse,
  Text,
  SimpleGrid,
} from '@mantine/core';
import { DateInput } from '@mantine/dates';
import { useForm } from '@mantine/form';
import {
  IconPlus,
  IconCurrencyTaka,
  IconCalendar,
  IconMessageCircle,
  IconChevronDown,
  IconChevronUp,
} from '@tabler/icons-react';
import { useParams } from 'react-router-dom';
import { useState } from 'react';
import { useEnterTransactionMutation } from '../../queries/account.queries';
import { TRANSACTION_TYPE } from '../../constants/account';

interface TransactionFormData {
  amount: number | '';
  type: 'debit' | 'credit' | '';
  comment: string;
  transactionDate: Date | null;
}

export const TransactionForm = () => {
  const { id } = useParams();
  const { mutate, isPending } = useEnterTransactionMutation();
  const [error, setError] = useState<string | null>(null);
  const [opened, setOpened] = useState(false);

  const form = useForm<TransactionFormData>({
    initialValues: {
      amount: '',
      type: '',
      comment: '',
      transactionDate: new Date(),
    },
    validate: {
      amount: value => {
        if (!value || value <= 0) return 'Amount must be greater than 0';
        return null;
      },
      type: value => (!value ? 'Transaction type is required' : null),
      comment: value => {
        if (!value.trim()) return 'Comment is required';
        if (value.trim().length < 3) return 'Comment must be at least 3 characters';
        return null;
      },
      transactionDate: value => (!value ? 'Transaction date is required' : null),
    },
  });

  const handleSubmit = (values: TransactionFormData) => {
    if (!id) return;

    const payload = {
      accountId: id,
      amount: Number(values.amount),
      type: values.type as 'debit' | 'credit',
      comment: values.comment.trim(),
      transactionDate: values.transactionDate,
    };

    mutate(payload, {
      onSuccess: () => {
        form.reset();
        setError(null);
        // Set transaction date to current date for next entry
        form.setFieldValue('type', 'debit');
        form.setFieldValue('transactionDate', new Date());
      },
      onError: error => {
        setError(error.message || 'Failed to create transaction');
      },
    });
  };

  const transactionTypeOptions = [
    { value: 'credit', label: TRANSACTION_TYPE.credit },
    { value: 'debit', label: TRANSACTION_TYPE.debit },
  ];

  return (
    <Stack gap="md">
      {/* Toggle Button */}
      <Group justify="space-between" align="center">
        <Text size="lg" fw={600}>
          Add New Transaction
        </Text>
        <Button
          variant="subtle"
          onClick={() => setOpened(!opened)}
          rightSection={opened ? <IconChevronUp size={16} /> : <IconChevronDown size={16} />}
          radius="md"
          size="sm"
        >
          {opened ? 'Hide Form' : 'Show Form'}
        </Button>
      </Group>

      {/* Collapsible Form */}
      <Collapse in={opened} pb={opened ? 'md' : 0}>
        <form onSubmit={form.onSubmit(handleSubmit)}>
          <Stack gap="md">
            {error && (
              <Alert color="red" radius="md" onClose={() => setError(null)} withCloseButton>
                {error}
              </Alert>
            )}

            <SimpleGrid cols={{ base: 1, sm: 2, md: 3 }} spacing="md">
              <NumberInput
                label="Amount"
                placeholder="Enter amount"
                leftSection={<IconCurrencyTaka size={16} />}
                min={0.01}
                step={0.01}
                decimalScale={2}
                fixedDecimalScale
                thousandSeparator=","
                radius="md"
                {...form.getInputProps('amount')}
              />

              <Select
                label="Transaction Type"
                placeholder="Select type"
                data={transactionTypeOptions}
                radius="md"
                {...form.getInputProps('type')}
              />

              <DateInput
                label="Transaction Date"
                placeholder="Select date"
                leftSection={<IconCalendar size={16} />}
                radius="md"
                {...form.getInputProps('transactionDate')}
              />
            </SimpleGrid>

            <Textarea
              label="Comment"
              placeholder="Enter transaction description"
              leftSection={<IconMessageCircle size={16} />}
              rows={1}
              radius="md"
              {...form.getInputProps('comment')}
            />

            <Group justify="flex-end" gap="sm">
              <Button
                type="button"
                variant="subtle"
                onClick={() => {
                  form.reset();
                  form.setFieldValue('transactionDate', new Date());
                  setError(null);
                }}
                disabled={isPending}
                radius="md"
                size="sm"
              >
                Clear
              </Button>
              <Button
                type="submit"
                loading={isPending}
                leftSection={<IconPlus size={16} />}
                radius="md"
                size="sm"
              >
                Add Transaction
              </Button>
            </Group>
          </Stack>
        </form>
      </Collapse>
    </Stack>
  );
};

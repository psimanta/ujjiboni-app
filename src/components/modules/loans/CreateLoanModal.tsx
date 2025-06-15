import {
  Modal,
  Button,
  Stack,
  Group,
  Text,
  Select,
  Alert,
  NumberInput,
  Textarea,
} from '@mantine/core';
import { MonthPickerInput } from '@mantine/dates';
import { useForm } from '@mantine/form';
import { IconCoin, IconUser, IconCalendar, IconPercentage, IconNotes } from '@tabler/icons-react';
import { useState } from 'react';
import { useCreateLoanMutation } from '../../../queries/loan.queries';
import { useStore } from '../../../store';
import { LoanType } from '../../../interfaces/loan.interface';

interface CreateLoanModalProps {
  opened: boolean;
  onClose: () => void;
}

interface CreateLoanFormData {
  memberId: string;
  loanType: LoanType;
  principalAmount: number;
  monthlyInterestRate: number;
  notes: string;
  loanDisbursementMonth: string | null;
  interestStartMonth: string | null;
}

const LOAN_TYPE_OPTIONS = [
  { value: 'PERSONAL', label: 'Personal Loan' },
  { value: 'BUSINESS', label: 'Business Loan' },
  { value: 'EMERGENCY', label: 'Emergency Loan' },
  { value: 'EDUCATION', label: 'Education Loan' },
];

export function CreateLoanModal({ opened, onClose }: CreateLoanModalProps) {
  const { mutate, isPending } = useCreateLoanMutation();
  const { members } = useStore();
  const [error, setError] = useState<string | null>(null);

  const membersData = members?.map(member => ({
    value: member._id,
    label: member.fullName,
  }));

  const form = useForm<CreateLoanFormData>({
    initialValues: {
      memberId: '',
      loanType: 'PERSONAL' as LoanType,
      principalAmount: 0,
      monthlyInterestRate: 0,
      notes: '',
      loanDisbursementMonth: null,
      interestStartMonth: null,
    },
    validate: {
      memberId: value => (!value ? 'Member selection is required' : null),
      loanType: value => (!value ? 'Loan type is required' : null),
      principalAmount: value => {
        if (!value || value <= 0) return 'Principal amount must be greater than 0';
        if (value > 10000000) return 'Principal amount cannot exceed ৳10,000,000';
        return null;
      },
      monthlyInterestRate: value => {
        if (value < 0) return 'Interest rate cannot be negative';
        if (value > 50) return 'Interest rate cannot exceed 50%';
        return null;
      },
      loanDisbursementMonth: value => (!value ? 'Loan disbursement month is required' : null),
      interestStartMonth: value => (!value ? 'Interest start month is required' : null),
    },
  });

  // Auto-set interest start month when disbursement month changes
  const handleDisbursementMonthChange = (date: string | null) => {
    form.setFieldValue('loanDisbursementMonth', date);

    if (date) {
      // Add 2 months to the disbursement date
      const interestStartDate = new Date(date);
      interestStartDate.setMonth(interestStartDate.getMonth() + 2);
      form.setFieldValue(
        'interestStartMonth',
        `${interestStartDate.getFullYear()}-${String(interestStartDate.getMonth() + 1).padStart(2, '0')}-01`
      );
    } else {
      form.setFieldValue('interestStartMonth', null);
    }
  };

  const handleSubmit = (values: CreateLoanFormData) => {
    if (!values.loanDisbursementMonth || !values.interestStartMonth) {
      setError('Please select both disbursement and interest start months');
      return;
    }

    const payload = {
      memberId: values.memberId,
      loanType: values.loanType,
      principalAmount: values.principalAmount,
      monthlyInterestRate: values.monthlyInterestRate,
      notes: values.notes,
      loanDisbursementMonth: values.loanDisbursementMonth,
      interestStartMonth: values.interestStartMonth,
    };

    mutate(payload, {
      onSuccess: () => {
        handleClose();
      },
      onError: error => {
        setError(error.message);
      },
    });
  };

  const handleClose = () => {
    form.reset();
    setError(null);
    onClose();
  };

  return (
    <Modal
      radius="md"
      padding="lg"
      opened={opened}
      onClose={handleClose}
      title={
        <Group gap="sm">
          <IconCoin size={20} />
          <Text fw={600} size="lg">
            Create New Loan
          </Text>
        </Group>
      }
      size="md"
      centered
    >
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Stack gap="md">
          {error && (
            <Alert color="red" title="Error" radius="md">
              {error}
            </Alert>
          )}

          <Select
            label="Member"
            placeholder="Select loan recipient"
            leftSection={<IconUser size={16} />}
            data={membersData}
            searchable
            radius="md"
            {...form.getInputProps('memberId')}
          />

          <Select
            label="Loan Type"
            placeholder="Select loan type"
            leftSection={<IconCoin size={16} />}
            data={LOAN_TYPE_OPTIONS}
            radius="md"
            {...form.getInputProps('loanType')}
          />

          <NumberInput
            label="Principal Amount"
            placeholder="Enter loan amount"
            leftSection={<Text size="sm">৳</Text>}
            radius="md"
            min={0}
            max={10000000}
            thousandSeparator=","
            {...form.getInputProps('principalAmount')}
          />

          <NumberInput
            label="Monthly Interest Rate"
            placeholder="Enter interest rate"
            leftSection={<IconPercentage size={16} />}
            suffix="%"
            radius="md"
            min={0}
            max={50}
            decimalScale={2}
            step={0.1}
            {...form.getInputProps('monthlyInterestRate')}
          />

          <MonthPickerInput
            label="Loan Disbursement Month"
            placeholder="Select disbursement month"
            leftSection={<IconCalendar size={16} />}
            radius="md"
            {...form.getInputProps('loanDisbursementMonth')}
            onChange={handleDisbursementMonthChange}
          />

          <MonthPickerInput
            label="Interest Start Month (Auto-calculated)"
            placeholder="Automatically set 2 months after disbursement"
            leftSection={<IconCalendar size={16} />}
            radius="md"
            disabled
            {...form.getInputProps('interestStartMonth')}
          />

          <Textarea
            label="Notes (Optional)"
            placeholder="Add any additional notes about the loan"
            leftSection={<IconNotes size={16} />}
            radius="md"
            rows={1}
            {...form.getInputProps('notes')}
          />

          <Group justify="flex-end" mt="md">
            <Button variant="subtle" onClick={handleClose} radius="md" disabled={isPending}>
              Cancel
            </Button>
            <Button
              type="submit"
              loading={isPending}
              leftSection={<IconCoin size={16} />}
              radius="md"
            >
              Create Loan
            </Button>
          </Group>
        </Stack>
      </form>
    </Modal>
  );
}

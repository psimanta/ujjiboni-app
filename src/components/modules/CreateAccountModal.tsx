import { Modal, TextInput, Button, Stack, Group, Text, Select, Alert } from '@mantine/core';
import { useForm } from '@mantine/form';
import { IconBuildingBank, IconUser, IconSignature } from '@tabler/icons-react';
import { useMembersQuery } from '../../queries/user.queries';
import { useCreateAccountMutation } from '../../queries/account.queries';
import { useState } from 'react';

interface CreateAccountModalProps {
  opened: boolean;
  onClose: () => void;
}

interface CreateAccountFormData {
  name: string;
  accountHolder: string;
}

export function CreateAccountModal({ opened, onClose }: CreateAccountModalProps) {
  const { mutate, isPending } = useCreateAccountMutation();
  const { data } = useMembersQuery();
  const [error, setError] = useState<string | null>(null);
  const membersData = data?.users?.map(member => ({
    value: member._id,
    label: member.fullName,
  }));
  const form = useForm<CreateAccountFormData>({
    initialValues: {
      name: '',
      accountHolder: '',
    },
    validate: {
      name: value => {
        if (!value.trim()) return 'Account name is required';
        if (value.trim().length < 3) return 'Account name must be at least 3 characters';
        return null;
      },
      accountHolder: value => (!value ? 'Account holder is required' : null),
    },
  });

  const handleSubmit = (values: CreateAccountFormData) => {
    mutate(values, {
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
          <IconBuildingBank size={20} />
          <Text fw={600} size="lg">
            Create New Account
          </Text>
        </Group>
      }
      size="md"
      centered
    >
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Stack gap="md">
          {error && <Alert color="red" title={error} radius="md" />}
          <TextInput
            label="Account Name"
            placeholder="Enter account name (e.g., Main Savings Account)"
            leftSection={<IconSignature size={16} />}
            radius="md"
            {...form.getInputProps('name')}
          />

          <Select
            label="Account Holder"
            placeholder="Select account holder"
            leftSection={<IconUser size={16} />}
            data={membersData}
            searchable
            radius="md"
            {...form.getInputProps('accountHolder')}
          />

          <Group justify="flex-end" mt="md">
            <Button variant="subtle" onClick={handleClose} radius="md" disabled={isPending}>
              Cancel
            </Button>
            <Button
              type="submit"
              loading={isPending}
              leftSection={<IconBuildingBank size={16} />}
              radius="md"
            >
              Create Account
            </Button>
          </Group>
        </Stack>
      </form>
    </Modal>
  );
}

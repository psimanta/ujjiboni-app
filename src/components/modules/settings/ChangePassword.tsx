import { Card, Stack, Title, Button, Group, Text, Alert, PasswordInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import { IconLock, IconX } from '@tabler/icons-react';
import { useState } from 'react';
import { usePasswordChangeMutation } from '../../../queries/auth.queries';
import type { IResponseError } from '../../../interfaces/response.interface';

interface ChangePasswordForm {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export function ChangePassword() {
  const { mutate: changePassword, isPending } = usePasswordChangeMutation();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);

  const form = useForm<ChangePasswordForm>({
    initialValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
    validate: {
      currentPassword: value => (value.length < 1 ? 'Current password is required' : null),
      newPassword: value => {
        if (value.length < 8) {
          return 'New password must be at least 8 characters long';
        }
        if (!/(?=.*[a-zA-Z])(?=.*\d)/.test(value)) {
          return 'Password must contain at least one letter and one number';
        }
        return null;
      },
      confirmPassword: (value, values) =>
        value !== values.newPassword ? 'Passwords do not match' : null,
    },
  });

  const handleSubmit = (values: ChangePasswordForm) => {
    setError(null);
    setSuccess(false);

    changePassword(
      {
        currentPassword: values.currentPassword,
        newPassword: values.newPassword,
        confirmPassword: values.confirmPassword,
      },
      {
        onSuccess: () => {
          form.reset();
          setError(null);
          setSuccess(true);
        },
        onError: (error: IResponseError) => {
          setError(error.message || 'Failed to change password. Please try again.');
        },
      }
    );
  };

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder maw={500}>
      <Stack gap="lg">
        <Group gap="sm">
          <IconLock size={24} />
          <Title order={3} size="h4" fw={600}>
            Change Password
          </Title>
        </Group>

        {success && (
          <Alert
            color="green"
            onClose={() => setSuccess(false)}
            title="Password changed successfully! Your new password is now active."
          />
        )}

        {error && (
          <Alert
            color="red"
            icon={<IconX size={16} />}
            title={error}
            onClose={() => setError(null)}
          />
        )}

        <form onSubmit={form.onSubmit(handleSubmit)}>
          <Stack gap="md">
            <PasswordInput
              label="Current Password"
              placeholder="Enter your current password"
              required
              {...form.getInputProps('currentPassword')}
              disabled={isPending}
            />

            <PasswordInput
              label="New Password"
              placeholder="Enter your new password"
              description="Password must be at least 8 characters with uppercase, lowercase, and number"
              required
              {...form.getInputProps('newPassword')}
              disabled={isPending}
            />

            <PasswordInput
              label="Confirm New Password"
              placeholder="Confirm your new password"
              required
              {...form.getInputProps('confirmPassword')}
              disabled={isPending}
            />

            <Group justify="flex-end" mt="md">
              <Button
                type="button"
                variant="light"
                onClick={() => {
                  form.reset();
                  setError(null);
                  setSuccess(false);
                }}
                disabled={isPending}
              >
                Reset
              </Button>
              <Button type="submit" loading={isPending} leftSection={<IconLock size={16} />}>
                Change Password
              </Button>
            </Group>
          </Stack>
        </form>

        <Text size="sm" c="dimmed">
          Make sure to use a strong password that you haven't used before. Your password should be
          unique and secure.
        </Text>
      </Stack>
    </Card>
  );
}

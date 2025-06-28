import { Card, Stack, Title, Button, Group, Alert, TextInput, SimpleGrid } from '@mantine/core';
import { useForm } from '@mantine/form';
import { IconUserPlus, IconX, IconMail } from '@tabler/icons-react';
import { useState } from 'react';
import { useInviteMemberMutation } from '../../../queries/user.queries';
import type { IResponseError } from '../../../interfaces/response.interface';

interface InviteMemberForm {
  fullName: string;
  email: string;
}

export function InviteMembers() {
  const { mutate: inviteMember, isPending } = useInviteMemberMutation();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);

  const form = useForm<InviteMemberForm>({
    initialValues: {
      fullName: '',
      email: '',
    },
    validate: {
      fullName: value => {
        if (value.length < 2) {
          return 'Full name must be at least 2 characters long';
        }
        if (value.length > 50) {
          return 'Full name must be less than 50 characters';
        }
        return null;
      },
      email: value => {
        if (!value) {
          return 'Email is required';
        }
        if (!/^\S+@\S+\.\S+$/.test(value)) {
          return 'Please enter a valid email address';
        }
        return null;
      },
    },
  });

  const handleSubmit = (values: InviteMemberForm) => {
    setError(null);
    setSuccess(false);

    inviteMember(
      {
        email: values.email.trim().toLowerCase(),
        fullName: values.fullName.trim(),
      },
      {
        onSuccess: () => {
          form.reset();
          setError(null);
          setSuccess(true);
        },
        onError: (error: IResponseError) => {
          setError(error.message || 'Failed to send invitation. Please try again.');
        },
      }
    );
  };

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder>
      <Stack gap="lg">
        <Group gap="sm">
          <IconUserPlus size={24} />
          <Title order={3} size="h4" fw={600}>
            Invite New Member
          </Title>
        </Group>

        {success && (
          <Alert
            color="green"
            onClose={() => setSuccess(false)}
            title="Invitation sent successfully! The member will receive an email with setup instructions."
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
          <SimpleGrid
            cols={{ base: 1, sm: 2, md: 3 }}
            spacing="sm"
            style={{ alignItems: 'flex-end' }}
          >
            <TextInput
              label="Full Name"
              placeholder="Enter member's full name"
              required
              radius="md"
              {...form.getInputProps('fullName')}
              disabled={isPending}
            />

            <TextInput
              label="Email Address"
              placeholder="Enter member's email address"
              type="email"
              radius="md"
              required
              {...form.getInputProps('email')}
              disabled={isPending}
              leftSection={<IconMail size={16} />}
            />

            <SimpleGrid cols={2} spacing="md">
              <Button
                type="submit"
                loading={isPending}
                leftSection={<IconUserPlus size={16} />}
                size="sm"
                radius="md"
              >
                Send Invitation
              </Button>
              <Button
                type="button"
                variant="light"
                size="sm"
                radius="md"
                onClick={() => {
                  form.reset();
                  setError(null);
                  setSuccess(false);
                }}
                disabled={isPending}
              >
                Clear
              </Button>
            </SimpleGrid>
          </SimpleGrid>
        </form>
      </Stack>
    </Card>
  );
}

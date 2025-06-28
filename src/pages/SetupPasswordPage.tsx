import {
  TextInput,
  PasswordInput,
  Button,
  Paper,
  Container,
  Group,
  Alert,
  Text,
  Transition,
  Title,
  Stack,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { useNavigate } from 'react-router-dom';
import { useSetupPasswordMutation } from '../queries/auth.queries';
import logo from '../assets/ujjiboni_logo.png';
import { motion } from 'framer-motion';
import { useStore } from '../store';
import { storage } from '../utils/local-storage';
import { useState } from 'react';
import { IconAlertCircle, IconCheck } from '@tabler/icons-react';
import type { IResponseError } from '../interfaces/response.interface';

interface SetupPasswordForm {
  email: string;
  password: string;
  confirmPassword: string;
  otpCode: string;
}

interface SetupPasswordResponse {
  token?: string;
  message: string;
}

export function SetupPasswordPage() {
  const { setIsAuthenticated } = useStore();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);
  const navigate = useNavigate();

  const form = useForm<SetupPasswordForm>({
    initialValues: {
      email: '',
      password: '',
      confirmPassword: '',
      otpCode: '',
    },
    validate: {
      email: value => (/^\S+@\S+\.\S+$/.test(value) ? null : 'Please enter a valid email address'),
      password: value => {
        if (value.length < 8) {
          return 'Password must be at least 8 characters long';
        }
        if (!/(?=.*[a-zA-Z])(?=.*\d)/.test(value)) {
          return 'Password must contain at least one letter and one number';
        }
        return null;
      },
      confirmPassword: (value, values) =>
        value !== values.password ? 'Passwords do not match' : null,
      otpCode: value => {
        if (!/^\d{6}$/.test(value)) {
          return 'OTP must be exactly 6 digits';
        }
        return null;
      },
    },
  });

  const setupPasswordMutation = useSetupPasswordMutation();

  const handleSubmit = (values: SetupPasswordForm) => {
    setError(null);
    setSuccess(false);

    setupPasswordMutation.mutate(
      {
        email: values.email.trim().toLowerCase(),
        password: values.password,
        confirmPassword: values.confirmPassword,
        otpCode: values.otpCode,
      },
      {
        onSuccess: (data: SetupPasswordResponse) => {
          setSuccess(true);
          if (data?.token) {
            storage.set('token', data.token);
            setIsAuthenticated(true);
            setTimeout(() => {
              navigate('/');
            }, 2000);
          } else {
            setTimeout(() => {
              navigate('/login');
            }, 2000);
          }
        },
        onError: (error: IResponseError) => {
          setError(error.message || 'Failed to setup password. Please try again.');
          setIsAuthenticated(false);
        },
      }
    );
  };

  return (
    <Container size="xs" className="min-h-full flex flex-col items-center justify-center">
      <Paper p="xl" w="100%" radius="md">
        <Stack gap="md" align="center">
          <motion.img
            src={logo}
            alt="Ujjiboni Logo"
            style={{ width: 100, height: 100 }}
            initial={{ opacity: 0, y: -100 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          />

          <Title order={2} size="h3" fw={600} ta="center">
            Setup Your Password
          </Title>
        </Stack>

        <Transition mounted={success} transition="fade" duration={500}>
          {styles => (
            <div style={styles}>
              <Alert color="green" my="md" radius="md">
                <Group gap={8}>
                  <IconCheck size={16} color="var(--mantine-color-green-5)" />
                  <Text c="var(--mantine-color-green-5)">
                    Password setup successful! Redirecting...
                  </Text>
                </Group>
              </Alert>
            </div>
          )}
        </Transition>

        <Transition mounted={error !== null} transition="fade" duration={500}>
          {styles => (
            <div style={styles}>
              <Alert
                color="red"
                my="md"
                radius="md"
                title={error}
                withCloseButton
                icon={<IconAlertCircle size={16} color="var(--mantine-color-red-5)" />}
                onClose={() => setError(null)}
              />
            </div>
          )}
        </Transition>

        <form onSubmit={form.onSubmit(handleSubmit)}>
          <Stack gap="md">
            <TextInput
              label="Email Address"
              placeholder="your@email.com"
              radius="md"
              required
              {...form.getInputProps('email')}
              disabled={setupPasswordMutation.isPending}
            />

            <TextInput
              label="6-Digit OTP Code"
              placeholder="123456"
              radius="md"
              required
              maxLength={6}
              {...form.getInputProps('otpCode')}
              disabled={setupPasswordMutation.isPending}
              description="Enter the 6-digit code sent to your email"
            />

            <PasswordInput
              label="New Password"
              placeholder="Create a strong password"
              radius="md"
              required
              {...form.getInputProps('password')}
              disabled={setupPasswordMutation.isPending}
              description="Password must be at least 8 characters with letters and numbers"
            />

            <PasswordInput
              label="Confirm Password"
              placeholder="Confirm your password"
              radius="md"
              required
              {...form.getInputProps('confirmPassword')}
              disabled={setupPasswordMutation.isPending}
            />

            <Button
              fullWidth
              mt="lg"
              type="submit"
              loading={setupPasswordMutation.isPending}
              radius="md"
              disabled={success}
            >
              {success ? 'Setup Complete!' : 'Setup Password'}
            </Button>
          </Stack>
        </form>

        <Text size="xs" c="dimmed" ta="center" mt="md">
          Make sure to keep your password secure and don't share it with anyone.
        </Text>
      </Paper>
    </Container>
  );
}

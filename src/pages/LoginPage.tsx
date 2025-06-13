import {
  TextInput,
  PasswordInput,
  Button,
  Paper,
  Container,
  Anchor,
  Group,
  Alert,
  Text,
  Transition,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { Link, useNavigate } from 'react-router-dom';
import { useLoginMutation } from '../queries/auth.queries';
import logo from '../assets/ujjiboni_logo.png';
import { motion } from 'framer-motion';
import { useStore } from '../store';
import { storage } from '../utils/local-storage';
import { useState } from 'react';
import { IconAlertCircle } from '@tabler/icons-react';

interface LoginForm {
  email: string;
  password: string;
}

export function Login() {
  const { setIsAuthenticated } = useStore();
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const form = useForm<LoginForm>({
    initialValues: {
      email: '',
      password: '',
    },
    validate: {
      email: value => (/^\S+@\S+$/.test(value) ? null : 'Invalid email'),
      password: value => (value.length < 6 ? 'Password must be at least 6 characters' : null),
    },
  });

  const loginMutation = useLoginMutation();

  const handleSubmit = (values: LoginForm) => {
    loginMutation.mutate(values, {
      onSuccess: data => {
        storage.set('token', data.token);
        setIsAuthenticated(true);
        navigate('/');
      },
      onError: error => {
        setError(error.message);
        setIsAuthenticated(false);
      },
    });
  };

  return (
    <Container size="xs" className="min-h-full flex flex-col items-center justify-center">
      <Paper p="xl" w="100%" radius="md">
        <div className="flex items-center justify-center">
          <motion.img
            src={logo}
            alt="Ujjiboni Logo"
            style={{ width: 100, height: 100 }}
            initial={{ opacity: 0, y: -100 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          />
        </div>
        <Transition mounted={error !== null} transition="fade" duration={500}>
          {styles => (
            <div style={styles}>
              <Alert color="red" my="md" radius="md" withCloseButton onClose={() => setError(null)}>
                <Group gap={8}>
                  <IconAlertCircle size={16} color="var(--mantine-color-red-5)" />
                  <Text c="var(--mantine-color-red-5)">{error}</Text>
                </Group>
              </Alert>
            </div>
          )}
        </Transition>

        <form onSubmit={form.onSubmit(handleSubmit)}>
          <TextInput
            label="Email"
            placeholder="you@example.com"
            radius="md"
            {...form.getInputProps('email')}
          />

          <PasswordInput
            label="Password"
            placeholder="Your password"
            mt="md"
            radius="md"
            {...form.getInputProps('password')}
          />

          <Group justify="flex-end" mt="md">
            <Anchor component={Link} to="/forgot-password" size="sm">
              Forgot password?
            </Anchor>
          </Group>

          <Button fullWidth mt="xl" type="submit" loading={loginMutation.isPending} radius="md">
            Sign in
          </Button>
        </form>
      </Paper>
    </Container>
  );
}

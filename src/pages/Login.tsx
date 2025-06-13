import { TextInput, PasswordInput, Button, Paper, Container, Anchor, Group } from '@mantine/core';
import { useForm } from '@mantine/form';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useLoginMutation } from '../queries/auth.queries';
import logo from '../assets/ujjiboni_logo.png';
import { motion } from 'framer-motion';

interface LoginForm {
  email: string;
  password: string;
}

export function Login() {
  const { login } = useAuth();
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
        login(data.token);
        navigate('/');
      },
      onError: error => {
        console.error('Login error:', error);
        // TODO: Add proper error handling
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
        <form onSubmit={form.onSubmit(handleSubmit)}>
          <TextInput label="Email" placeholder="you@example.com" {...form.getInputProps('email')} />

          <PasswordInput
            label="Password"
            placeholder="Your password"
            mt="md"
            {...form.getInputProps('password')}
          />

          <Group justify="flex-end" mt="md">
            <Anchor component={Link} to="/forgot-password" size="sm">
              Forgot password?
            </Anchor>
          </Group>

          <Button fullWidth mt="xl" type="submit" loading={loginMutation.isPending}>
            Sign in
          </Button>
        </form>
      </Paper>
    </Container>
  );
}

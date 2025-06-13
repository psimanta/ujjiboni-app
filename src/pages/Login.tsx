import { TextInput, PasswordInput, Button, Paper, Container } from '@mantine/core';
import { useForm } from '@mantine/form';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useLoginMutation } from '../queries/auth.queries';

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
    <Container size={420} my={40} style={{ display: 'flex' }}>
      <Paper withBorder shadow="md" p={30} mt={30} radius="md">
        <form onSubmit={form.onSubmit(handleSubmit)}>
          <TextInput label="Email" placeholder="you@example.com" {...form.getInputProps('email')} />

          <PasswordInput
            label="Password"
            placeholder="Your password"
            mt="md"
            {...form.getInputProps('password')}
          />

          <Button fullWidth mt="xl" type="submit" loading={loginMutation.isPending}>
            Sign in
          </Button>
        </form>
      </Paper>
    </Container>
  );
}

import { Button, Group, Stack, Title } from '@mantine/core';
import { IconPlus } from '@tabler/icons-react';
import { useState } from 'react';
import { LoansTable } from '../components/modules/loans/LoansTable';
import { CreateLoanModal } from '../components/modules/loans/CreateLoanModal';

export function LoansPage() {
  const [createModalOpened, setCreateModalOpened] = useState(false);

  return (
    <Stack gap="lg">
      <Group justify="space-between" align="center">
        <Title order={2} size="h3" fw={600}>
          Loans
        </Title>
        <Button
          radius="md"
          leftSection={<IconPlus size={16} />}
          onClick={() => setCreateModalOpened(true)}
        >
          Create Loan
        </Button>
      </Group>
      <LoansTable />

      <CreateLoanModal opened={createModalOpened} onClose={() => setCreateModalOpened(false)} />
    </Stack>
  );
}

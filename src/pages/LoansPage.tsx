import { Button, Group, Stack, Title } from '@mantine/core';
import { IconPlus } from '@tabler/icons-react';
import { LoansTable } from '../components/modules/loans/LoansTable';

export function LoansPage() {
  return (
    <Stack gap="lg">
      <Group justify="space-between" align="center">
        <Title order={2} size="h3" fw={600}>
          Loans
        </Title>
        <Button radius="md" leftSection={<IconPlus size={16} />}>
          Create Loan
        </Button>
      </Group>
      <LoansTable />
    </Stack>
  );
}

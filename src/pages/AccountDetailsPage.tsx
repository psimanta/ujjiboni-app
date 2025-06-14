import { CustomBreadCrumbs } from '../components/CustomBreadCrumb';
import { useState } from 'react';
import { TransactionsTable } from '../components/modules/TransactionsTable';
import { Stack } from '@mantine/core';

export function AccountDetailsPage() {
  const [breadCrumbItems, setBreadCrumbItems] = useState<{ label: string; href: string }[]>([]);

  return (
    <Stack gap="xl" mt="md" pb="xl">
      <CustomBreadCrumbs items={breadCrumbItems} />
      <TransactionsTable setBreadCrumbItems={setBreadCrumbItems} />
    </Stack>
  );
}

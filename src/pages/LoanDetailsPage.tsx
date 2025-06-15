import { Stack } from '@mantine/core';
import { useEffect, useState } from 'react';
import { CustomBreadCrumbs } from '../components/CustomBreadCrumb';
import { useParams } from 'react-router-dom';
import { useLoanQuery } from '../queries/loan.queries';

export function LoanDetailsPage() {
  const [breadCrumbItems, setBreadCrumbItems] = useState<{ label: string; href: string }[]>([]);
  const { id } = useParams();
  const { data } = useLoanQuery(id || '');

  useEffect(() => {
    if (data) {
      setBreadCrumbItems([
        { label: 'Loans', href: '/loans' },
        { label: data.loan.loanNumber, href: `/loans/${id}` },
      ]);
    }
  }, [data, id]);

  return (
    <Stack gap="xl" mt="md" pb="xl">
      <CustomBreadCrumbs items={breadCrumbItems} />
    </Stack>
  );
}

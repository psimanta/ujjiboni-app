import { CustomBreadCrumbs } from '../components/CustomBreadCrumb';
import { useParams } from 'react-router-dom';
import { useAccountTransactionsQuery } from '../queries/account.queries';
import { useMemo, useState } from 'react';

export function AccountDetailsPage() {
  const { id } = useParams();
  const [page, _setPage] = useState(1);
  const { data } = useAccountTransactionsQuery(id || '', page);

  const breadCrumbItems = useMemo(() => {
    if (!data) return [];
    return [
      { label: 'Accounts', href: '/accounts' },
      { label: data?.account?.name, href: `/accounts/${id}` },
    ];
  }, [id, data]);

  return (
    <div>
      <CustomBreadCrumbs items={breadCrumbItems} />
    </div>
  );
}

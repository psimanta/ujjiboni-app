import { Group, Skeleton, Stack, Table } from '@mantine/core';

export const TransactionTableLoading = () => (
  <>
    {Array.from({ length: 10 }).map((_, index) => (
      <Table.Tr key={index}>
        <Table.Td>
          <Group gap="sm">
            <Skeleton height={32} circle />
            <Stack gap={2}>
              <Skeleton height={16} width={60} />
              <Skeleton height={12} width={100} />
            </Stack>
          </Group>
        </Table.Td>
        <Table.Td>
          <Skeleton height={16} width="80%" />
        </Table.Td>
        <Table.Td>
          <Skeleton height={16} width={80} />
        </Table.Td>
        <Table.Td>
          <Stack gap={2}>
            <Skeleton height={16} width={120} />
            <Skeleton height={12} width={150} />
          </Stack>
        </Table.Td>
        <Table.Td>
          <Skeleton height={24} width={24} />
        </Table.Td>
      </Table.Tr>
    ))}
  </>
);

import {
  Table,
  Text,
  Badge,
  Group,
  Stack,
  Card,
  Title,
  Select,
  Pagination,
  Avatar,
  Skeleton,
  Center,
  TextInput,
} from '@mantine/core';
import { IconSearch, IconUsers } from '@tabler/icons-react';
import { useState, useMemo } from 'react';
import { useMembersQuery } from '../../../queries/user.queries';

export function MembersTable() {
  const { data, isPending } = useMembersQuery();
  const members = data?.users || [];

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Filter and search members
  const filteredMembers = useMemo(() => {
    let filtered = members;

    // Filter by role
    if (roleFilter !== 'all') {
      filtered = filtered.filter(member => member.role === roleFilter);
    }

    // Search by name or email
    if (searchQuery) {
      filtered = filtered.filter(
        member =>
          member.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          member.email.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    return filtered;
  }, [members, roleFilter, searchQuery]);

  // Pagination
  const totalPages = Math.ceil(filteredMembers.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const paginatedMembers = filteredMembers.slice(startIndex, startIndex + pageSize);

  // Reset page when filters change
  const handleFilterChange = (value: string | null) => {
    setRoleFilter(value || 'all');
    setCurrentPage(1);
  };

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    setCurrentPage(1);
  };

  const handlePageSizeChange = (value: string | null) => {
    setPageSize(Number(value) || 10);
    setCurrentPage(1);
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const getRoleBadgeColor = (role: string) => {
    return role === 'ADMIN' ? 'red' : 'blue';
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
      });
    } catch {
      return 'N/A';
    }
  };

  return (
    <Stack gap="lg">
      <Title order={2} size="h3" fw={600}>
        Members
      </Title>

      {/* Filters and Search */}
      <Group justify="space-between" wrap="wrap">
        <Group gap="md">
          <TextInput
            placeholder="Search by name or email..."
            leftSection={<IconSearch size={16} />}
            value={searchQuery}
            onChange={e => handleSearchChange(e.currentTarget.value)}
            radius="md"
            size="sm"
            w={250}
          />
          <Select
            placeholder="Filter by role"
            data={[
              { value: 'all', label: 'All Roles' },
              { value: 'MEMBER', label: 'Members' },
              { value: 'ADMIN', label: 'Admins' },
            ]}
            value={roleFilter}
            onChange={handleFilterChange}
            clearable={false}
            radius="md"
            size="sm"
            w={150}
          />
        </Group>

        <Group gap="xs">
          <Text size="sm" c="dimmed">
            Show:
          </Text>
          <Select
            data={[
              { value: '5', label: '5' },
              { value: '10', label: '10' },
              { value: '20', label: '20' },
              { value: '50', label: '50' },
            ]}
            value={pageSize.toString()}
            onChange={handlePageSizeChange}
            size="sm"
            w={70}
            radius="md"
          />
        </Group>
      </Group>

      <Card shadow="sm" padding="0" radius="lg" withBorder>
        {isPending ? (
          <Stack gap="xs" p="md">
            {Array.from({ length: pageSize }).map((_, index) => (
              <Skeleton key={index} height={60} radius="md" />
            ))}
          </Stack>
        ) : filteredMembers.length === 0 ? (
          <Center p="xl">
            <Stack align="center" gap="md">
              <IconUsers size={48} stroke={1.5} color="var(--mantine-color-gray-5)" />
              <Text size="lg" fw={500} c="dimmed">
                {searchQuery || roleFilter !== 'all' ? 'No members found' : 'No members available'}
              </Text>
              <Text size="sm" c="dimmed" ta="center">
                {searchQuery || roleFilter !== 'all'
                  ? 'Try adjusting your search or filter criteria.'
                  : 'No members have been added to the system yet.'}
              </Text>
            </Stack>
          </Center>
        ) : (
          <>
            <Table.ScrollContainer minWidth={800}>
              <Table verticalSpacing="md" horizontalSpacing="lg" highlightOnHover>
                <Table.Thead>
                  <Table.Tr>
                    <Table.Th>Member</Table.Th>
                    <Table.Th>Role</Table.Th>
                    <Table.Th>Status</Table.Th>
                    <Table.Th>Last Login</Table.Th>
                    <Table.Th>Created</Table.Th>
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                  {paginatedMembers.map(member => (
                    <Table.Tr key={member._id}>
                      <Table.Td>
                        <Group gap="sm">
                          <Avatar color="blue" radius="xl" size="md">
                            {getInitials(member.fullName)}
                          </Avatar>
                          <Stack gap={2}>
                            <Text size="sm" fw={500}>
                              {member.fullName}
                            </Text>
                            <Text size="xs" c="dimmed">
                              {member.email}
                            </Text>
                          </Stack>
                        </Group>
                      </Table.Td>
                      <Table.Td>
                        <Badge
                          variant="light"
                          color={getRoleBadgeColor(member.role)}
                          size="sm"
                          radius="md"
                        >
                          {member.role}
                        </Badge>
                      </Table.Td>
                      <Table.Td>
                        <Badge
                          variant="dot"
                          color={member.isFirstLogin ? 'orange' : 'green'}
                          size="sm"
                          radius="md"
                        >
                          {member.isFirstLogin ? 'First Login Pending' : 'Active'}
                        </Badge>
                      </Table.Td>
                      <Table.Td>
                        <Text size="sm" c="dimmed">
                          {member.lastLogin ? formatDate(member.lastLogin) : 'Never'}
                        </Text>
                      </Table.Td>
                      <Table.Td>
                        <Text size="sm" c="dimmed">
                          {formatDate(member.createdAt)}
                        </Text>
                      </Table.Td>
                    </Table.Tr>
                  ))}
                </Table.Tbody>
              </Table>
            </Table.ScrollContainer>

            {/* Pagination */}
            {totalPages > 1 && (
              <Group
                justify="space-between"
                p="md"
                bg="gray.0"
                style={{ borderRadius: '0 0 12px 12px' }}
              >
                <Text size="sm" c="dimmed">
                  Showing {startIndex + 1} to{' '}
                  {Math.min(startIndex + pageSize, filteredMembers.length)} of{' '}
                  {filteredMembers.length} members
                </Text>
                <Pagination
                  total={totalPages}
                  value={currentPage}
                  onChange={setCurrentPage}
                  size="sm"
                  radius="md"
                />
              </Group>
            )}
          </>
        )}
      </Card>
    </Stack>
  );
}

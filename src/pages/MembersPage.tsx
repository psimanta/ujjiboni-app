import { Table, Text, Badge, Group, Stack, Card, Title, Avatar } from '@mantine/core';
import { useStore } from '../store';
import { getInitials } from '../utils/string';
import { formatDate } from '../utils/date';

export function MembersPage() {
  const { members } = useStore(state => state);
  return (
    <Stack gap="lg">
      <Title order={2} size="h3" fw={600}>
        Members
      </Title>

      <Card shadow="sm" padding="0" radius="lg" withBorder>
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
              {members.map(member => (
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
                  <Table.Td>{member.role}</Table.Td>
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
      </Card>
    </Stack>
  );
}

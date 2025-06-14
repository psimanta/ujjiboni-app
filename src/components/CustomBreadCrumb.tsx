import { Breadcrumbs, Anchor } from '@mantine/core';
import { Link } from 'react-router-dom';

export function CustomBreadCrumbs({
  items,
}: {
  items: {
    label: string;
    href: string;
  }[];
}) {
  return (
    <Breadcrumbs>
      {items.map((item, index) => (
        <Anchor component={Link} to={item.href} key={index}>
          {item.label}
        </Anchor>
      ))}
    </Breadcrumbs>
  );
}

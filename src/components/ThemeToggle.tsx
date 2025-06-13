import { Switch, useComputedColorScheme } from '@mantine/core';
import { IconMoonStars, IconSun } from '@tabler/icons-react';
import { useAppContext } from '../contexts/AppContext';

export function ThemeToggle() {
  const { toggleColorScheme } = useAppContext();
  const computedColorScheme = useComputedColorScheme('light');

  return (
    <>
      <Switch
        size="md"
        color="dark.4"
        onLabel={<IconSun size={16} stroke={2.5} color="var(--mantine-color-yellow-4)" />}
        offLabel={<IconMoonStars size={16} stroke={2.5} color="var(--mantine-color-blue-6)" />}
        checked={computedColorScheme === 'dark'}
        onChange={toggleColorScheme}
      />
    </>
  );
}

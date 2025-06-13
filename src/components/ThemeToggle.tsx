import { Switch } from '@mantine/core';
import { IconMoonStars, IconSun } from '@tabler/icons-react';
import { useStore } from '../store';

export function ThemeToggle() {
  const { toggleTheme, theme } = useStore();

  const checked = theme === 'dark';

  return (
    <>
      <Switch
        size="md"
        color="dark.4"
        onLabel={<IconSun size={16} stroke={2.5} color="var(--mantine-color-yellow-4)" />}
        offLabel={<IconMoonStars size={16} stroke={2.5} color="var(--mantine-color-blue-6)" />}
        // thumbIcon={
        //   checked ? (
        //     <IconSun size={16} stroke={2.5} color="var(--mantine-color-yellow-4)" />
        //   ) : (
        //     <IconMoonStars size={16} stroke={2.5} color="var(--mantine-color-blue-6)" />
        //   )
        // }
        checked={checked}
        onChange={toggleTheme}
      />
    </>
  );
}

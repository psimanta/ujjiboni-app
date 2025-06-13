import { Switch } from '@mantine/core';
import { IconMoonStars, IconSun } from '@tabler/icons-react';
import { useAppContext } from '../contexts/AppContext';
import { storage } from '../utils/local-storage';
import { useEffect } from 'react';

export function ThemeToggle() {
  const { toggleColorScheme, colorScheme } = useAppContext();

  const checked = colorScheme === 'dark';

  useEffect(() => {
    storage.set('ujjiboni-app-color-scheme', colorScheme);
  }, [colorScheme]);

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
        onChange={toggleColorScheme}
      />
    </>
  );
}

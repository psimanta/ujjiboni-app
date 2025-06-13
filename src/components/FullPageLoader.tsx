import { LoadingOverlay } from '@mantine/core';

export function FullPageLoader() {
  return (
    <div className="flex h-screen w-screen items-center justify-center">
      <LoadingOverlay visible={true} />
    </div>
  );
}

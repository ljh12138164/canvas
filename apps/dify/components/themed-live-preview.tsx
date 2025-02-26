'use client';

import { useTheme } from 'next-themes';
import { LivePreview } from 'react-live';

export function ThemedLivePreview(props: React.ComponentProps<typeof LivePreview>) {
  const { theme } = useTheme();

  return (
    <div className={theme === 'dark' ? 'dark' : ''}>
      <div className="bg-background text-foreground rounded-md p-4 h-full">
        <LivePreview {...props} />
      </div>
    </div>
  );
}

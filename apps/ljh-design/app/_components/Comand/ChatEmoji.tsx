'use client';
import data from '@emoji-mart/data';
import Picker from '@emoji-mart/react';
import { useTheme } from 'next-themes';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
// import { Button } from '../ui/button';
import styles from './chat.module.css';

export default function Emoji({
  children,
  // @ts-ignore
  onClick,
}: { children: React.ReactNode; onClick: (e: any) => void }) {
  const theme = useTheme();
  return (
    <Popover>
      <PopoverTrigger asChild>{children}</PopoverTrigger>
      <PopoverContent asChild>
        <section className={`h-full w-full  ${styles.emojiPicker} `}>
          <Picker
            data={data}
            onEmojiSelect={(e: any) => onClick(e)}
            theme={theme.theme === 'dark' ? 'dark' : 'light'}
            locale="zh"
            custom={[
              {
                styles: {
                  section: {
                    display: 'flex !important',
                    'flex-direction': 'column !important',
                    'z-index': '100000',
                    width: '100% !important',
                  },
                },
              },
            ]}
            previewPosition="none"
            skinTonePosition="none"
            navPosition="bottom"
            perLine={6}
          />
        </section>
      </PopoverContent>
    </Popover>
  );
}

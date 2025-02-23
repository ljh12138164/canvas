'use client';
import type { Edit } from '@/app/_types/Edit';
import data from '@emoji-mart/data';
import Picker from '@emoji-mart/react';
import { useTheme } from 'next-themes';
import { ScrollArea } from '../ui/scroll-area';
import styles from './emoji.module.css';

export default function Emoji({ editor }: { editor: Edit | undefined }) {
  const theme = useTheme();
  return (
    <ScrollArea className="h-full w-full">
      <div className={`h-full w-full  ${styles.emojiPicker} `}>
        <Picker
          data={data}
          onEmojiSelect={(e: any) => editor?.addEmoji(e.native)}
          theme={theme.theme === 'dark' ? 'dark' : 'light'}
          locale="zh"
          previewPosition="none"
          custom={[
            {
              id: 'custom-style',
              name: 'Custom Style',
              styles: {
                'em-emoji-picker': {
                  '--rgb-background': '255, 255, 255',
                },
                section: {
                  display: 'flex !important',
                  'flex-direction': 'column !important',
                  width: '100% !important',
                },
              },
            },
          ]}
          skinTonePosition="none"
          navPosition="bottom"
          perLine={6}
        />
      </div>
    </ScrollArea>
  );
}

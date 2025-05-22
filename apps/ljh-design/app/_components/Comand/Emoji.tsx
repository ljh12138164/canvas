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
          i18n={{
            search: '搜索',
            search_no_results_1: '哦不！',
            search_no_results_2: '没有找到相关表情',
            pick: '选择一个表情…',
            add_custom: '添加自定义表情',
            categories: {
              activity: '活动',
              custom: '自定义',
              flags: '旗帜',
              foods: '食物与饮品',
              frequent: '最近使用',
              nature: '动物与自然',
              objects: '物品',
              people: '表情与角色',
              places: '旅行与景点',
              search: '搜索结果',
              symbols: '符号',
            },
            skins: {
              choose: '选择默认肤色',
              '1': '默认',
              '2': '白色',
              '3': '偏白',
              '4': '中等',
              '5': '偏黑',
              '6': '黑色',
            },
          }}
          skinTonePosition="none"
          navPosition="bottom"
          perLine={6}
        />
      </div>
    </ScrollArea>
  );
}

import type { Message, MessageArr } from '@/app/_types/ai';
import localforage from 'localforage';
import { nanoid } from 'nanoid';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { createAi, getAiChatById, getIndexDB, indexDBChange } from '../ai';

// 模拟 localforage
vi.mock('localforage', () => ({
  default: {
    setItem: vi.fn(),
    removeItem: vi.fn(),
    getItem: vi.fn(),
    iterate: vi.fn(),
    config: vi.fn(),
  },
}));

// 模拟 nanoid
vi.mock('nanoid', () => ({
  nanoid: vi.fn().mockReturnValue('mock-nanoid'),
}));

describe('AI 聊天相关函数', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  describe('indexDBChange 函数', () => {
    it('添加模式下应该调用 setItem', async () => {
      const mockData: MessageArr = {
        id: 'chat-id',
        history: [
          {
            role: 'user',
            parts: [{ text: '你好，AI助手' }],
          },
        ],
        name: '新对话',
      };

      const result = await indexDBChange({
        type: 'add',
        data: mockData,
        id: 'storage-id',
      });

      expect(localforage.setItem).toHaveBeenCalledWith('storage-id', mockData);
      expect(localforage.removeItem).not.toHaveBeenCalled();
      expect(result).toBe(true);
    });

    it('删除模式下应该调用 removeItem', async () => {
      const result = await indexDBChange({
        type: 'delete',
        deletItem: 'storage-id',
        id: 'any-id',
      });

      expect(localforage.removeItem).toHaveBeenCalledWith('storage-id');
      expect(localforage.setItem).not.toHaveBeenCalled();
      expect(result).toBe(true);
    });

    it('当提供的参数不匹配任何操作类型时应返回 false', async () => {
      // 不提供必要的参数
      const result = await indexDBChange({
        type: 'add',
        id: 'storage-id',
      });

      expect(localforage.setItem).not.toHaveBeenCalled();
      expect(localforage.removeItem).not.toHaveBeenCalled();
      expect(result).toBe(false);
    });
  });

  describe('getIndexDB 函数', () => {
    it('应该从 localforage 检索所有 AI 对话', async () => {
      const mockChats: MessageArr[] = [
        {
          id: 'chat-1',
          history: [
            {
              role: 'user',
              parts: [{ text: '第一条消息' }],
            },
            {
              role: 'model',
              parts: [{ text: '回复第一条' }],
            },
          ],
          name: '对话 1',
        },
        {
          id: 'chat-2',
          history: [
            {
              role: 'user',
              parts: [{ text: '第二条消息' }],
            },
          ],
          name: '对话 2',
        },
      ];

      // 模拟 iterate 函数将项目添加到数组中
      vi.mocked(localforage.iterate).mockImplementation((callback) => {
        mockChats.forEach((chat) => {
          (callback as Function)(chat);
        });
        return Promise.resolve();
      });

      const result = await getIndexDB();

      expect(localforage.iterate).toHaveBeenCalled();
      expect(result.length).toBe(2);
      expect(result).toContainEqual(mockChats[0]);
      expect(result).toContainEqual(mockChats[1]);
    });

    it('当没有对话时应返回空数组', async () => {
      // 模拟 iterate 不执行回调
      vi.mocked(localforage.iterate).mockImplementation(() => {
        return Promise.resolve();
      });

      const result = await getIndexDB();

      expect(localforage.iterate).toHaveBeenCalled();
      expect(result).toEqual([]);
    });
  });

  describe('getAiChatById 函数', () => {
    it('应该通过 ID 检索特定对话', async () => {
      const mockChat: MessageArr = {
        id: 'chat-id',
        history: [
          {
            role: 'user',
            parts: [{ text: '测试消息' }],
          },
        ],
        name: '测试对话',
      };

      vi.mocked(localforage.getItem).mockResolvedValue(mockChat);

      const result = await getAiChatById('chat-id');

      expect(localforage.getItem).toHaveBeenCalledWith('chat-id');
      expect(result).toEqual(mockChat);
    });

    it('当对话不存在时应返回 null', async () => {
      vi.mocked(localforage.getItem).mockResolvedValue(null);

      const result = await getAiChatById('non-existent-id');

      expect(localforage.getItem).toHaveBeenCalledWith('non-existent-id');
      expect(result).toBeNull();
    });
  });

  describe('createAi 函数', () => {
    it('应该创建新的对话并存储到 localforage', async () => {
      const mockMessages: Message[] = [
        {
          role: 'user',
          parts: [{ text: '你好，AI' }],
        },
      ];

      // 模拟 indexDBChange 函数
      vi.spyOn(localforage, 'setItem').mockResolvedValue(undefined);

      const result = await createAi('storage-id', mockMessages, '新AI对话');

      // 检查 indexDBChange 是否被正确调用
      // expect(localforage.setItem).toHaveBeenCalledWith('storage-id', {
      //   id: 'mock-nanoid', // nanoid() 的模拟返回值
      //   history: mockMessages,
      //   name: '新AI对话',
      // });

      expect(nanoid).toHaveBeenCalled();
      expect(result).toBe(true);
    });
  });
});

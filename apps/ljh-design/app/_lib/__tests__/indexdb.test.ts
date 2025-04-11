import type { Board } from '@/app/_types/board';
import localforage from 'localforage';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { getIndexDB, getTryBoardById, indexDBChange } from '../utils';

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

describe('IndexDB 函数', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  describe('indexDBChange 函数', () => {
    it('应该在添加模式下调用 setItem', async () => {
      const mockData: Partial<Board> = {
        id: 'test-id',
        name: '测试画板',
        created_at: new Date().toISOString(),
      };

      await indexDBChange({
        type: 'add',
        data: mockData,
      });

      expect(localforage.setItem).toHaveBeenCalledWith('test-id', mockData);
      expect(localforage.removeItem).not.toHaveBeenCalled();
    });

    it('应该在删除模式下调用 removeItem', async () => {
      await indexDBChange({
        type: 'delete',
        deletItem: 'test-id',
      });

      expect(localforage.removeItem).toHaveBeenCalledWith('test-id');
      expect(localforage.setItem).not.toHaveBeenCalled();
    });

    it('应该在编辑模式下先调用 removeItem 再调用 setItem', async () => {
      const mockEditData: Partial<Board> = {
        id: 'test-id',
        name: '更新的画板',
        updated_at: new Date().toISOString(),
      };

      await indexDBChange({
        type: 'edit',
        editData: mockEditData,
      });

      expect(localforage.removeItem).toHaveBeenCalledWith('test-id');
      expect(localforage.setItem).toHaveBeenCalledWith('test-id', mockEditData);
    });

    it('当提供的参数不匹配任何操作类型时不应有任何效果', async () => {
      // 不提供必要的参数
      await indexDBChange({
        type: 'add',
      });

      expect(localforage.setItem).not.toHaveBeenCalled();
      expect(localforage.removeItem).not.toHaveBeenCalled();
    });
  });

  describe('getIndexDB 函数', () => {
    it('应该从 localforage 检索所有项目', async () => {
      const mockBoards: Board[] = [
        {
          id: 'board-1',
          name: '画板 1',
          created_at: new Date().toISOString(),
          width: 800,
          height: 600,
          json: '{}',
        },
        {
          id: 'board-2',
          name: '画板 2',
          created_at: new Date().toISOString(),
          width: 800,
          height: 600,
          json: '{}',
        },
      ];

      // 模拟 iterate 函数将项目添加到数组中
      vi.mocked(localforage.iterate).mockImplementation((callback) => {
        mockBoards.forEach((board) => {
          (callback as Function)(board);
        });
        return Promise.resolve();
      });

      const result = await getIndexDB();

      expect(localforage.iterate).toHaveBeenCalled();
      expect(result.length).toBe(2);
      expect(result).toContainEqual(mockBoards[0]);
      expect(result).toContainEqual(mockBoards[1]);
    });

    it('当没有项目时应返回空数组', async () => {
      // 模拟 iterate 不执行回调
      vi.mocked(localforage.iterate).mockImplementation(() => {
        return Promise.resolve();
      });

      const result = await getIndexDB();

      expect(localforage.iterate).toHaveBeenCalled();
      expect(result).toEqual([]);
    });
  });

  describe('getTryBoardById 函数', () => {
    it('应该通过 ID 检索特定项目', async () => {
      const mockBoard: Board = {
        id: 'specific-board',
        name: '特定画板',
        created_at: new Date().toISOString(),
        width: 800,
        height: 600,
        json: '{}',
      };

      vi.mocked(localforage.getItem).mockResolvedValue(mockBoard);

      const result = await getTryBoardById('specific-board');

      expect(localforage.getItem).toHaveBeenCalledWith('specific-board');
      expect(result).toEqual(mockBoard);
    });

    it('当项目不存在时应返回 null', async () => {
      vi.mocked(localforage.getItem).mockResolvedValue(null);

      const result = await getTryBoardById('non-existent-id');

      expect(localforage.getItem).toHaveBeenCalledWith('non-existent-id');
      expect(result).toBeNull();
    });
  });
});

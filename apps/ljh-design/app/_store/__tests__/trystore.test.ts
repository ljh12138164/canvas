import type { Board } from '@/app/_types/board';
import { beforeEach, describe, expect, it } from 'vitest';
import { tryStore } from '../trystore';

describe('tryStore Store', () => {
  // 每次测试前重置 store 状态
  beforeEach(() => {
    tryStore.setState({
      data: undefined,
      isLoading: true,
      setData: tryStore.getState().setData,
      setIsLoading: tryStore.getState().setIsLoading,
    });
  });

  it('初始状态应该是 data=undefined, isLoading=true', () => {
    const state = tryStore.getState();
    expect(state.data).toBeUndefined();
    expect(state.isLoading).toBe(true);
  });

  it('setData 方法应该更新 data', () => {
    // 创建一个模拟的 Board 数据
    const mockBoard: Board = {
      id: '1',
      name: '测试画板',
      json: '{}',
      width: 800,
      height: 600,
      updated_at: '2023-04-01T10:00:00.000Z',
      created_at: '2023-04-01T10:00:00.000Z',
    };

    // 调用 setData 方法
    tryStore.getState().setData(mockBoard);

    // 验证状态更新
    const state = tryStore.getState();
    expect(state.data).toEqual(mockBoard);
    // isLoading 保持不变
    expect(state.isLoading).toBe(true);
  });

  it('setIsLoading 方法应该更新 isLoading 状态', () => {
    // 调用 setIsLoading 方法
    tryStore.getState().setIsLoading(false);

    // 验证状态更新
    const state = tryStore.getState();
    expect(state.isLoading).toBe(false);
    // data 保持不变
    expect(state.data).toBeUndefined();
  });

  it('两个方法可以一起使用', () => {
    // 创建一个模拟的 Board 数据
    const mockBoard: Board = {
      id: '1',
      name: '测试画板',
      json: '{}',
      width: 800,
      height: 600,
      updated_at: '2023-04-01T10:00:00.000Z',
      created_at: '2023-04-01T10:00:00.000Z',
    };

    // 设置数据和加载状态
    tryStore.getState().setData(mockBoard);
    tryStore.getState().setIsLoading(false);

    // 验证状态更新
    const state = tryStore.getState();
    expect(state.data).toEqual(mockBoard);
    expect(state.isLoading).toBe(false);
  });
});

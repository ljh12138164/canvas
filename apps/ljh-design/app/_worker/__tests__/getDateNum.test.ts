import dayjs from 'dayjs';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

// 模拟self和postMessage
const mockPostMessage = vi.fn();
const mockSelf = {
  postMessage: mockPostMessage,
};

// 保存原始的self
const originalSelf = global.self;

describe('getDateNum worker', () => {
  beforeEach(() => {
    // 模拟Web Worker环境
    vi.resetModules();
    global.self = mockSelf as any;
    mockPostMessage.mockClear();
  });

  afterEach(() => {
    // 恢复原始的self
    global.self = originalSelf;
  });

  it('应该在不提供日期时返回最近30天的日期', async () => {
    // 导入模块（这会执行其中的代码）
    await import('../getDateNum');

    // 触发onmessage
    const messageEvent = {
      data: {
        startTime: undefined,
        endTime: undefined,
      },
    } as MessageEvent;

    // 调用self.onmessage
    (global.self as any).onmessage(messageEvent);

    // 验证postMessage被调用
    expect(mockPostMessage).toHaveBeenCalled();

    // 获取结果
    const result = mockPostMessage.mock.calls[0][0];

    // 验证结果是一个数组
    expect(Array.isArray(result)).toBe(true);

    // 验证数组长度（应该是31天，包括今天）
    expect(result.length).toBe(31);

    // 验证最后一个日期是今天
    const today = dayjs().format('YYYY-MM-DD');
    expect(result[result.length - 1]).toBe(today);
  });

  it('应该在提供开始和结束日期时返回两个日期之间的所有日期', async () => {
    // 导入模块
    await import('../getDateNum');

    // 设置开始和结束日期
    const startTime = new Date('2023-01-01');
    const endTime = new Date('2023-01-05');

    // 触发onmessage
    const messageEvent = {
      data: {
        startTime,
        endTime,
      },
    } as MessageEvent;

    // 调用self.onmessage
    (global.self as any).onmessage(messageEvent);

    // 验证postMessage被调用
    expect(mockPostMessage).toHaveBeenCalled();

    // 获取结果
    const result = mockPostMessage.mock.calls[0][0];

    // 验证结果是一个数组
    expect(Array.isArray(result)).toBe(true);

    // 验证数组长度（应该是5天）
    expect(result.length).toBe(5);

    // 验证日期顺序
    expect(result[0]).toBe('2023-01-01');
    expect(result[1]).toBe('2023-01-02');
    expect(result[2]).toBe('2023-01-03');
    expect(result[3]).toBe('2023-01-04');
    expect(result[4]).toBe('2023-01-05');
  });

  it('应该在只提供结束日期时返回从一个月前到结束日期的所有日期', async () => {
    // 导入模块
    await import('../getDateNum');

    // 设置结束日期
    const endTime = new Date('2023-02-15');

    // 触发onmessage
    const messageEvent = {
      data: {
        startTime: undefined,
        endTime,
      },
    } as MessageEvent;

    // 调用self.onmessage
    (global.self as any).onmessage(messageEvent);

    // 验证postMessage被调用
    expect(mockPostMessage).toHaveBeenCalled();

    // 获取结果
    const result = mockPostMessage.mock.calls[0][0];

    // 验证结果是一个数组
    expect(Array.isArray(result)).toBe(true);

    // 验证第一个日期是一个月前
    const oneMonthBefore = dayjs(endTime).subtract(1, 'month').format('YYYY-MM-DD');
    expect(result[0]).toBe(oneMonthBefore);

    // 验证最后一个日期是结束日期
    const lastDate = dayjs(endTime).format('YYYY-MM-DD');
    expect(result[result.length - 1]).toBe(lastDate);
  });

  it('应该在只提供开始日期时返回从开始日期到今天的所有日期', async () => {
    // 保存当前日期，用于验证
    const today = dayjs().format('YYYY-MM-DD');

    // 导入模块
    await import('../getDateNum');

    // 设置开始日期（5天前）
    const startTime = dayjs().subtract(5, 'day').toDate();

    // 触发onmessage
    const messageEvent = {
      data: {
        startTime,
        endTime: undefined,
      },
    } as MessageEvent;

    // 调用self.onmessage
    (global.self as any).onmessage(messageEvent);

    // 验证postMessage被调用
    expect(mockPostMessage).toHaveBeenCalled();

    // 获取结果
    const result = mockPostMessage.mock.calls[0][0];

    // 验证结果是一个数组
    expect(Array.isArray(result)).toBe(true);

    // 验证数组长度（应该是6天，包括今天）
    expect(result.length).toBe(6);

    // 验证第一个日期是开始日期
    const firstDate = dayjs(startTime).format('YYYY-MM-DD');
    expect(result[0]).toBe(firstDate);

    // 验证最后一个日期是今天
    expect(result[result.length - 1]).toBe(today);
  });
});

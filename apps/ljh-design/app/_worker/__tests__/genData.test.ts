import dayjs from 'dayjs';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

// 模拟self和postMessage
const mockPostMessage = vi.fn();
const mockSelf = {
  postMessage: mockPostMessage,
};

// 保存原始的self
const originalSelf = global.self;

// 创建模拟用户数据
const createMockUserData = () => {
  const today = dayjs();
  const yesterday = today.subtract(1, 'day');

  return [
    {
      id: '1',
      name: '用户1',
      show: [
        {
          id: '101',
          created_at: today.toISOString(),
          upvotes: [
            { id: 'u1', created_at: today.toISOString() },
            { id: 'u2', created_at: today.toISOString() },
          ],
          collections: [{ id: 'c1', created_at: today.toISOString() }],
        },
        {
          id: '102',
          created_at: yesterday.toISOString(),
          upvotes: [{ id: 'u3', created_at: yesterday.toISOString() }],
          collections: [],
        },
      ],
      board: [
        { id: 'b1', created_at: today.toISOString(), isTemplate: false },
        { id: 'b2', created_at: today.toISOString(), isTemplate: true },
        { id: 'b3', created_at: yesterday.toISOString(), isTemplate: false },
      ],
      material: [
        { id: 'm1', created_at: today.toISOString() },
        { id: 'm2', created_at: yesterday.toISOString() },
      ],
      upvotes: [
        { id: 'up1', created_at: today.toISOString() },
        { id: 'up2', created_at: yesterday.toISOString() },
      ],
      collections: [
        { id: 'col1', created_at: today.toISOString() },
        { id: 'col2', created_at: yesterday.toISOString() },
      ],
    },
    {
      id: '2',
      name: '用户2',
      show: [
        {
          id: '201',
          created_at: today.toISOString(),
          upvotes: [{ id: 'u4', created_at: today.toISOString() }],
          collections: [{ id: 'c2', created_at: today.toISOString() }],
        },
      ],
      board: [
        { id: 'b4', created_at: today.toISOString(), isTemplate: true },
        { id: 'b5', created_at: yesterday.toISOString(), isTemplate: true },
      ],
      material: [{ id: 'm3', created_at: today.toISOString() }],
      upvotes: [{ id: 'up3', created_at: today.toISOString() }],
      collections: [{ id: 'col3', created_at: today.toISOString() }],
    },
  ];
};

describe('genData worker', () => {
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

  it('应该正确计算总数并按日期过滤数据', async () => {
    // 导入模块（这会执行其中的代码）
    await import('../genData');

    const today = dayjs();
    const yesterday = today.subtract(1, 'day');
    const todayStr = today.format('YYYY-MM-DD');
    const yesterdayStr = yesterday.format('YYYY-MM-DD');

    // 准备测试数据
    const dateArray = [yesterdayStr, todayStr];
    const userData = createMockUserData();

    // 触发onmessage
    const messageEvent = {
      data: {
        data: dateArray,
        userData,
      },
    } as MessageEvent;

    // 调用self.onmessage
    (global.self as any).onmessage(messageEvent);

    // 验证postMessage被调用
    expect(mockPostMessage).toHaveBeenCalled();

    // 获取结果
    const result = mockPostMessage.mock.calls[0][0];

    // 验证总数统计
    expect(result.totalUser).toBe(2); // 2个用户
    expect(result.totalLike).toBe(4); // 所有用户的所有show中的upvotes总数
    expect(result.totalCollect).toBe(2); // 所有用户的所有show中的collections总数
    expect(result.totalDesign).toBe(3); // 所有用户的所有show总数
    expect(result.totalTemplate).toBe(3); // 所有用户的所有isTemplate为true的board总数
    expect(result.totalBoard).toBe(2); // 所有用户的所有isTemplate为false的board总数
    expect(result.totalMaterial).toBe(3); // 所有用户的所有material总数

    // 验证按日期过滤的数据
    expect(result.filterData.length).toBe(2); // 两天的数据

    // 检查昨天的数据
    const yesterdayData = result.filterData.find((d: any) => d.date === yesterdayStr);
    expect(yesterdayData).toBeDefined();
    expect(yesterdayData.show).toBe(1); // 昨天有1个show
    expect(yesterdayData.board).toBe(1); // 昨天有1个非模板board
    expect(yesterdayData.templates).toBe(1); // 昨天有1个模板
    expect(yesterdayData.material).toBe(1); // 昨天有1个素材

    // 检查今天的数据
    const todayData = result.filterData.find((d: any) => d.date === todayStr);
    expect(todayData).toBeDefined();
    expect(todayData.show).toBe(2); // 今天有2个show
    expect(todayData.board).toBe(1); // 今天有1个非模板board
    expect(todayData.templates).toBe(2); // 今天有2个模板
    expect(todayData.material).toBe(2); // 今天有2个素材
  });

  it('应该在用户数据为空时返回默认值', async () => {
    // 导入模块
    await import('../genData');

    // 准备测试数据
    const dateArray = [dayjs().format('YYYY-MM-DD')];

    // 触发onmessage
    const messageEvent = {
      data: {
        data: dateArray,
        userData: undefined,
      },
    } as MessageEvent;

    // 调用self.onmessage
    (global.self as any).onmessage(messageEvent);

    // 验证postMessage被调用
    expect(mockPostMessage).toHaveBeenCalled();

    // 获取结果
    const result = mockPostMessage.mock.calls[0][0];

    // 验证结果是一个对象且所有数值都为0
    expect(result).toEqual({
      filterData: [],
      totalUser: 0,
      totalLike: 0,
      totalCollect: 0,
      totalDesign: 0,
      totalTemplate: 0,
      totalBoard: 0,
      totalMaterial: 0,
    });
  });

  it('应该正确处理多个日期的数据', async () => {
    // 导入模块
    await import('../genData');

    // 准备测试数据
    const today = dayjs();
    const yesterday = today.subtract(1, 'day');
    const twoDaysAgo = today.subtract(2, 'day');

    const todayStr = today.format('YYYY-MM-DD');
    const yesterdayStr = yesterday.format('YYYY-MM-DD');
    const twoDaysAgoStr = twoDaysAgo.format('YYYY-MM-DD');

    const dateArray = [twoDaysAgoStr, yesterdayStr, todayStr];
    const userData = createMockUserData();

    // 触发onmessage
    const messageEvent = {
      data: {
        data: dateArray,
        userData,
      },
    } as MessageEvent;

    // 调用self.onmessage
    (global.self as any).onmessage(messageEvent);

    // 验证postMessage被调用
    expect(mockPostMessage).toHaveBeenCalled();

    // 获取结果
    const result = mockPostMessage.mock.calls[0][0];

    // 验证过滤后的数据长度
    expect(result.filterData.length).toBe(3); // 三天的数据

    // 检查空日期的数据（两天前）
    const emptyData = result.filterData.find((d: any) => d.date === twoDaysAgoStr);
    expect(emptyData).toBeDefined();
    expect(emptyData.show).toBe(0);
    expect(emptyData.board).toBe(0);
    expect(emptyData.templates).toBe(0);
    expect(emptyData.material).toBe(0);
  });

  it('应该正确处理可能为undefined的值', async () => {
    // 使用模块系统直接访问worker文件
    const genDataModule = await import('../genData');

    // 创建一个模拟函数来替换self.postMessage
    const originalPostMessage = self.postMessage;
    self.postMessage = mockPostMessage;

    try {
      // 直接调用worker.onmessage并传递可能产生null/undefined的数据
      // 创建一个特殊的测试数据集，只有一个用户但没有任何相关数据
      const emptyUserData = [
        {
          id: '1',
          name: '空用户',
          show: [],
          board: [],
          material: [],
          upvotes: [],
          collections: [],
        },
      ];

      // 创建一个空的日期数组（会导致filterData为空数组）
      const emptyDateArray: string[] = [];

      // 触发onmessage
      const messageEvent = {
        data: {
          data: emptyDateArray,
          userData: emptyUserData,
        },
      } as MessageEvent;

      // 调用self.onmessage
      (global.self as any).onmessage(messageEvent);

      // 验证postMessage被调用
      expect(mockPostMessage).toHaveBeenCalled();

      // 获取结果
      const result = mockPostMessage.mock.calls[0][0];

      // 测试后备值逻辑
      expect(result).toEqual({
        filterData: [], // 空日期数组会导致空的filterData
        totalUser: 1, // 一个用户
        totalLike: 0, // 没有点赞
        totalCollect: 0, // 没有收藏
        totalDesign: 0, // 没有设计
        totalTemplate: 0, // 没有模板
        totalBoard: 0, // 没有画板
        totalMaterial: 0, // 没有素材
      });
    } finally {
      // 恢复原始的postMessage
      self.postMessage = originalPostMessage;
    }
  });
});

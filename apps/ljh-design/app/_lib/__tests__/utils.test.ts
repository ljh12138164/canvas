import dayjs from 'dayjs';
import type * as fabric from 'fabric';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { cn, getDateNum, getUserColor, isText, randomColor, rgbaObjToString } from '../utils';

describe('cn 函数', () => {
  it('应该正确合并多个类名', () => {
    expect(cn('class1', 'class2')).toBe('class1 class2');
    expect(cn('class1', { class2: true, class3: false })).toBe('class1 class2');
    expect(cn('class1', ['class2', 'class3'])).toBe('class1 class2 class3');
  });

  it('应该正确处理条件类名', () => {
    const condition = true;
    expect(cn('class1', condition && 'class2')).toBe('class1 class2');
    expect(cn('class1', !condition && 'class2')).toBe('class1');
  });

  it('应该使用 tailwind-merge 解决冲突', () => {
    expect(cn('px-4 py-2', 'p-6')).toBe('p-6');
    expect(cn('text-red-500', 'text-blue-600')).toBe('text-blue-600');
  });
});

describe('rgbaObjToString 函数', () => {
  it('应该将 RGBA 对象转换为字符串', () => {
    const color = { r: 255, g: 0, b: 0, a: 0.5 };
    expect(rgbaObjToString(color)).toBe('rgba(255, 0, 0, 0.5)');
  });

  it('应该处理不提供 alpha 通道的情况', () => {
    const color = { r: 255, g: 0, b: 0 };
    expect(rgbaObjToString(color)).toBe('rgba(255, 0, 0, 1)');
  });

  it('应该处理 transparent 值', () => {
    expect(rgbaObjToString('transparent')).toBe('rgba(0, 0, 0, 0)');
  });
});

describe('isText 函数', () => {
  it('应该识别 fabric.Text 对象', () => {
    const textObj = { type: 'text' } as fabric.FabricObject;
    expect(isText(textObj)).toBe(true);
  });

  it('应该识别 fabric.IText 对象', () => {
    const iTextObj = { type: 'i-text' } as fabric.FabricObject;
    expect(isText(iTextObj)).toBe(true);
  });

  it('应该识别 fabric.Textbox 对象', () => {
    const textboxObj = { type: 'textbox' } as fabric.FabricObject;
    expect(isText(textboxObj)).toBe(true);
  });

  it('应该对非文本对象返回 false', () => {
    const rectObj = { type: 'rect' } as fabric.FabricObject;
    expect(isText(rectObj)).toBe(false);
  });

  it('应该处理 undefined 参数', () => {
    expect(isText(undefined as unknown as fabric.FabricObject)).toBe(false);
  });
});

describe('randomColor 函数', () => {
  it('应该返回格式正确的十六进制颜色字符串', () => {
    const color = randomColor();
    expect(color).toMatch(/^#[0-9a-f]{6}$/i);
  });

  it('多次调用应产生不同的结果', () => {
    // 使用 Math.random 模拟，确保结果可预测
    const originalRandom = Math.random;

    try {
      // 模拟 Math.random 返回不同值
      Math.random = vi.fn().mockReturnValueOnce(0.1).mockReturnValueOnce(0.2);

      const color1 = randomColor();
      const color2 = randomColor();

      // 验证两个颜色不同
      expect(color1).not.toBe(color2);
    } finally {
      // 恢复原始 Math.random
      Math.random = originalRandom;
    }
  });
});

describe('getUserColor 函数', () => {
  const HIGHLIGHT_COLORS = [
    '#F59E0B',
    '#EF4444',
    '#10B981',
    '#3B82F6',
    '#8B5CF6',
    '#D97706',
    '#EC4899',
    '#6366F1',
    '#22C55E',
    '#F97316',
    '#E11D48',
    '#2563EB',
    '#14B8A6',
    '#7C3AED',
    '#F43F5E',
    '#0EA5E9',
    '#6D28D9',
    '#047857',
    '#D946EF',
    '#0891B2',
  ];

  it('应该为相同的 ID 返回相同的颜色', () => {
    const id = 'user123';
    const color1 = getUserColor(id);
    const color2 = getUserColor(id);
    expect(color1).toBe(color2);
  });

  it('应该返回 HIGHLIGHT_COLORS 数组中的某一颜色', () => {
    const id = 'user123';
    const color = getUserColor(id);
    expect(HIGHLIGHT_COLORS).toContain(color);
  });

  it('不同的 ID 可能返回不同的颜色', () => {
    const id1 = 'user123';
    const id2 = 'user456';
    const color1 = getUserColor(id1);
    const color2 = getUserColor(id2);
    // 这个测试不是必须的，因为不同 ID 也可能计算出相同索引
    // 但大多数情况下，不同 ID 会有不同颜色
    expect(color1).toBeDefined();
    expect(color2).toBeDefined();
  });
});

describe('getDateNum 函数', () => {
  it('不提供参数时应返回最近 30 天的日期数组', () => {
    const result = getDateNum();
    const today = dayjs().format('YYYY-MM-DD');
    const oneMonthAgo = dayjs().subtract(30, 'day').format('YYYY-MM-DD');

    // 验证数组长度接近 30 天（可能有 31 天，取决于当前月份）
    expect(result.length).toBeGreaterThanOrEqual(30);

    // 验证数组包含今天的日期
    expect(result).toContain(today);

    // 验证数组起始日期接近一个月前
    const firstDate = result[0];
    const dayDiff = dayjs(today).diff(dayjs(firstDate), 'day');
    expect(dayDiff).toBeGreaterThanOrEqual(29);
    expect(dayDiff).toBeLessThanOrEqual(31);
  });

  it('提供开始日期时应从开始日期到今天', () => {
    const startDate = dayjs().subtract(10, 'day').toDate();
    const result = getDateNum(startDate);

    // 验证数组长度为 11（包括开始日期和今天）
    expect(result.length).toBe(11);

    // 验证开始日期正确
    expect(result[0]).toBe(dayjs(startDate).format('YYYY-MM-DD'));

    // 验证最后日期是今天
    expect(result[result.length - 1]).toBe(dayjs().format('YYYY-MM-DD'));
  });

  it('提供开始和结束日期时应返回之间的所有日期', () => {
    const startDate = new Date('2023-01-01');
    const endDate = new Date('2023-01-10');
    const result = getDateNum(startDate, endDate);

    // 验证数组长度为 10
    expect(result.length).toBe(10);

    // 验证开始和结束日期
    expect(result[0]).toBe('2023-01-01');
    expect(result[result.length - 1]).toBe('2023-01-10');

    // 验证中间日期
    expect(result).toContain('2023-01-05');
  });

  it('提供结束日期时应返回结束日期之前一个月的日期', () => {
    const endDate = new Date('2023-02-15');
    const result = getDateNum(undefined, endDate);

    // 验证数组包含结束日期
    expect(result).toContain('2023-02-15');

    // 验证开始日期是结束日期前一个月
    expect(result[0]).toBe('2023-01-15');

    // 验证数组长度应该是 32（1月15日至2月15日）
    expect(result.length).toBe(32);
  });
});

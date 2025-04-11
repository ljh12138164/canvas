import { act, renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { useIsMobile } from '../use-mobile';

// 定义一个模拟的matchMedia实现
function mockMatchMedia(matches: boolean) {
  return (query: string) => ({
    matches,
    media: query,
    onchange: null,
    addListener: vi.fn(), // 旧API，为了兼容性保留
    removeListener: vi.fn(), // 旧API，为了兼容性保留
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  });
}

describe('useIsMobile', () => {
  // 保存原始的window.matchMedia和window.innerWidth
  const originalMatchMedia = window.matchMedia;
  const originalInnerWidth = window.innerWidth;

  // 清理所有mock
  afterEach(() => {
    window.matchMedia = originalMatchMedia;
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      value: originalInnerWidth,
    });
    vi.restoreAllMocks();
  });

  it('应该在移动设备屏幕宽度下返回true', () => {
    // 模拟小屏幕设备 (例如手机)
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      value: 375,
    });
    window.matchMedia = vi.fn().mockImplementation(mockMatchMedia(true));

    const { result } = renderHook(() => useIsMobile());
    expect(result.current).toBe(true);
  });

  it('应该在桌面屏幕宽度下返回false', () => {
    // 模拟大屏幕设备 (例如桌面)
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      value: 1024,
    });
    window.matchMedia = vi.fn().mockImplementation(mockMatchMedia(false));

    const { result } = renderHook(() => useIsMobile());
    expect(result.current).toBe(false);
  });

  it('应该正确响应屏幕尺寸变化', () => {
    // 初始为桌面大小
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      value: 1024,
    });

    // 创建一个模拟的MediaQueryList对象，可以触发change事件
    const listeners: Function[] = [];
    window.matchMedia = vi.fn().mockImplementation((query: string) => ({
      matches: window.innerWidth < 768,
      media: query,
      onchange: null,
      addListener: vi.fn(), // 旧API
      removeListener: vi.fn(), // 旧API
      addEventListener: vi.fn((event, listener) => {
        listeners.push(listener);
      }),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }));

    const { result } = renderHook(() => useIsMobile());
    expect(result.current).toBe(false);

    // 模拟屏幕尺寸变化为移动设备
    act(() => {
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        value: 375,
      });
      // 调用所有注册的监听器
      listeners.forEach((listener) => listener());
    });

    expect(result.current).toBe(true);
  });

  it('应该在组件卸载时清理事件监听器', () => {
    // 创建一个可以跟踪removeEventListener调用的mock
    const removeEventListenerMock = vi.fn();
    window.matchMedia = vi.fn().mockImplementation((query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: removeEventListenerMock,
      dispatchEvent: vi.fn(),
    }));

    const { unmount } = renderHook(() => useIsMobile());
    unmount();

    // 验证removeEventListener被调用
    expect(removeEventListenerMock).toHaveBeenCalled();
  });
});

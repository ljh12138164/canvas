import { nanoid } from 'nanoid';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { downloadImage } from '../utils';

// 模拟 nanoid
vi.mock('nanoid', () => ({
  nanoid: vi.fn(() => 'mocked-nanoid'),
}));

describe('downloadImage 函数', () => {
  // 为了模拟 document.createElement、appendChild 和 click
  let originalCreateElement: typeof document.createElement;
  let originalAppendChild: typeof document.body.appendChild;
  let originalRemove: typeof Element.prototype.remove;

  // 跟踪模拟元素
  let mockAnchor: any;

  beforeEach(() => {
    // 保存原始方法
    originalCreateElement = document.createElement;
    originalAppendChild = document.body.appendChild;
    originalRemove = Element.prototype.remove;

    // 创建模拟锚点元素
    mockAnchor = {
      href: '',
      download: '',
      click: vi.fn(),
      remove: vi.fn(),
    };

    // 模拟 document.createElement
    document.createElement = vi.fn((tagName) => {
      if (tagName === 'a') return mockAnchor;
      return originalCreateElement.call(document, tagName);
    });

    // 模拟 document.body.appendChild
    document.body.appendChild = vi.fn();

    // 模拟 Element.prototype.remove
    Element.prototype.remove = vi.fn();
  });

  afterEach(() => {
    // 恢复原始方法
    document.createElement = originalCreateElement;
    document.body.appendChild = originalAppendChild;
    Element.prototype.remove = originalRemove;

    // 清除所有模拟
    vi.clearAllMocks();
  });

  it('应该创建带有正确 href 的锚点元素', () => {
    const fileUrl = 'data:image/png;base64,testdata';
    downloadImage(fileUrl, 'png');

    expect(document.createElement).toHaveBeenCalledWith('a');
    expect(mockAnchor.href).toBe(fileUrl);
  });

  it('应该使用 nanoid 为文件生成唯一名称', () => {
    downloadImage('data:image/jpeg;base64,testdata', 'jpeg');

    expect(nanoid).toHaveBeenCalled();
    expect(mockAnchor.download).toBe('mocked-nanoid.jpeg');
  });

  it('应该添加锚点到文档并触发点击', () => {
    downloadImage('data:image/png;base64,testdata', 'png');

    expect(document.body.appendChild).toHaveBeenCalledWith(mockAnchor);
    expect(mockAnchor.click).toHaveBeenCalled();
  });

  it('应该在下载后移除锚点元素', () => {
    downloadImage('data:image/png;base64,testdata', 'png');

    expect(mockAnchor.remove).toHaveBeenCalled();
  });

  it('应该支持不同的文件类型', () => {
    // 测试 PNG
    downloadImage('data:image/png;base64,testdata', 'png');
    expect(mockAnchor.download).toBe('mocked-nanoid.png');

    // 测试 JPEG
    vi.resetAllMocks();
    downloadImage('data:image/jpeg;base64,testdata', 'jpeg');
    expect(mockAnchor.download).toBe('mocked-nanoid.jpeg');

    // 测试 SVG
    vi.resetAllMocks();
    downloadImage('data:image/svg+xml;base64,testdata', 'svg');
    expect(mockAnchor.download).toBe('mocked-nanoid.svg');
  });
});

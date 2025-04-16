import * as fabric from 'fabric';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { createFilter, getWorkspace, importJsonToFabric } from '../editor/editor';

// 模拟 fabric.js 库
vi.mock('fabric', () => {
  // 模拟 filters
  const filters = {
    BaseFilter: class {},
    Sepia: class {},
    Polaroid: class {},
    Kodachrome: class {},
    Vintage: class {},
    Brownie: class {},
    BlackWhite: class {},
    Grayscale: class {},
    Brightness: class {},
    Contrast: class {},
    Invert: class {},
    RemoveColor: class {},
    BlendColor: class {},
    Pixelate: class {},
    Blur: class {},
    Convolute: class {},
    HueRotation: class {},
    Vibrance: class {},
    Gamma: class {},
    Resize: class {},
    Saturation: class {},
  };

  // 创建共享的模拟方法
  const loadFromJSON = vi.fn();
  const getObjects = vi.fn().mockReturnValue([]);
  const setViewportTransform = vi.fn();
  const toDataURL = vi.fn().mockReturnValue('data:image/png;base64,mock-data');
  const dispose = vi.fn();

  // 模拟 Canvas 类
  const Canvas = vi.fn().mockImplementation(() => ({
    loadFromJSON,
    getObjects,
    setViewportTransform,
    toDataURL,
    dispose,
  }));

  // 模拟 Rect 类
  const Rect = class {
    type = 'rect';
    name?: string;
    width = 800;
    height = 600;
    top = 0;
    left = 0;
  };

  return {
    Canvas,
    Rect,
    filters,
  };
});

describe('Fabric 相关函数', () => {
  describe('createFilter 函数', () => {
    it('应该创建 Sepia 滤镜', () => {
      const filter = createFilter('sepia');
      expect(filter).toBeInstanceOf(fabric.filters.Sepia);
    });

    it('应该创建 Polaroid 滤镜', () => {
      const filter = createFilter('polaroid');
      expect(filter).toBeInstanceOf(fabric.filters.Polaroid);
    });

    it('应该创建 Brightness 滤镜并设置亮度', () => {
      const filter = createFilter('brightness');
      expect(filter).toBeInstanceOf(fabric.filters.Brightness);
    });

    it('应该创建 Contrast 滤镜并设置对比度', () => {
      const filter = createFilter('contrast');
      expect(filter).toBeInstanceOf(fabric.filters.Contrast);
    });

    it('应该在未知滤镜类型时返回 null', () => {
      const filter = createFilter('unknown');
      expect(filter).toBeNull();
    });

    it('应该创建 Blur 滤镜并设置模糊值', () => {
      const filter = createFilter('blur-sm');
      expect(filter).toBeInstanceOf(fabric.filters.Blur);
    });

    it('应该创建 Convolute 滤镜用于锐化效果', () => {
      const filter = createFilter('sharpen');
      expect(filter).toBeInstanceOf(fabric.filters.Convolute);
    });

    it('应该创建 Convolute 滤镜用于浮雕效果', () => {
      const filter = createFilter('emboss');
      expect(filter).toBeInstanceOf(fabric.filters.Convolute);
    });
  });

  describe('getWorkspace 函数', () => {
    it('应该从画布对象中找到工作区矩形', () => {
      // 创建模拟画布
      const mockCanvas = new fabric.Canvas();

      // 创建模拟工作区和其他对象
      const mockWorkspace = new fabric.Rect();
      mockWorkspace.name = 'board';

      const mockObject1 = new fabric.Rect();
      const mockObject2 = new fabric.Rect();

      // 模拟 getObjects 返回包含工作区的数组
      vi.mocked(mockCanvas.getObjects).mockReturnValue([
        mockObject1,
        mockWorkspace,
        mockObject2,
      ] as any);

      // 调用函数并检查结果
      const workspace = getWorkspace(mockCanvas);
      expect(workspace).toBe(mockWorkspace);
    });

    it('当工作区不存在时应返回 undefined', () => {
      // 创建模拟画布
      const mockCanvas = new fabric.Canvas();

      // 模拟 getObjects 返回不包含工作区的数组
      vi.mocked(mockCanvas.getObjects).mockReturnValue([
        new fabric.Rect(),
        new fabric.Rect(),
      ] as any);

      // 调用函数并检查结果
      const workspace = getWorkspace(mockCanvas);
      expect(workspace).toBeUndefined();
    });
  });

  describe('importJsonToFabric 函数', () => {
    it('应该从 JSON 生成图片并返回 base64 数据', async () => {
      // 创建模拟工作区
      const mockWorkspace = new fabric.Rect();
      mockWorkspace.name = 'board';
      mockWorkspace.width = 800;
      mockWorkspace.height = 600;
      mockWorkspace.top = 0;
      mockWorkspace.left = 0;

      // 模拟 document.createElement 和 appendChild
      const originalCreateElement = document.createElement;
      const originalAppendChild = document.body.appendChild;

      document.createElement = vi.fn().mockImplementation((tagName) => {
        if (tagName === 'canvas') {
          return { id: '', style: {}, remove: vi.fn() };
        }
        return originalCreateElement.call(document, tagName);
      });

      document.body.appendChild = vi.fn();

      // 获取模拟的 Canvas 构造函数
      const mockCanvas = new fabric.Canvas();

      // 确保 getObjects 返回包含工作区的数组
      vi.mocked(mockCanvas.getObjects).mockReturnValue([mockWorkspace] as any);

      try {
        // 调用函数并检查结果
        const result = await importJsonToFabric({ json: '{"objects":[]}' });

        // 验证返回的数据
        expect(result).toBe('data:image/png;base64,mock-data');

        // 验证 fabric.Canvas 方法被正确调用
        expect(mockCanvas.loadFromJSON).toHaveBeenCalledWith('{"objects":[]}');
        expect(mockCanvas.setViewportTransform).toHaveBeenCalledWith([1, 0, 0, 1, 0, 0]);
        expect(mockCanvas.toDataURL).toHaveBeenCalledWith(
          expect.objectContaining({
            format: 'png',
            quality: 1,
            width: 800,
            height: 600,
          }),
        );
        expect(mockCanvas.dispose).toHaveBeenCalled();
      } finally {
        // 恢复原始方法
        document.createElement = originalCreateElement;
        document.body.appendChild = originalAppendChild;
      }
    });

    it('应该在发生错误时拒绝 Promise', async () => {
      // 模拟 document.createElement 抛出错误
      const originalCreateElement = document.createElement;
      document.createElement = vi.fn().mockImplementation(() => {
        throw new Error('模拟错误');
      });

      try {
        await expect(importJsonToFabric({ json: '{"objects":[]}' })).rejects.toThrow('模拟错误');
      } finally {
        // 恢复原始方法
        document.createElement = originalCreateElement;
      }
    });
  });
});

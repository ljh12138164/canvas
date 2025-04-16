// import { buildEditor } from '@/app/_store/editor';
// import type { Edit, FontStyle } from '@/app/_types/Edit';
// import type * as fabric from 'fabric';
// import { FaRobot } from 'react-icons/fa6';
// import { type MockInstance, beforeEach, describe, expect, it, vi } from 'vitest';

// // 模拟fabric.Canvas
// const createMockCanvas = () => {
//   // 基本的mock对象
//   const basicCanvas = {
//     add: vi.fn(),
//     remove: vi.fn(),
//     dispose: vi.fn(),
//     enableRetinaScaling: true,
//     preserveObjectStacking: true,
//     controlsAboveOverlay: true,
//     fireRightClick: true,
//     stopContextMenu: true,
//     isDrawingMode: false,
//     wrapperEl: {
//       addEventListener: vi.fn(),
//     },
//     freeDrawingBrush: {
//       width: 1,
//       color: '#000000',
//     },
//     getActiveObject: vi.fn(() => null),
//     getActiveObjects: vi.fn(() => []),
//     getObjects: vi.fn(() => []),
//     toObject: vi.fn(() => ({})),
//     centerObject: vi.fn(),
//     setDimensions: vi.fn(),
//     clipPath: undefined,
//     renderAll: vi.fn(),
//     discardActiveObject: vi.fn(),
//     setViewportTransform: vi.fn(),
//     toDataURL: vi.fn(() => 'data:image/png;base64,test'),
//     loadFromJSON: vi.fn(),
//     getCenterPoint: vi.fn(() => ({ x: 400, y: 300 })),
//     getZoom: vi.fn(() => 1),
//     zoomToPoint: vi.fn(),
//     bringObjectForward: vi.fn(),
//     sendObjectBackwards: vi.fn(),
//     setActiveObject: vi.fn(),
//     toSVG: vi.fn(() => '<svg>mock svg</svg>'),
//   };

//   // 返回Proxy避免类型检查错误
//   return new Proxy(basicCanvas, {
//     get(target, prop) {
//       if (prop in target) {
//         return target[prop as keyof typeof target];
//       }
//       // 对于未定义的属性，返回空函数
//       if (typeof prop === 'string') {
//         return vi.fn();
//       }
//       return undefined;
//     },
//   }) as unknown as fabric.Canvas;
// };

// const mockCanvas = createMockCanvas();
// const mockRectWorkspace = {
//   width: 800,
//   height: 600,
//   fill: '#ffffff',
//   name: 'board',
//   id: 'test-board-id',
//   type: 'rect',
//   getCenterPoint: vi.fn(() => ({ x: 400, y: 300 })),
// } as unknown as fabric.Rect;

// // 模拟getWorkspace函数
// vi.mock('@/app/_lib/utils', () => {
//   return {
//     getWorkspace: vi.fn(() => mockRectWorkspace),
//     downloadImage: vi.fn(),
//     isText: vi.fn((obj) => obj.type === 'text' || obj.type === 'i-text' || obj.type === 'textbox'),
//     createFilter: vi.fn(() => ({})),
//     importJsonToFabricObject: vi.fn(() => [
//       { id: 'mock-obj-1', type: 'rect' },
//       { id: 'mock-obj-2', type: 'circle' },
//     ]),
//     convertImagesToPDF: vi.fn(() => 'data:application/pdf;base64,test'),
//     importPDF: vi.fn(() => ['data:image/png;base64,test']),
//     center: vi.fn(),
//   };
// });

// // 重写center函数以避免调用getCenterPoint
// vi.mock('@/app/_lib/editor/editor', () => {
//   return {
//     center: vi.fn((canvas, object) => {
//       // 模拟居中功能，不实际执行
//       canvas.centerObject(object);
//       return object;
//     }),
//   };
// });

// // 模拟fabric实例方法
// vi.mock('fabric', async () => {
//   const actual = await vi.importActual('fabric');
//   return {
//     ...(actual as object),
//     FabricImage: {
//       fromURL: vi.fn((url, options) => {
//         return Promise.resolve({
//           id: '',
//           scaleToWidth: vi.fn(),
//           scaleToHeight: vi.fn(),
//           filters: [],
//           filtersArray: [],
//           type: 'image',
//           applyFilters: vi.fn(),
//           set: vi.fn(),
//           get: vi.fn(),
//           getCenterPoint: vi.fn(() => ({ x: 150, y: 150 })),
//         });
//       }),
//     },
//     Textbox: vi.fn((text, options) => ({
//       id: options?.id || '',
//       type: 'textbox',
//       text,
//       set: vi.fn(),
//       get: vi.fn((prop) => {
//         if (prop === 'fontSize') return options?.fontSize || 14;
//         if (prop === 'textAlign') return options?.textAlign || 'left';
//         if (prop === 'fontStyle') return options?.fontStyle || 'normal';
//         return undefined;
//       }),
//       getCenterPoint: vi.fn(() => ({ x: 150, y: 150 })),
//     })),
//     Circle: vi.fn((options) => ({
//       id: options?.id || '',
//       type: 'circle',
//       set: vi.fn(),
//       get: vi.fn(),
//       getCenterPoint: vi.fn(() => ({ x: 150, y: 150 })),
//     })),
//     Rect: vi.fn((options) => ({
//       id: options?.id || '',
//       type: 'rect',
//       set: vi.fn(),
//       get: vi.fn(),
//       getCenterPoint: vi.fn(() => ({ x: 150, y: 150 })),
//     })),
//     Triangle: vi.fn((options) => ({
//       id: options?.id || '',
//       type: 'triangle',
//       set: vi.fn(),
//       get: vi.fn(),
//       getCenterPoint: vi.fn(() => ({ x: 150, y: 150 })),
//     })),
//     Polygon: vi.fn((points, options) => ({
//       id: options?.id || '',
//       type: 'polygon',
//       points,
//       set: vi.fn(),
//       get: vi.fn(),
//       getCenterPoint: vi.fn(() => ({ x: 150, y: 150 })),
//     })),
//     Path: vi.fn((path, options) => ({
//       id: options?.id || '',
//       type: 'path',
//       path,
//       set: vi.fn(),
//       get: vi.fn(),
//       getCenterPoint: vi.fn(() => ({ x: 150, y: 150 })),
//     })),
//     Group: vi.fn((objects, options) => ({
//       id: options?.id || '',
//       type: 'group',
//       getObjects: vi.fn(() => objects || []),
//       set: vi.fn(),
//       get: vi.fn(),
//       getCenterPoint: vi.fn(() => ({ x: 150, y: 150 })),
//     })),
//     util: {
//       enlivenObjects: vi.fn((objects) =>
//         Promise.resolve([
//           {
//             id: 'mock-material',
//             type: 'group',
//             getObjects: vi.fn(() => []),
//             set: vi.fn(),
//             get: vi.fn(),
//             getCenterPoint: vi.fn(() => ({ x: 150, y: 150 })),
//           },
//         ]),
//       ),
//     },
//     loadSVGFromString: vi.fn((svg, callback) => {
//       callback([], {});
//     }),
//   };
// });

// // 模拟html2canvas
// vi.mock('html2canvas', () => ({
//   default: vi.fn(() =>
//     Promise.resolve({
//       toDataURL: vi.fn(() => 'data:image/png;base64,test'),
//     }),
//   ),
// }));

// // 模拟toast
// vi.mock('react-hot-toast', () => ({
//   default: {
//     success: vi.fn(),
//     error: vi.fn(),
//     loading: vi.fn(),
//     dismiss: vi.fn(),
//   },
// }));

// // 模拟nanoid
// vi.mock('nanoid', () => ({
//   nanoid: vi.fn(() => 'mock-id'),
// }));

// describe('编辑器(Editor)功能测试', () => {
//   // 创建mock状态和回调函数
//   const mockSetFillColor = vi.fn();
//   const mockSetStrokeColor = vi.fn();
//   const mockSetStrokeWidth = vi.fn();
//   const mockSetStrokeDashArray = vi.fn();
//   const mockSetOpacity = vi.fn();
//   const mockSetFontFamily = vi.fn();
//   const mockSetFontWeight = vi.fn();
//   const mockSetFontThickness = vi.fn();
//   const mockSetFontItalics = vi.fn();
//   const mockSetFontUnderline = vi.fn();
//   const mockSetFontAlign = vi.fn();
//   const mockSetFontSize = vi.fn();
//   const mockSetImageFilter = vi.fn();
//   const mockSetImageLoading = vi.fn();
//   const mockSetDrewColor = vi.fn();
//   const mockSetDrawWidth = vi.fn();
//   const mockSetCanvasColor = vi.fn();
//   const mockSetCanvasWidth = vi.fn();
//   const mockSetCanvasHeight = vi.fn();
//   const mockSave = vi.fn();
//   const mockCopy = vi.fn();
//   const mockPasty = vi.fn();
//   const mockCanRedo = vi.fn();
//   const mockCanUndo = vi.fn();
//   const mockUndo = vi.fn();
//   const mockRedo = vi.fn();
//   const mockSetHitoryIndex = vi.fn();
//   const mockAuthZoom = vi.fn();

//   let editor: Edit;

//   beforeEach(() => {
//     // 重置所有mock函数
//     vi.clearAllMocks();

//     // 为editor._centerObject方法提供一个mock实现
//     mockCanvas._centerObject = vi.fn();
//     mockCanvas.centerObject = vi.fn();

//     // 初始化编辑器
//     editor = buildEditor({
//       canvas: mockCanvas,
//       fillColor: '#000000',
//       strokeColor: '#000000',
//       strokeWidth: 1,
//       selectedObject: [],
//       strokeDashArray: [0, 0],
//       opacity: 1,
//       fontFamily: 'Arial',
//       fontWeight: 'normal',
//       fontThought: false,
//       userId: '123',
//       fontUnderline: false,
//       fontItalics: 'normal' as FontStyle,
//       fontAlign: 'left',
//       fontSize: 14,
//       imageLoading: false,
//       imageFilter: [],
//       drewColor: '#000000',
//       drawWidth: 1,
//       canvasWidth: 800,
//       canvasHeight: 600,
//       canvasColor: '#ffffff',
//       canvasHistory: [],
//       pasty: mockPasty,
//       save: mockSave,
//       canRedo: mockCanRedo,
//       canUndo: mockCanUndo,
//       undo: mockUndo,
//       redo: mockRedo,
//       setHitoryIndex: mockSetHitoryIndex,
//       setCanvasHeight: mockSetCanvasHeight,
//       setCanvasColor: mockSetCanvasColor,
//       setCanvasWidth: mockSetCanvasWidth,
//       authZoom: mockAuthZoom,
//       setDrewColor: mockSetDrewColor,
//       setDrawWidth: mockSetDrawWidth,
//       copy: mockCopy,
//       setImageFilter: mockSetImageFilter,
//       setImageLoading: mockSetImageLoading,
//       setFontSize: mockSetFontSize,
//       setFontAlign: mockSetFontAlign,
//       setFontUnderline: mockSetFontUnderline,
//       setFontItalics: mockSetFontItalics,
//       setFontThickness: mockSetFontThickness,
//       setFontWeight: mockSetFontWeight,
//       setFontFamily: mockSetFontFamily,
//       setOpacity: mockSetOpacity,
//       setStrokeDashArray: mockSetStrokeDashArray,
//       setStrokeColor: mockSetStrokeColor,
//       setFillColor: mockSetFillColor,
//       setStrokeWidth: mockSetStrokeWidth,
//     });

//     // 添加mock方法，防止调用未模拟的方法
//     editor.addObject = vi.fn();
//     editor.addText = vi.fn();
//     editor.addEmoji = vi.fn();
//     editor.addImage = vi.fn().mockResolvedValue(true);
//     editor.changeImageFilter = vi.fn().mockImplementation((filterName: string) => {
//       mockSetImageFilter([{ name: filterName, effect: {} }]);
//       mockSave();
//       return true;
//     });
//     editor.saveSvg = vi.fn().mockReturnValue('<svg>mock svg</svg>');
//     editor.savePng = vi.fn().mockReturnValue('data:image/png;base64,test');
//     editor.savejpg = vi.fn().mockReturnValue('data:image/png;base64,test');
//   });

//   describe('添加图形对象', () => {
//     it('添加矩形', () => {
//       editor.addObject({
//         key: 'rect',
//         addType: 'Rect',
//         title: '矩形',
//         icon: FaRobot,
//         option: {},
//       });

//       expect(editor.addObject).toHaveBeenCalled();
//     });

//     it('添加圆形', () => {
//       editor.addObject({
//         key: 'circle',
//         addType: 'Circle',
//         title: '圆形',
//         icon: FaRobot,
//         option: {},
//       });

//       expect(editor.addObject).toHaveBeenCalled();
//     });

//     it('添加三角形', () => {
//       editor.addObject({
//         key: 'triangle',
//         addType: 'Triangle',
//         title: '三角形',
//         icon: FaRobot,
//         option: {},
//       });

//       expect(editor.addObject).toHaveBeenCalled();
//     });

//     it('添加多边形', () => {
//       editor.addObject({
//         key: 'polygon',
//         addType: 'Polygon',
//         title: '多边形',
//         icon: FaRobot,
//         option: {},
//         points: [
//           { x: 0, y: 0 },
//           { x: 50, y: 0 },
//           { x: 25, y: 50 },
//         ],
//       });

//       expect(editor.addObject).toHaveBeenCalled();
//     });

//     it('添加路径', () => {
//       const pathData = ['M', 0, 0, 'L', 50, 50] as unknown as fabric.TSimpleParsedCommand[];

//       editor.addObject({
//         key: 'path',
//         addType: 'Path',
//         title: '路径',
//         icon: FaRobot,
//         option: {},
//         path: pathData,
//       });

//       expect(editor.addObject).toHaveBeenCalled();
//     });
//   });

//   describe('文本操作', () => {
//     it('添加文本', () => {
//       editor.addText('测试文本');
//       expect(editor.addText).toHaveBeenCalledWith('测试文本');
//     });

//     // it('添加表情符号', () => {
//     //   editor.addEmoji('😊');
//     //   expect(editor.addEmoji).toHaveBeenCalledWith('😊');
//     // });

//     // it('修改字体大小', () => {
//     //   // 模拟选中文本
//     //   (mockCanvas.getActiveObjects as unknown as MockInstance).mockReturnValue([
//     //     {
//     //       type: 'textbox',
//     //       set: vi.fn(),
//     //     },
//     //   ]);

//     //   editor.changeFontSize(24);

//     //   expect(mockSetFontSize).toHaveBeenCalledWith(24);
//     //   expect(mockCanvas.getActiveObjects).toHaveBeenCalled();
//     //   expect(mockCanvas.renderAll).toHaveBeenCalled();
//     // });

//     it('修改字体对齐方式', () => {
//       // 模拟选中文本
//       (mockCanvas.getActiveObjects as unknown as MockInstance).mockReturnValue([
//         {
//           type: 'textbox',
//           set: vi.fn(),
//         },
//       ]);

//       editor.changeFontAlign('center');

//       expect(mockSetFontAlign).toHaveBeenCalledWith('center');
//       expect(mockCanvas.getActiveObjects).toHaveBeenCalled();
//       expect(mockCanvas.renderAll).toHaveBeenCalled();
//     });

//     it('修改字体斜体', () => {
//       // 模拟选中文本
//       (mockCanvas.getActiveObjects as unknown as MockInstance).mockReturnValue([
//         {
//           type: 'textbox',
//           set: vi.fn(),
//         },
//       ]);

//       editor.changeFontItalic('italic');

//       expect(mockSetFontItalics).toHaveBeenCalledWith('italic');
//       expect(mockCanvas.getActiveObjects).toHaveBeenCalled();
//       expect(mockCanvas.renderAll).toHaveBeenCalled();
//     });

//     it('修改字体下划线', () => {
//       // 模拟选中文本
//       (mockCanvas.getActiveObjects as unknown as MockInstance).mockReturnValue([
//         {
//           type: 'textbox',
//           set: vi.fn(),
//         },
//       ]);

//       editor.changeFontUnderline(true);

//       expect(mockSetFontUnderline).toHaveBeenCalledWith(true);
//       expect(mockCanvas.getActiveObjects).toHaveBeenCalled();
//       expect(mockCanvas.renderAll).toHaveBeenCalled();
//     });

//     it('修改字体删除线', () => {
//       // 模拟选中文本
//       (mockCanvas.getActiveObjects as unknown as MockInstance).mockReturnValue([
//         {
//           type: 'textbox',
//           set: vi.fn(),
//         },
//       ]);

//       editor.changeFontLineThrough(true);

//       expect(mockSetFontThickness).toHaveBeenCalledWith(true);
//       expect(mockCanvas.getActiveObjects).toHaveBeenCalled();
//       expect(mockCanvas.renderAll).toHaveBeenCalled();
//     });

//     it('修改字体粗细', () => {
//       // 模拟选中文本
//       (mockCanvas.getActiveObjects as unknown as MockInstance).mockReturnValue([
//         {
//           type: 'textbox',
//           set: vi.fn(),
//         },
//       ]);

//       editor.changeFontWeight('bold');

//       expect(mockSetFontWeight).toHaveBeenCalledWith('bold');
//       expect(mockCanvas.getActiveObjects).toHaveBeenCalled();
//       expect(mockCanvas.renderAll).toHaveBeenCalled();
//     });

//     it('修改字体', () => {
//       // 模拟选中文本
//       (mockCanvas.getActiveObjects as unknown as MockInstance).mockReturnValue([
//         {
//           type: 'textbox',
//           set: vi.fn(),
//         },
//       ]);

//       editor.setFontFamily('Arial');

//       expect(mockSetFontFamily).toHaveBeenCalledWith('Arial');
//       expect(mockCanvas.getActiveObjects).toHaveBeenCalled();
//       expect(mockCanvas.renderAll).toHaveBeenCalled();
//     });
//   });

//   describe('图像操作', () => {
//     it('添加图像', async () => {
//       await editor.addImage(
//         'https://spvppoqewfwqyzlsmtru.supabase.co/storage/v1/object/public/ASSETS/avatar.svg',
//       );

//       expect(editor.addImage).toHaveBeenCalled();
//     });

//     it('添加图像滤镜', () => {
//       editor.changeImageFilter('Brightness');

//       expect(editor.changeImageFilter).toHaveBeenCalledWith('Brightness');
//       expect(mockSetImageFilter).toHaveBeenCalledWith([{ name: 'Brightness', effect: {} }]);
//       expect(mockSave).toHaveBeenCalled();
//     });

//     it('删除图像滤镜', () => {
//       // 模拟选中图像
//       (mockCanvas.getActiveObjects as unknown as MockInstance).mockReturnValue([
//         {
//           type: 'image',
//           filters: [{ name: 'Brightness' }],
//           filtersArray: [{ name: 'Brightness' }],
//           applyFilters: vi.fn(),
//         },
//       ]);

//       editor.deleteImageFilter('Brightness');

//       expect(mockSetImageFilter).toHaveBeenCalled();
//       expect(mockCanvas.renderAll).toHaveBeenCalled();
//     });

//     it('清除图像滤镜', () => {
//       // 模拟选中图像
//       (mockCanvas.getActiveObjects as unknown as MockInstance).mockReturnValue([
//         {
//           type: 'image',
//           filtersArray: [{ name: 'Brightness', effect: {} }],
//           filters: [{}],
//           applyFilters: vi.fn(),
//         },
//       ]);

//       editor.cleanFilter();

//       expect(mockSetImageFilter).toHaveBeenCalledWith([]);
//       expect(mockCanvas.getActiveObjects).toHaveBeenCalled();
//       expect(mockCanvas.renderAll).toHaveBeenCalled();
//     });
//   });

//   describe('对象属性修改', () => {
//     it('修改透明度', () => {
//       // 模拟选中对象
//       (mockCanvas.getActiveObjects as unknown as MockInstance).mockReturnValue([
//         {
//           set: vi.fn(),
//         },
//       ]);

//       editor.changeOpacty(0.5);

//       expect(mockSetOpacity).toHaveBeenCalledWith(0.5);
//       expect(mockCanvas.getActiveObjects).toHaveBeenCalled();
//       expect(mockCanvas.renderAll).toHaveBeenCalled();
//     });

//     it('修改填充颜色', () => {
//       // 模拟选中对象
//       (mockCanvas.getActiveObjects as unknown as MockInstance).mockReturnValue([
//         {
//           set: vi.fn(),
//         },
//       ]);

//       editor.setFillColor('#ff0000');

//       expect(mockSetFillColor).toHaveBeenCalledWith('#ff0000');
//       expect(mockCanvas.getActiveObjects).toHaveBeenCalled();
//       expect(mockCanvas.renderAll).toHaveBeenCalled();
//     });

//     it('修改边框颜色', () => {
//       // 模拟选中对象
//       (mockCanvas.getActiveObjects as unknown as MockInstance).mockReturnValue([
//         {
//           set: vi.fn(),
//         },
//       ]);

//       editor.setStrokeColor('#00ff00');

//       expect(mockSetStrokeColor).toHaveBeenCalledWith('#00ff00');
//       expect(mockCanvas.getActiveObjects).toHaveBeenCalled();
//       expect(mockCanvas.renderAll).toHaveBeenCalled();
//     });

//     it('修改边框宽度', () => {
//       // 模拟选中对象
//       (mockCanvas.getActiveObjects as unknown as MockInstance).mockReturnValue([
//         {
//           set: vi.fn(),
//         },
//       ]);

//       editor.setStrokeWidth(3);

//       expect(mockSetStrokeWidth).toHaveBeenCalledWith(3);
//       expect(mockCanvas.getActiveObjects).toHaveBeenCalled();
//       expect(mockCanvas.renderAll).toHaveBeenCalled();
//     });

//     it('修改边框虚线样式', () => {
//       // 模拟选中对象
//       (mockCanvas.getActiveObjects as unknown as MockInstance).mockReturnValue([
//         {
//           set: vi.fn(),
//         },
//       ]);

//       editor.changeStokeDashArray([5, 5]);

//       expect(mockSetStrokeDashArray).toHaveBeenCalledWith([5, 5]);
//       expect(mockCanvas.getActiveObjects).toHaveBeenCalled();
//       expect(mockCanvas.renderAll).toHaveBeenCalled();
//     });
//   });

//   // describe('图层操作', () => {
//   //   it('将对象向前移动', () => {
//   //     // 模拟选中对象
//   //     (mockCanvas.getActiveObjects as unknown as MockInstance).mockReturnValue([{ id: 'obj1' }]);

//   //     editor.bringForward();

//   //     expect(mockCanvas.getActiveObjects).toHaveBeenCalled();
//   //     expect(mockCanvas.bringObjectForward).toHaveBeenCalled();
//   //     expect(mockCanvas.renderAll).toHaveBeenCalled();
//   //   });

//   //   it('将对象向后移动', () => {
//   //     // 模拟选中对象
//   //     (mockCanvas.getActiveObjects as unknown as MockInstance).mockReturnValue([{ id: 'obj1' }]);

//   //     editor.sendBackwards();

//   //     expect(mockCanvas.getActiveObjects).toHaveBeenCalled();
//   //     expect(mockCanvas.sendObjectBackwards).toHaveBeenCalled();
//   //     expect(mockCanvas.renderAll).toHaveBeenCalled();
//   //   });
//   // });

//   // describe('导入导出操作', () => {
//   //   it('导出为PNG', () => {
//   //     const result = editor.savePng();
//   //     expect(result).toBe('data:image/png;base64,test');
//   //   });

//   //   it('导出为SVG', () => {
//   //     const result = editor.saveSvg();
//   //     expect(result).toBe('<svg>mock svg</svg>');
//   //   });

//   //   it('导出为JPG', () => {
//   //     const result = editor.savejpg();
//   //     expect(result).toBe('data:image/png;base64,test');
//   //   });

//   //   it('导出为JSON', () => {
//   //     mockCanvas.toObject = vi.fn().mockReturnValue({
//   //       objects: [{ type: 'rect', id: 'test' }],
//   //       background: '#ffffff',
//   //     });

//   //     editor.saveJson();

//   //     expect(mockCanvas.toObject).toHaveBeenCalled();
//   //     expect(mockAuthZoom).toHaveBeenCalled();
//   //   });

//   //   it('导出为PDF', async () => {
//   //     // 模拟pdf导出相关方法
//   //     global.URL.createObjectURL = vi.fn().mockReturnValue('blob:test');
//   //     global.URL.revokeObjectURL = vi.fn();

//   //     // 跳过实际下载逻辑
//   //     const downloadImage = vi.fn();
//   //     vi.stubGlobal('downloadImage', downloadImage);

//   //     await editor.savePdf();

//   //     expect(mockCanvas.setViewportTransform).toHaveBeenCalled();
//   //     expect(mockCanvas.toDataURL).toHaveBeenCalled();
//   //     expect(mockAuthZoom).toHaveBeenCalled();
//   //   });

//   //   it('从JSON导入', async () => {
//   //     const jsonData = '{"objects":[]}';

//   //     // 模拟loadFromJSON方法
//   //     mockCanvas.loadFromJSON = vi.fn().mockImplementation((json, callback) => {
//   //       if (callback) callback();
//   //     });

//   //     await editor.loadFromJson(jsonData);

//   //     expect(mockCanvas.loadFromJSON).toHaveBeenCalled();
//   //     expect(mockAuthZoom).toHaveBeenCalled();
//   //   });
//   // });
// });

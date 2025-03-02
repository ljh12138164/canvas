import { zValidator } from '@hono/zod-validator';
import to from 'await-to-js';
import { Hono } from 'hono';
import { streamSSE } from 'hono/streaming';
import { z } from 'zod';
import { model } from '../../../server/ai';

// 定义Fabric.js 6版本对象类型的验证模式
const fabricObjectSchema = z.object({
  type: z.enum(['Circle', 'Rect', 'Triangle', 'Polygon', 'Path', 'Textbox']),
  left: z.number().optional(),
  top: z.number().optional(),
  width: z.number().optional(),
  height: z.number().optional(),
  stroke: z.string().optional(),
  strokeWidth: z.number().optional(),
  opacity: z.number().optional(),
  angle: z.number().optional(),
  scaleX: z.number().optional(),
  scaleY: z.number().optional(),
  flipX: z.boolean().optional(),
  flipY: z.boolean().optional(),
  // Fabric.js 6版本特有属性
  shadow: z
    .object({
      color: z.string().optional(),
      blur: z.number().optional(),
      offsetX: z.number().optional(),
      offsetY: z.number().optional(),
      affectStroke: z.boolean().optional(),
      nonScaling: z.boolean().optional(),
    })
    .optional(),
  // 特定类型的属性
  radius: z.number().optional(), // 圆形
  rx: z.number().optional(), // 矩形圆角
  ry: z.number().optional(), // 矩形圆角
  text: z.string().optional(), // 文本
  fontSize: z.number().optional(), // 文本
  fontFamily: z.string().optional(), // 文本
  fontWeight: z.union([z.string(), z.number()]).optional(), // 文本
  fontStyle: z.string().optional(), // 文本
  underline: z.boolean().optional(), // 文本
  overline: z.boolean().optional(), // 文本
  linethrough: z.boolean().optional(), // 文本
  textAlign: z.enum(['left', 'center', 'right', 'justify']).optional(), // 文本
  charSpacing: z.number().optional(), // 文本
  lineHeight: z.number().optional(), // 文本
  src: z.string().optional(), // 图片
  crossOrigin: z.string().optional(), // 图片
  filters: z.array(z.any()).optional(), // 图片滤镜
  path: z.string().optional(), // 路径
  points: z.array(z.object({ x: z.number(), y: z.number() })).optional(), // 多边形
  // 渐变支持
  fill: z
    .union([
      z.string(),
      z.object({
        type: z.enum(['linear', 'radial']),
        coords: z.object({
          x1: z.number(),
          y1: z.number(),
          x2: z.number(),
          y2: z.number(),
          r1: z.number().optional(),
          r2: z.number().optional(),
        }),
        colorStops: z.array(
          z.object({
            offset: z.number(),
            color: z.string(),
          }),
        ),
      }),
    ])
    .optional(),
  // 动画相关属性
  clipPath: z.any().optional(),
  paintFirst: z.enum(['fill', 'stroke']).optional(),
  globalCompositeOperation: z.string().optional(),
  // 交互属性
  selectable: z.boolean().optional(),
  evented: z.boolean().optional(),
  lockMovementX: z.boolean().optional(),
  lockMovementY: z.boolean().optional(),
  lockRotation: z.boolean().optional(),
  lockScalingX: z.boolean().optional(),
  lockScalingY: z.boolean().optional(),
  lockSkewingX: z.boolean().optional(),
  lockSkewingY: z.boolean().optional(),
  // 边框和控制点
  hasBorders: z.boolean().optional(),
  hasControls: z.boolean().optional(),
  // 其他Fabric.js 6版本属性
  strokeUniform: z.boolean().optional(),
  strokeLineCap: z.enum(['butt', 'round', 'square']).optional(),
  strokeLineJoin: z.enum(['miter', 'round', 'bevel']).optional(),
  strokeMiterLimit: z.number().optional(),
  strokeDashArray: z.array(z.number()).optional(),
  strokeDashOffset: z.number().optional(),
});

// 定义请求体验证模式
const fabricRequestSchema = z.object({
  prompt: z.string().min(1),
});

// 定义响应体验证模式
const fabricResponseSchema = z.object({
  objects: z.array(fabricObjectSchema),
  background: z.string().optional(),
  version: z.string().optional(),
});

export const design = new Hono()
  .get('/test', (c) => {
    return c.json({ message: '515' });
  })
  .post('/fabric', zValidator('json', fabricRequestSchema), async (c) => {
    const { prompt } = c.req.valid('json');

    // 使用SSE进行流式响应
    return streamSSE(c, async (stream) => {
      // 发送初始状态
      await stream.writeSSE({
        data: JSON.stringify({ status: 'processing', message: '正在处理您的请求...' }),
        event: 'status',
      });

      // 构建提示词，指导Gemini生成符合Fabric.js 6版本格式的JSON配置
      const systemPrompt = `
        你是一个设计助手，请根据用户的描述生成符合Fabric.js格式的JSON配置，与项目中的对象格式保持一致。
        请${prompt}，每个对象必须包含type字段，指定对象类型。
        生成的对象符合${fabricObjectSchema}zod校验的
        
        注意：type字段必须使用以下值之一（注意大小写）：
        - 'Circle'（圆形）
        - 'Rect'（矩形）
        - 'Triangle'（三角形）
        - 'Polygon'（多边形，如钻石、五角星等）
        - 'Path'（路径）
        - 'Textbox'（文本框）
        
        根据对象类型，添加相应的必要属性：
        - Circle需要：radius, left, top, fill, stroke, strokeWidth
        - Rect需要：width, height, left, top, fill, stroke, strokeWidth, angle(可选), rx/ry(圆角矩形时需要)
        - Triangle需要：width, height, left, top, fill, stroke, strokeWidth
        - Polygon需要：points(坐标点数组), left, top, fill, stroke, strokeWidth
        - Textbox需要：text, left, top, fill, fontSize, fontFamily
        
        所有坐标和尺寸值应该是合理的数字。
        颜色值应该使用rgba格式，如'rgba(0,0,0,1)'或有效的CSS颜色格式（如"#FF0000"、"rgb(255,0,0)"或"red"）。
        
        以下是一些默认值参考：
        - FILL_COLOR = 'rgba(0,0,0,1)'
        - STROKE_COLOR = 'rgba(0,0,0,1)'
        - STROKE_WIDTH = 1
        - 默认位置：left: 100, top: 100
        - 默认尺寸：width: 200, height: 200, radius: 100
        - 默认字体：fontFamily: '宋体', fontSize: 32
        
        请确保输出是有效的JSON格式，并且只输出JSON，不要有其他解释文字。
        输出格式应该是：{"objects": [...对象数组...], "background": "背景颜色(可选)", "version": "6.0.0"}
        
        示例对象：
        1. 圆形：
        {
          "type": "Circle",
          "radius": 100,
          "left": 100,
          "top": 100,
          "fill": "rgba(0,0,0,1)",
          "stroke": "rgba(0,0,0,1)",
          "strokeWidth": 1
        }
        
        2. 矩形：
        {
          "type": "Rect",
          "width": 200,
          "height": 200,
          "left": 100,
          "top": 100,
          "fill": "rgba(0,0,0,1)",
          "stroke": "rgba(0,0,0,1)",
          "strokeWidth": 1
        }
        
        3. 文本框：
        {
          "type": "Textbox",
          "text": "示例文本",
          "left": 100,
          "top": 100,
          "fill": "rgba(0,0,0,1)",
          "fontSize": 32,
          "fontFamily": "宋体"
        }
      `;

      // 设置结构化输出格式
      const generationConfig = {
        temperature: 0.7,
        topP: 0.8,
        topK: 40,
        maxOutputTokens: 2048,
        responseMimeType: 'application/json',
      };

      // 发送请求到Gemini
      const [genError, result] = await to(
        model.generateContentStream({
          contents: [
            { role: 'user', parts: [{ text: systemPrompt }] },
            { role: 'user', parts: [{ text: prompt }] },
          ],
          generationConfig,
        }),
      );

      if (genError) {
        console.error('Gemini API错误:', genError);
        await stream.writeSSE({
          data: JSON.stringify({ objects: [], error: 'API调用失败', status: 'error' }),
          event: 'error',
        });
        return;
      }

      // 发送状态更新
      await stream.writeSSE({
        data: JSON.stringify({ status: 'generating', message: 'AI正在生成对象...' }),
        event: 'status',
      });

      let buffer = '';

      // 处理流式响应
      for await (const chunk of result.stream) {
        const chunkText = chunk.text();
        if (chunkText) {
          buffer += chunkText;

          // 尝试解析完整的JSON对象
          // 清理可能的非JSON内容
          let cleanedBuffer = buffer;
          // 如果包含```json和```，提取中间的内容
          if (buffer.includes('```json') && buffer.includes('```')) {
            cleanedBuffer = buffer.split('```json')[1].split('```')[0].trim();
          }

          // 尝试解析为JSON
          const [parseError, parsedData] = await to(
            Promise.resolve().then(() => JSON.parse(cleanedBuffer)),
          );

          if (!parseError && parsedData) {
            // 验证数据结构
            const validationResult = fabricResponseSchema.safeParse(parsedData);

            if (validationResult.success) {
              // 添加版本信息（如果没有）
              if (!validationResult.data.version) {
                validationResult.data.version = '6.0.0';
              }

              // 发送有效的JSON数据
              await stream.writeSSE({
                data: JSON.stringify(validationResult.data),
                event: 'result',
              });

              // 发送进度更新
              await stream.writeSSE({
                data: JSON.stringify({
                  status: 'success',
                  message: `成功生成${validationResult.data.objects.length}个对象`,
                  objectCount: validationResult.data.objects.length,
                }),
                event: 'status',
              });

              buffer = ''; // 清空缓冲区
            }
          }
        }
      }

      // 如果还有未处理的数据，尝试最后一次解析
      if (buffer) {
        // 清理可能的非JSON内容
        let cleanedBuffer = buffer;
        if (buffer.includes('```json') && buffer.includes('```')) {
          cleanedBuffer = buffer.split('```json')[1].split('```')[0].trim();
        }

        const [parseError, parsedData] = await to(
          Promise.resolve().then(() => JSON.parse(cleanedBuffer)),
        );

        // 如果没错误和有数据
        if (!parseError && parsedData) {
          const validationResult = fabricResponseSchema.safeParse(parsedData);

          if (validationResult.success) {
            // 添加版本信息（如果没有）

            await stream.writeSSE({
              data: JSON.stringify(validationResult.data),
              event: 'result',
            });

            // 发送完成状态
            await stream.writeSSE({
              data: JSON.stringify({
                status: 'success',
                message: `成功生成${validationResult.data.objects.length}个对象`,
                objectCount: validationResult.data.objects.length,
              }),
              event: 'status',
            });
          } else {
            // 如果验证失败，返回一个默认响应
            await stream.writeSSE({
              data: JSON.stringify({
                objects: [],
                error: '无法生成有效的Fabric.js对象',
                status: 'error',
              }),
              event: 'error',
            });
          }
        } else {
          // 如果解析失败，返回一个默认响应
          await stream.writeSSE({
            data: JSON.stringify({
              objects: [],
              error: '无法解析Gemini响应',
              status: 'error',
            }),
            event: 'error',
          });
        }
      }

      // 发送完成事件
      await stream.writeSSE({
        data: JSON.stringify({ status: 'complete' }),
        event: 'complete',
      });
    });
  });

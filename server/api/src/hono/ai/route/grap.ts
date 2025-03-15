import { zValidator } from '@hono/zod-validator';
import to from 'await-to-js';
import { Hono } from 'hono';
import { streamSSE } from 'hono/streaming';
import { z } from 'zod';
import { model } from '../../../server/ai';

// 定义请求体验证模式
const mermaidRequestSchema = z.object({
  prompt: z.string().min(1),
  type: z
    .enum([
      'flowchart',
      'sequenceDiagram',
      'classDiagram',
      'stateDiagram',
      'entityRelationshipDiagram',
      'gantt',
    ])
    .optional(),
});

// 定义响应体验证模式
const mermaidResponseSchema = z.object({
  code: z.string(),
  type: z.string().optional(),
});

export const grap = new Hono()
  .get('/test', (c) => {
    return c.json({ message: '515' });
  })
  .post('/mermaid', zValidator('json', mermaidRequestSchema), async (c) => {
    const { prompt, type = 'flowchart' } = c.req.valid('json');

    // 使用SSE进行流式响应
    return streamSSE(c, async (stream) => {
      // 发送初始状态
      await stream.writeSSE({
        data: JSON.stringify({
          status: 'processing',
          message: '正在处理您的请求...',
        }),
        event: 'status',
      });

      // 构建提示词，指导Gemini生成符合Mermaid格式的配置
      const systemPrompt = `
你是一个智能图表决策引擎，请根据用户输入自动选择最匹配的Mermaid图表类型并生成全中文代码。

# 输入分析规则
1. 关键词扫描（支持中英文混合）：
   ${[
     { type: 'flowchart', keywords: ['流程', '步骤', '工序', '决策点', 'process', 'flow'] },
     {
       type: 'sequenceDiagram',
       keywords: ['时序', '消息', '请求响应', '交互顺序', 'sequence', 'message'],
     },
     {
       type: 'classDiagram',
       keywords: ['类图', '继承', '接口', '属性', '类关系', 'class', 'inheritance'],
     },
     {
       type: 'stateDiagram-v2',
       keywords: ['状态机', '状态转换', '生命周期', 'state', 'transition'],
     },
     {
       type: 'erDiagram',
       keywords: ['实体关系', '数据库设计', '表结构', 'ER模型', 'entity', 'relationship'],
     },
     { type: 'gantt', keywords: ['时间线', '项目计划', '甘特图', '进度表', 'timeline', 'gantt'] },
     { type: 'mindmap', keywords: ['思维导图', '脑图', '概念图', '知识图谱', 'mindmap'] },
     { type: 'pie', keywords: ['占比', '比例', '市场份额', '分布率', 'pie', 'percentage'] },
   ]
     .map((t) => `▸ ${t.type.padEnd(15)}: ${t.keywords.join('、')}`)
     .join('\n   ')}

2. 类型决策优先级：
   (用户指定类型) > (关键词匹配度) > (默认流程图)
   
   匹配度算法：
   关键词出现次数 × 类型权重系数：
   ${[
     ['gantt', 1.2], // 时间相关类型优先
     ['erDiagram', 0.9], // 技术型图表降权
   ]
     .map(([t, w]) => `▹ ${(t as string).padEnd(15)} 权重系数 ${w}`)
     .join('\n   ')}

# 代码生成规范
1. 智能布局策略：
   ${[
     '节点数>10 → 采用横向布局(flowchart LR)',
     '包含并行步骤 → 添加子图(subgraph)',
     '时间跨度>3月 → 甘特图分季度显示',
   ].join('\n   ')}

2. 中文渲染标准：
   ✅ 节点ID：拼音缩写（例：XSJL["销售记录"]）
   ✅ 连接描述：使用中文动词（例：-->|"提交"|）
   ✅ 节点样式：使用十六进制颜色码

3. 自适应增强：
   ${[
     "出现'用户'/'系统' → 自动添加actor角色",
     "包含'百分比' → 为饼图添加图例",
     '出现时间范围 → 自动计算甘特图时间段',
   ].join('\n   ')}
4. 样式配置要求：
   style 节点必须使用十六进制颜色码，中文颜色会自动转换：
   ✅ 正确示例：style A fill:#90EE90,stroke:#228B22 
   ❌ 错误示例：style A fill:#浅绿"
5. 输出格式：
   ❌ 注释：/* 样式配置 */
   ❌ 符号：不能出现中文标点

# 输出示例
输入："我们需要展示用户登录流程，包含密码验证和短信验证两种方式"
输出：
{
  "code": "flowchart TD\n    DL([登录入口]) --> YZ{验证方式}\n    YZ -->|密码验证| MMYZ[\"验证密码\"]\n    YZ -->|短信验证| DXYZ[\"发送验证码\"]\n    style DL fill:#浅蓝,stroke:#深蓝",
  "type": "flowchart",
  "logic": {
    "keywordMatches": ["流程", "验证"], 
    "weightScore": 8.7
  }
}

生成要求：
1. 必须输出标准Mermaid代码
2. 节点/连线必须使用中文标签
3. 自动添加合理布局指令
4. 包含样式优化
`.trim();

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
          data: JSON.stringify({
            code: '',
            error: 'API调用失败',
            status: 'error',
          }),
          event: 'error',
        });
        return;
      }

      // 发送状态更新
      await stream.writeSSE({
        data: JSON.stringify({
          status: 'generating',
          message: 'AI正在生成图表代码...',
        }),
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
            const validationResult = mermaidResponseSchema.safeParse(parsedData);

            if (validationResult.success) {
              // 发送有效的JSON数据
              await stream.writeSSE({
                data: JSON.stringify(validationResult.data),
                event: 'result',
              });

              // 发送进度更新
              await stream.writeSSE({
                data: JSON.stringify({
                  status: 'success',
                  message: '成功生成Mermaid图表代码',
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
        } else if (buffer.includes('```') && buffer.includes('```')) {
          // 处理可能没有指定json但使用了代码块的情况
          cleanedBuffer = buffer.split('```')[1].split('```')[0].trim();
          // 尝试将纯Mermaid代码转换为JSON格式
          if (!cleanedBuffer.startsWith('{')) {
            cleanedBuffer = JSON.stringify({ code: cleanedBuffer, type });
          }
        }

        const [parseError, parsedData] = await to(
          Promise.resolve().then(() => JSON.parse(cleanedBuffer)),
        );

        // 如果没错误和有数据
        if (!parseError && parsedData) {
          const validationResult = mermaidResponseSchema.safeParse(parsedData);

          if (validationResult.success) {
            await stream.writeSSE({
              data: JSON.stringify(validationResult.data),
              event: 'result',
            });

            // 发送完成状态
            await stream.writeSSE({
              data: JSON.stringify({
                status: 'success',
                message: '成功生成Mermaid图表代码',
              }),
              event: 'status',
            });
          } else {
            // 如果验证失败，返回一个默认响应
            await stream.writeSSE({
              data: JSON.stringify({
                code: '',
                error: '无法生成有效的Mermaid代码',
                status: 'error',
              }),
              event: 'error',
            });
          }
        } else {
          // 如果解析失败，尝试直接提取Mermaid代码
          const mermaidCodeMatch = buffer.match(/```(?:mermaid)?\s*([\s\S]*?)```/);
          if (mermaidCodeMatch?.[1]) {
            const mermaidCode = mermaidCodeMatch[1].trim();
            await stream.writeSSE({
              data: JSON.stringify({ code: mermaidCode, type }),
              event: 'result',
            });

            await stream.writeSSE({
              data: JSON.stringify({
                status: 'success',
                message: '成功生成Mermaid图表代码',
              }),
              event: 'status',
            });
          } else {
            // 如果无法提取，返回错误
            await stream.writeSSE({
              data: JSON.stringify({
                code: '',
                error: '无法解析Gemini响应',
                status: 'error',
              }),
              event: 'error',
            });
          }
        }
      }

      // 发送完成事件
      await stream.writeSSE({
        data: JSON.stringify({ status: 'complete' }),
        event: 'complete',
      });
    });
  });

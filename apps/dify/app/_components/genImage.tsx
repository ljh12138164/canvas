// 'use client';

// import { Button } from '@/components/ui/button';
// import { Textarea } from '@/components/ui/textarea';
// import { Bot, Download, Send } from 'lucide-react';
// import { nanoid } from 'nanoid';
// import { useEffect, useRef, useState } from 'react';
// import { useAiImage } from '../_hooks/useAi';

// // 图片生成参数
// interface ImageGenParams {
//   prompt: string;
//   negative_prompt?: string;
// }

// // 保存的图片记录
// interface ImageRecord {
//   id: string;
//   prompt: string;
//   negative_prompt?: string;
//   imageData: string;
//   mimeType: string;
//   timestamp: Date;
// }

// // 图片类型
// interface GeneratedImage {
//   mimeType: string;
//   data: string;
// }

// // API响应类型
// interface ApiResponse {
//   success: boolean;
//   images?: GeneratedImage[];
//   message?: string;
// }

// export default function GenImage() {
//   const [prompt, setPrompt] = useState('');
//   const [negativePrompt, setNegativePrompt] = useState('');
//   const [messages, setMessages] = useState<any[]>([]);
//   const [isLoading, setIsLoading] = useState(false);
//   const [generatedImages, setGeneratedImages] = useState<GeneratedImage[]>([]);
//   const [error, setError] = useState('');
//   const [savedImages, setSavedImages] = useState<ImageRecord[]>([]);
//   const messagesEndRef = useRef<HTMLDivElement>(null);
//   const { getAiImage, getAiImagePending } = useAiImage();

//   // 滚动到对话底部
//   useEffect(() => {
//     messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
//   }, [messages]);

//   // 保存生成的图片
//   const saveImage = (imageData: string, mimeType: string) => {
//     const imageRecord: ImageRecord = {
//       id: nanoid(),
//       prompt,
//       negative_prompt: negativePrompt || undefined,
//       imageData,
//       mimeType,
//       timestamp: new Date(),
//     };

//     setSavedImages((prev) => [...prev, imageRecord]);
//   };

//   // 下载图片
//   const downloadImage = (data: string, mimeType: string) => {
//     const link = document.createElement('a');
//     link.href = `data:${mimeType};base64,${data}`;
//     link.download = `ai-image-${Date.now()}.${mimeType.split('/')[1] || 'png'}`;
//     document.body.appendChild(link);
//     link.click();
//     document.body.removeChild(link);
//   };

//   // 发送生成图片请求
//   const handleGenerateImage = async () => {
//     if (!prompt.trim()) {
//       setError('请输入图片描述');
//       return;
//     }

//     setIsLoading(true);
//     setError('');

//     // 添加用户消息
//     const userMessage = {
//       id: Date.now().toString(),
//       role: 'user',
//       content: `生成图片: ${prompt}${negativePrompt ? `\n不要包含: ${negativePrompt}` : ''}`,
//       timestamp: new Date(),
//     };

//     setMessages((prev) => [...prev, userMessage]);

//     try {
//       // 调用API生成图片
//       getAiImage(
//         {
//           json: {
//             prompt,
//             negative_prompt: negativePrompt || undefined,
//           },
//         },
//         {
//           onSuccess: (response: ApiResponse) => {
//             if (response.success && response.images) {
//               // 添加AI响应消息
//               const aiMessage = {
//                 id: (Date.now() + 1).toString(),
//                 role: 'assistant',
//                 content: '我已根据您的描述生成图片。',
//                 timestamp: new Date(),
//               };

//               setMessages((prev) => [...prev, aiMessage]);
//               setGeneratedImages(response.images);
//             } else {
//               throw new Error(response.message || '生成图片失败');
//             }
//           },
//           onError: (error: Error) => {
//             console.error('生成图片失败:', error);
//             setError('生成图片失败，请稍后重试或修改提示词');

//             // 添加错误消息
//             const errorMessage = {
//               id: (Date.now() + 1).toString(),
//               role: 'assistant',
//               content: `抱歉，生成图片时出现错误: ${
//                 error instanceof Error ? error.message : '未知错误'
//               }`,
//               timestamp: new Date(),
//             };

//             setMessages((prev) => [...prev, errorMessage]);
//           },
//           onSettled: () => {
//             setIsLoading(false);
//           },
//         },
//       );
//     } catch (error) {
//       console.error('Error:', error);
//       setIsLoading(false);
//       setError('请求失败，请稍后重试');
//     }
//   };

//   // 清空聊天记录
//   const clearMessages = () => {
//     setMessages([]);
//     setGeneratedImages([]);
//   };

//   return (
//     <div className="container mx-auto p-6 max-w-7xl">
//       <div className="flex flex-col md:flex-row gap-6">
//         {/* 左侧面板：输入区域和聊天历史 */}
//         <div className="w-full md:w-1/2 space-y-6">
//           {messages.length > 0 && (
//             <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 transition-all hover:shadow-xl">
//               <div className="flex justify-between items-center mb-3">
//                 <h3 className="text-base font-medium">聊天历史</h3>
//                 <Button variant="outline" size="sm" onClick={clearMessages} className="text-xs">
//                   清空聊天
//                 </Button>
//               </div>
//               <div className="space-y-3 max-h-[calc(100vh-400px)] overflow-y-auto custom-scrollbar">
//                 {messages.map((msg) => (
//                   <div
//                     key={msg.id}
//                     className="grid grid-cols-[40px_1fr] items-start gap-2 p-2 rounded-lg animate-fadeIn"
//                   >
//                     {msg.role === 'user' ? (
//                       <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-gray-900 flex items-center justify-center">
//                         <span className="text-blue-600 text-sm">用户</span>
//                       </div>
//                     ) : (
//                       <Bot className="w-8 h-8 p-1 rounded-full bg-green-100 dark:bg-gray-900 text-green-600" />
//                     )}
//                     <div>{msg.content}</div>
//                   </div>
//                 ))}
//                 {isLoading && (
//                   <div className="text-center mt-2 flex items-center justify-center gap-2">
//                     <div className="animate-pulse h-2 w-2 rounded-full bg-primary" />
//                     <div
//                       className="animate-pulse h-2 w-2 rounded-full bg-primary"
//                       style={{ animationDelay: '0.2s' }}
//                     />
//                     <div
//                       className="animate-pulse h-2 w-2 rounded-full bg-primary"
//                       style={{ animationDelay: '0.4s' }}
//                     />
//                     <span className="text-sm text-muted-foreground ml-1">AI正在绘制图片...</span>
//                   </div>
//                 )}
//                 <div ref={messagesEndRef} />
//               </div>
//             </div>
//           )}

//           <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 transition-all hover:shadow-xl">
//             <h3 className="text-base font-medium mb-3">图片生成</h3>
//             <div className="space-y-4">
//               <div>
//                 <p className="text-sm text-gray-500 mb-1">正面提示词 (描述你想要的图片)</p>
//                 <Textarea
//                   value={prompt}
//                   onChange={(e) => setPrompt(e.target.value)}
//                   placeholder="例如：一只可爱的猫咪，在阳光明媚的花园里玩耍，高清照片风格"
//                   className="w-full p-2 border-2 border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all resize-none"
//                   disabled={isLoading}
//                   rows={3}
//                 />
//               </div>
//               <div>
//                 <p className="text-sm text-gray-500 mb-1">负面提示词 (描述你不想要的元素)</p>
//                 <Textarea
//                   value={negativePrompt}
//                   onChange={(e) => setNegativePrompt(e.target.value)}
//                   placeholder="例如：模糊，扭曲，低质量，变形"
//                   className="w-full p-2 border-2 border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all resize-none"
//                   disabled={isLoading}
//                   rows={2}
//                 />
//               </div>
//               <Button
//                 onClick={handleGenerateImage}
//                 disabled={isLoading || !prompt.trim()}
//                 className="w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:bg-gray-400"
//               >
//                 {isLoading ? (
//                   <div className="h-4 w-4 animate-spin rounded-full border-2 border-t-transparent border-white" />
//                 ) : (
//                   <span className="flex items-center gap-2">
//                     <Send className="h-4 w-4" />
//                     生成图片
//                   </span>
//                 )}
//               </Button>
//             </div>

//             {error && <div className="text-red-500 mt-2">{error}</div>}
//           </div>
//         </div>

//         {/* 右侧面板：图片显示区域 */}
//         <div className="w-full md:w-1/2">
//           <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 transition-all hover:shadow-xl sticky top-6 min-h-[400px] max-h-[calc(100vh-200px)] overflow-auto">
//             <h3 className="text-base font-medium mb-4">生成的图片</h3>
//             {generatedImages.length > 0 ? (
//               <div className="grid grid-cols-1 gap-4">
//                 {generatedImages.map((img, index) => (
//                   <div key={`image-${index}-${Date.now()}`} className="relative group">
//                     <img
//                       src={`data:${img.mimeType};base64,${img.data}`}
//                       alt={`生成的图片 ${index + 1}`}
//                       className="w-full rounded-lg shadow-md"
//                     />
//                     <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
//                       <Button
//                         onClick={() => downloadImage(img.data, img.mimeType)}
//                         className="bg-gray-800 bg-opacity-70 hover:bg-opacity-100"
//                         size="sm"
//                       >
//                         <Download className="h-4 w-4" />
//                       </Button>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             ) : (
//               <div className="flex flex-col items-center justify-center h-64 text-gray-500">
//                 <p>生成的图片将显示在这里</p>
//                 <p className="text-sm mt-2">输入描述并点击生成按钮开始创作</p>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

const GenImage = () => {
  return <div>GenImage</div>;
};

export default GenImage;

// import { useEffect, useRef } from 'react';
// import * as React from 'react';
// import * as ReactDOM from 'react-dom';
// // import * as antd from 'antd';
// // import * as icons from '@ant-design/icons';

// interface CodeRunnerProps {
//   code: string;
//   onError: (error: string) => void;
// }

// const CodeRunner: React.FC<CodeRunnerProps> = ({ code, onError }) => {
//   const containerRef = useRef<HTMLDivElement>(null);
//   const rootRef = useRef<any>(null);

//   useEffect(() => {
//     if (!containerRef.current) return;

//     // 清除之前的内容
//     if (rootRef.current) {
//       rootRef.current.unmount();
//       rootRef.current = null;
//     }

//     try {
//       // 创建一个新的root
//       const root = createRoot(containerRef.current);
//       rootRef.current = root;

//       // 准备执行环境
//       const executeCode = new Function(
//         'React',
//         'ReactDOM',
//         'antd',
//         'icons',
//         'root',
//         'useState',
//         'useEffect',
//         'useRef',
//         'useCallback',
//         'useMemo',
//         'useContext',
//         `
//         try {
//           ${code}
//         } catch (error) {
//           throw error;
//         }
//         `,
//       );

//       // 执行代码
//       executeCode(
//         React,
//         ReactDOM,
//         antd,
//         icons,
//         root,
//         React.useState,
//         React.useEffect,
//         React.useRef,
//         React.useCallback,
//         React.useMemo,
//         React.useContext,
//       );

//       // 清除错误
//       onError('');
//     } catch (error) {
//       console.error('代码执行错误:', error);
//       onError(error instanceof Error ? error.message : '代码执行时出错');

//       // 显示错误信息
//       if (rootRef.current) {
//         rootRef.current.render(
//           <div className="p-4 bg-red-50 text-red-700 rounded">
//             <h3 className="font-bold">执行错误</h3>
//             <pre className="mt-2 text-sm overflow-auto">
//               {error instanceof Error ? error.message : String(error)}
//             </pre>
//           </div>,
//         );
//       }
//     }

//     return () => {
//       if (rootRef.current) {
//         rootRef.current.unmount();
//         rootRef.current = null;
//       }
//     };
//   }, [code, onError]);

//   return <div ref={containerRef} className="w-full h-full p-4" />;
// };

// export default CodeRunner;

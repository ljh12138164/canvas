// 修改 ui 的导入方式
import * as uiComponents from '@/components/ui';
import { type ClassValue, clsx } from 'clsx';
import React from 'react';
import * as rechart from 'recharts';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
// 创建组件映射表，确保正确展开对象
const componentMap = {
  ...React,
  ...rechart,
};
// ... existing code ...

// 获取所有组件的函数
export function getShadcnUiComponent(componentName: string) {
  return componentMap[componentName as keyof typeof componentMap] || null;
}

// 获取所有组件的 scope 对象
//{ name:code}
export function getShadcnUiScope() {
  return { ...componentMap, ...uiComponents };
}

/**
 * ### 返回导入的数据
 */
// export function getImport(score: Record<string, React.ReactNode>) {
//   const arr = Object.entries(score);
//   return arr
//     .map((item) => {
//       const componentName = item[0];
//       const component = item[1];

//       // 如果是函数组件，转换为字符串
//       if (typeof component === 'function') {
//         return `const ${componentName} = ${component};`;
//       }

//       // 如果是对象（可能是包含多个组件的模块）
//       if (typeof component === 'object' && component !== null) {
//         const componentStrings = Object.entries(component)
//           .map(([key, value]) => {
//             if (typeof value === 'function') {
//               return `${key}: ${value.toString()}`;
//             }
//             return null;
//           })
//           .filter(Boolean)
//           .join(',\n');

//         return `const ${componentName} = { ${componentStrings} };`;
//       }

//       return null;
//     })
//     .filter(Boolean);
// }

// /**
//  * ### 自定义组件
//  */
// export function getCustomScope(
//   score: Record<string, any>,
//   code: string,
//   ...props: any[]
// ): Promise<React.ReactElement> {
//   return new Promise((resolve, rejected) => {
//     try {
//       const DynamicComponent = () => {
//         const result = transformCode(code);
//         // console.log(result.replace(/"use strict";/g, ''));
//         const ComponentCreator = new Function(
//           'React',
//           'scope',
//           'props',
//           `
//           "use strict";  // 只保留一个
//           return function DynamicInnerComponent(props) {
//            const {${Object.keys(React).join(', ')}}=React;
//            const {${Object.keys(score).join(', ')}}=scope;
//               ${result.replace(/"use strict";/g, '')}  // 移除结果中的 use strict
//             }
//             `,
//         );
//         return ComponentCreator(React, score, props)(props);
//       };
//       resolve(DynamicComponent as unknown as React.ReactElement);
//     } catch (error) {
//       rejected(error);
//     }
//   });
// }

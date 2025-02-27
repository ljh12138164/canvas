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

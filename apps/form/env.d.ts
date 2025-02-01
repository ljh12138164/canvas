/// <reference types="vite/client" />
declare module '@iconify/vue' {
  // 在这里定义你需要的类型
  export const Icon: any;
}

declare module '*.vue' {
  import type { DefineComponent } from 'vue';
  const component: DefineComponent<{}, {}, any>;
  export default component;
}

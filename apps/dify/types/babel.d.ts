declare module '@babel/standalone' {
  export function transform(
    code: string,
    options: {
      presets?: string[];
      plugins?: string[];
      [key: string]: any;
    },
  ): {
    code: string;
    map: any;
    ast: any;
  };
}

// 为全局对象添加类型
interface Window {
  antd: any;
  icons: any;
  _: any;
  dayjs: any;
}

import { defineConfig } from 'tsup';

export default defineConfig({
  // 修改入口文件为根目录的 index.ts
  entry: ['index.ts'],

  // 只输出 ESM 格式
  format: ['esm'],

  // 生成 .mjs 文件
  target: 'esnext',

  // 清理输出目录
  clean: true,

  // 生成 sourcemap
  sourcemap: true,

  // 生成 d.ts 文件
  dts: true,
  // 打包时复制 shebang
});

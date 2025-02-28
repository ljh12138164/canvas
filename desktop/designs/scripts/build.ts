import { execSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

// 路径配置
const NEXT_APP_PATH = path.resolve(__dirname, '../../apps/ljh-design');
const NEXT_OUT_PATH = path.resolve(NEXT_APP_PATH, 'out');
const TAURI_DIST_PATH = path.resolve(__dirname, '../dist');

// 确保目录存在
if (!fs.existsSync(TAURI_DIST_PATH)) {
  fs.mkdirSync(TAURI_DIST_PATH, { recursive: true });
}

// 构建Next.js应用
execSync('pnpm build', { cwd: NEXT_APP_PATH, stdio: 'inherit' });

// 复制Next.js构建输出到Tauri的dist目录
execSync(`cp -r ${NEXT_OUT_PATH}/* ${TAURI_DIST_PATH}/`);

// 构建Tauri应用
execSync('pnpm tauri build', { cwd: path.resolve(__dirname, '..'), stdio: 'inherit' });

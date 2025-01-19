import { EnvConfig } from "./index";
import * as fs from "fs";
import * as path from "path";

// 生成环境变量文件
export function generateEnvFiles(config: EnvConfig) {
  // 生成应用端.env文件
  const appEnvContent = Object.entries(config.app)
    .map(([key, value]) => `${key}=${value}`)
    .join("\n");

  // 生成服务端.env文件
  const serverEnvContent = Object.entries(config.server)
    .map(([key, value]) => `${key}=${value}`)
    .join("\n");

  // 写入应用端.env
  fs.writeFileSync(
    path.join(process.cwd(), "apps/ljh-design/.env"),
    appEnvContent
  );

  // 写入服务端.env
  fs.writeFileSync(
    path.join(process.cwd(), "server/api/.env"),
    serverEnvContent
  );
}

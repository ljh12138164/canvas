import { EnvConfig } from "./index";

// 验证环境变量配置
export function validateEnvConfig(config: Partial<EnvConfig>): string[] {
  const errors: string[] = [];

  // 验证app配置
  if (!config.app) {
    errors.push("缺少app配置");
  } else {
    if (!config.app.API_URL) errors.push("缺少 API_URL 配置");
    if (!config.app.AUTH_SECRET) errors.push("缺少 AUTH_SECRET 配置");
    // ... 其他app配置验证
  }

  // 验证server配置
  if (!config.server) {
    errors.push("缺少server配置");
  } else {
    if (!config.server.SUPABASE_URL) errors.push("缺少 SUPABASE_URL 配置");
    if (!config.server.SUPABASE_KEY) errors.push("缺少 SUPABASE_KEY 配置");
    // ... 其他server配置验证
  }

  return errors;
}

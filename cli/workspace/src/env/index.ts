// 环境变量配置
export interface EnvConfig {
  // 应用配置
  app: {
    // API基础URL
    API_URL: string;
    // 认证相关
    AUTH_SECRET: string;
    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: string;
    CLERK_SECRET_KEY: string;
    // 数据库
    DATABASE_URL: string;
    // 存储相关
    STORAGE_ACCOUNT: string;
    STORAGE_ACCOUNT_KEY: string;
    // AI相关
    OPENAI_API_KEY: string;
    GOOGLE_API_KEY: string;
  };
  // 服务端配置
  server: {
    // 数据库
    SUPABASE_URL: string;
    SUPABASE_KEY: string;
    SUPABASE_DESIGN_JWT: string;
    SUPABASE_FORM_JWT: string;
    // 存储
    R2_ACCESS_KEY_ID: string;
    R2_SECRET_ACCESS_KEY: string;
    R2_ACCOUNT_ID: string;
    // 邮件
    RESEND_API_KEY: string;
    // AI
    ZHIPU_API_KEY: string;
  };
}

// 默认配置
export const defaultConfig: EnvConfig = {
  app: {
    API_URL: "http://localhost:3000",
    AUTH_SECRET: "",
    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: "",
    CLERK_SECRET_KEY: "",
    DATABASE_URL: "",
    STORAGE_ACCOUNT: "",
    STORAGE_ACCOUNT_KEY: "",
    OPENAI_API_KEY: "",
    GOOGLE_API_KEY: "",
  },
  server: {
    SUPABASE_URL: "",
    SUPABASE_KEY: "",
    SUPABASE_DESIGN_JWT: "",
    SUPABASE_FORM_JWT: "",
    R2_ACCESS_KEY_ID: "",
    R2_SECRET_ACCESS_KEY: "",
    R2_ACCOUNT_ID: "",
    RESEND_API_KEY: "",
    ZHIPU_API_KEY: "",
  },
};

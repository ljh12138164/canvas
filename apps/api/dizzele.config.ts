import { config } from "dotenv";
import { defineConfig, Config } from "drizzle-kit";

config({ path: ".env" });

/**
 * 读取环境变量判断开发环境
 * @returns
 */
function checkDataBase(): Config | undefined {
  const JEBT = process.env.DATABASE_JEBT_URL;
  const DESIGN = process.env.DcheckDataBaseATABASE_DESIGN_URL;
  const NOTE = process.env.DATABASE_NOTE_URL;
  if (JEBT)
    return {
      schema: "./src/db/jebt/schema.ts",
      out: "./supabase/JEBT/migrations",
      dialect: "postgresql",
      dbCredentials: {
        url: process.env.DATABASE_JEBT_URL!,
      },
    };
  if (DESIGN)
    return {
      schema: "./src/db/design/schema.ts",
      out: "./supabase/DESIGN/migrations",
      dialect: "postgresql",
      dbCredentials: {
        url: process.env.DATABASE_DESIGN_URL!,
      },
    };
  if (NOTE)
    return {
      schema: "./src/db/note/schema.ts",
      out: "./supabase/NOTE/migrations",
      dialect: "postgresql",
      dbCredentials: {
        url: process.env.DATABASE_NOTE_URL!,
      },
    };
}

const configs = checkDataBase();
if (!configs) throw new Error("启动失败");

export default defineConfig(configs);

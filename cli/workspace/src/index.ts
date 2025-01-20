#!/usr/bin/env node

import { Command } from "commander";
import chalk from "chalk";
import { defaultConfig } from "./env";
import { validateEnvConfig } from "./env/validate";
import { generateEnvFiles } from "./env/generate";

const program = new Command();

program.name("jebet").description("Jebet CLI tools").version("0.0.1");

program
  .command("init")
  .description("初始化项目")
  .action(async () => {
    console.log(chalk.blue("🚀 Initializing new Jebet project..."));
    console.log(chalk.green("✅ 初始化完成!"));
  });

program
  .command("env")
  .description("管理环境变量")
  .option("-g, --generate", "生成环境变量文件")
  .option("-v, --validate", "验证环境变量配置")
  .action(async (options) => {
    if (options.generate) {
      console.log(chalk.blue("📝 生成环境变量文件..."));
      generateEnvFiles(defaultConfig);
      console.log(chalk.green("✅ 环境变量文件生成完成!"));
    }

    if (options.validate) {
      console.log(chalk.blue("🔍 验证环境变量配置..."));
      const errors = validateEnvConfig(defaultConfig);
      if (errors.length > 0) {
        console.log(chalk.red("❌ 发现以下错误:"));
        errors.forEach((err) => console.log(chalk.red(`  - ${err}`)));
      } else {
        console.log(chalk.green("✅ 环境变量配置验证通过!"));
      }
    }
  });

program.parse();

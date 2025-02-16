#!/usr/bin/env node

import { Command } from 'commander';
import { defaultConfig } from './src/env';
import { generateEnvFiles } from './src/env/generate';
import { validateEnvConfig } from './src/env/validate';

const program = new Command();

program.name('jebet').description('Jebet CLI tools').version('0.0.1');

program
  .command('init')
  .description('初始化项目')
  .action(async () => {});

program
  .command('env')
  .description('管理环境变量')
  .option('-g, --generate', '生成环境变量文件')
  .option('-v, --validate', '验证环境变量配置')
  .action(async (options) => {
    if (options.generate) {
      generateEnvFiles(defaultConfig);
    }

    if (options.validate) {
      const errors = validateEnvConfig(defaultConfig);
      if (errors.length > 0) {
        console.error(errors);
      }
    }
  });

program.parse();

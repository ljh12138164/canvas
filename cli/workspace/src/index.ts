#!/usr/bin/env node

import chalk from 'chalk';
import { Command } from 'commander';
import { defaultConfig } from './env';
import { generateEnvFiles } from './env/generate';
import { validateEnvConfig } from './env/validate';

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
        errors.forEach((err) => console.error(err));
      }
      // console.log(chalk.green('环境变量配置正确'));
    }
  });

program.parse();

#!/usr/bin/env node

import * as yargs from 'yargs';
import 'reflect-metadata';

yargs
  .usage('$0 <cmd> [args]')
  .commandDir('./commands', { extensions: ['js', 'ts'], exclude: /.d.ts$/ })
  .version()
  .help().parse();

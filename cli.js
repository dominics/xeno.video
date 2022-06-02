#!/usr/bin/env node

/*
 Entrypoint for the command line application

 Supports clean, prewarm
 */

const fs = require('fs');
const path = require('path');

if (!fs.existsSync(path.join(__dirname, 'dist'))) {
  throw new Error('You must run the server-side transpile build first (usually, gulp build)');
}

const config = require('./dist/config')();
const debug = require('debug'); // This must be the first use of 'debug' (after config is loaded)
debug('xeno:main')('Starting xeno.video CLI interface');

const deps = require('./dist/deps').default(config);
const container = deps.container;

const argv = container.cli.argv;
const logSettings = container.cli.logSettings;
const log = container.cli.log;

if (!argv._[0]) {
  log.error('You must specify a subcommand (use --help for more information)', argv);
  process.exit(1);
}

if (container.command && container.command[argv._[0]]) {
  const execute = container.command[argv._[0]];

  execute().then(() => {
    log.notice('All done!');
    process.exit(0);
  }).catch(err => {
    if (typeof err === 'string') {
      log.error(err);
    } else if (err instanceof Error) {
      log.error(err.message);
      log.debug(err);
    } else {
      log.error(err);
      throw err;
    }
    process.exit(2);
  }).finally(() => {
    log.info('Shutting down container');
    container.shutdown();
  });
} else {
  log.error('No such command', argv);
  process.exit(1);
}

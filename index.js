#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

if (!fs.existsSync(path.join(__dirname, 'dist'))) {
  throw new Error('You must run the server-side transpile build first (usually, gulp build)');
}

const deps = require('./dist/deps')();
const container = deps.container;

const config = container.config;
const debug = require('debug'); // This must be the first use of 'debug' (after config is loaded)
debug('xeno:main')('Starting xeno.video');

const emitter = container.emitter;
emitter.emit('Hello!');

const server = container.server;
server.listen(container.config.PORT);

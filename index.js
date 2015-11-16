#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

if (!fs.existsSync(path.join(__dirname, 'dist'))) {
  throw new Error('You must run the server-side transpile build first (usually, gulp build)');
}

const deps = require('./dist/deps');

const container = deps().container;

const server = container.server;
const config = container.config;

server.listen(config.PORT);


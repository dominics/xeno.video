#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

if (!fs.existsSync(path.join(__dirname, 'dist'))) {
  throw new Error('You must run the server-side transpile build first (usually, gulp build)');
}

const deps = require('./dist/deps');

deps.digest(['config']);

const container = deps.container;

const config = container.config;

const app = container.app;
app.use('/', container.router.root);

const server = container.server;
server.listen(config.PORT);


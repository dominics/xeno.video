const fs = require('fs');
const path = require('path');
const _ = require('lodash');

module.exports = function loadConfiguration(additionalSearchPath) {
  // Save, because actual env vars win the merge
  const previous = _.cloneDeep(process.env);

  const configPaths = [
    '/etc/xeno/env',
    path.join(__dirname, '/../.env'),
  ];

  if (additionalSearchPath) {
    configPaths.push(additionalSearchPath);
  }

  configPaths.forEach(function requirePath(configPath) {
    if (fs.existsSync(configPath)) {
      require('node-env-file')(configPath);
    }
  });

  process.env = Object.assign({}, process.env, previous);

  function requiredParameter(param) {
    if (!process.env[param]) {
      throw new Error('You must define ' + param + ' as an environment variable, or in .env');
    }
  }

  [
    'NODE_ENV',
    'HOST',
    'PORT',
    'SESSION_SECRET',
    'REDDIT_CONSUMER_KEY',
    'REDDIT_CONSUMER_SECRET',
    'REDIS_PORT',
    'REDIS_HOST',
  ].forEach(requiredParameter);
};

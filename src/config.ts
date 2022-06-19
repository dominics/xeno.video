/**
 * This is the runtime configuration
 *
 * Don't include the debug library until the config files have had a change to define
 * DEBUG, DEBUG_COLORS, etc.
 */

import fs from 'fs'
import path from 'path'
import _ from 'lodash'
import envFile from 'node-env-file'

interface Config {
  NODE_ENV: boolean
  HOST: boolean
  PORT: boolean
  SESSION_SECRET: boolean
  REDDIT_CONSUMER_KEY: boolean
  REDDIT_CONSUMER_SECRET: boolean
  REDDIT_OAUTH_SCOPE: boolean
  REDDIT_DEFAULT_REFRESH_TOKEN: boolean
  REDIS_PORT: boolean
  REDIS_HOST: boolean
  DEBUG: boolean
  GOOGLE_ANALYTICS_ID: boolean
  LOG_FILE: boolean
}

/**
 * true for required, false for not required
 */
const schema: Config = {
  NODE_ENV: true,
  HOST: true,
  PORT: true,
  SESSION_SECRET: true,
  REDDIT_CONSUMER_KEY: true,
  REDDIT_CONSUMER_SECRET: true,
  REDDIT_OAUTH_SCOPE: true,
  REDDIT_DEFAULT_REFRESH_TOKEN: false,
  REDIS_PORT: true,
  REDIS_HOST: true,
  DEBUG: false,
  GOOGLE_ANALYTICS_ID: false,
  LOG_FILE: false,
};

function filter(settings) {
  return _.pick(settings, (v, k) => typeof schema[k] !== "undefined");
}

function getMergedConfig(): Config {
  const actual = filter(process.env);
  process.env = {};

  const configPaths = [
    "/etc/xeno/env",
    path.join(__dirname, "/../.env"),
    path.join(__dirname, "/../.env.dist"),
  ];

  configPaths.forEach((configPath) => {
    if (fs.existsSync(configPath)) {
      envFile(configPath);
    }
  });

  return Object.assign(process.env, actual) as Config;
}

function requiredParameter(param) {
  if (!process.env[param]) {
    throw new Error(
      `You must define ${  param  } as an environment variable, or in .env`
    );
  }
}

function normalizePort(val) {
  const port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}

export function getConfig(): Config {
  const config: Config = getMergedConfig();

  // Validate required parameter (TODO: move to Joi)
  Object.keys(_.pick(schema, (v) => v)).forEach(requiredParameter);

  config.PORT = normalizePort(config.PORT);

  process.env = config;
  return config;
};

export default getConfig;

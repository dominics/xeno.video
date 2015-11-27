const session = require('express-session');
const RedisStore = require('connect-redis')(session);

import libdebug from 'debug';
const debug = libdebug('xeno:session:session');

const SESSION_TTL =  7 * 24 * 60 * 60;

export default (config, redis) => {
  return session({
    name: 'xeno',
    secret: config.SESSION_SECRET,
    resave: false, // if true, saves unaltered sessions, possibly causing race conditions
    saveUninitialized: false,
    cookie: {
      maxAge: SESSION_TTL,
    },
    store: new RedisStore({
      client: redis,
      prefix: 'xeno/session:',
      ttl: SESSION_TTL,
    }),
  });
};

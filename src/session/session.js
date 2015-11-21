const session = require('express-session');
const RedisStore = require('connect-redis')(session);

import libdebug from 'debug';
const debug = libdebug('xeno:session:session');

export default (config, redis) => {
  return session({
    name: 'xeno',
    secret: config.SESSION_SECRET,
    resave: false, // if true, saves unaltered sessions, possibly causing race conditions
    saveUninitialized: false,
    store: new RedisStore({
      client: redis,
    }),
  });
};

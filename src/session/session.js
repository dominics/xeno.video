const session = require('express-session');

import libdebug from 'debug';
const debug = libdebug('xeno:session:session');

const SESSION_COOKIE_TTL =  7 * 24 * 60 * 60;

export default (config, store) => {
  return session({
    name: 'xeno',
    secret: config.SESSION_SECRET,
    resave: false, // if true, saves unaltered sessions, possibly causing race conditions
    saveUninitialized: false,
    cookie: {
      maxAge: SESSION_COOKIE_TTL * 1000,
    },
    store,
  });
};

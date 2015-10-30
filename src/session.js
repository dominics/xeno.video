const session        = require('express-session');
const RedisStore     = require('connect-redis')(session);
const RedditStrategy = require('passport-reddit').Strategy;
const passport       = require('passport');
import libdebug from 'debug';
import _ from 'lodash';
const debug          = libdebug('xeno:session');

export default function(app, io, redis) {
  passport.serializeUser((user, done) => {
    done(null, user);
  });

  passport.deserializeUser((obj, done) => {
    done(null, obj);
  });

  passport.use(new RedditStrategy({
    clientID:     process.env.REDDIT_CONSUMER_KEY,
    clientSecret: process.env.REDDIT_CONSUMER_SECRET,
    callbackURL:  process.env.HOST + '/callback',
    scope:        'read,vote',
  }, (accessToken, refreshToken, profile, done) => {
    const data = {
      accessToken:   accessToken,
      refreshToken:  refreshToken,
      authenticated: Date.now() / 1000,
      reddit:        profile,
    };

    process.nextTick(() => {
      return done(null, data);
    });
  }));

  const sessionInstance = session({
    name:              'xeno',
    secret:            process.env.SESSION_SECRET,
    resave:            false, // if true, saves unaltered sessions, possibly causing race conditions
    saveUninitialized: false,
    store:             new RedisStore({
      client: redis,
    }),
  });

  app.use(sessionInstance);
  app.use(passport.initialize());
  app.use(passport.session());

  io.use((socket, next) => {
    sessionInstance(socket.request, socket.request.res, next);
  });

  io.on('connection', (socket) => {
    if (!_.get(socket, 'request.session.passport.user.id', false)) {
      debug('Unauthenticated Socket.io client has been disconnected');
      socket.disconnect();
      return;
    }
  });

  return passport;
}

function authFail(req, res, next, reason) {
  debug('Failed session validation!', reason);
  req.logout();
  res.redirect('/login');
  res.end();
}

/**
 * @todo Refresh tokens
 */
function authRefresh(req, res, next, reason) {
  debug('Refresh tokens not implemented', reason);
  return authFail(req, res);
}

export function auth(req, res, next) {
  if (!req.isAuthenticated()) {
    return res.redirect('/login');
  }

  const accessToken = _.get(req, 'session.passport.user.accessToken', null);
  const refreshToken = _.get(req, 'session.passport.user.accessToken', null);
  const authenticated = _.get(req, 'session.passport.user.authenticated', null);
  const age = (Date.now() / 1000) - authenticated;

  if (!accessToken) {
    if (refreshToken) {
      return authRefresh(req, res, next, 'No access token, refreshing to get one');
    }

    return authFail(req, res, next, 'No access token, and no refresh token to get one');
  }

  debug('Session age', age);

  if (age > 50 * 60 && refreshToken) {
    return authRefresh(req, res, next, 'Access token almost expired, attempt to refresh');
  }

  if (age > 60 * 60) {
    return authFail(req, res, next, 'Access token expired, cannot refresh');
  }

  debug('Passed session validation!');

  return next();
}

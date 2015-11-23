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

export function validate(req) {
  if (!req.isAuthenticated()) {
    return 'fail.auth';
  }

  const accessToken = _.get(req, 'session.passport.user.accessToken', null);
  const refreshToken = _.get(req, 'session.passport.user.accessToken', null);
  const authenticated = _.get(req, 'session.passport.user.authenticated', null);
  const age = (Date.now() / 1000) - authenticated;

  if (!accessToken) {
    if (refreshToken) {
      return 'refresh.first';
    }
    return 'fail.access_token';
  }

  if (age > 50 * 60 && refreshToken) {
    return 'refresh.proactive';
  }

  if (age > 60 * 60) {
    return 'fail.session_age';
  }

  return 'pass';
}

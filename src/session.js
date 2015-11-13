const session        = require('express-session');
const RedisStore     = require('connect-redis')(session);
const RedditStrategy = require('passport-reddit').Strategy;
const passport       = require('passport');
const _              = require('lodash');
const debug          = libdebug('xeno:session');

export default (app, io, redis) => {
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

    debug(data);

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
};

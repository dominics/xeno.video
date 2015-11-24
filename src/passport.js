const RedditStrategy = require('passport-reddit').Strategy;
const passport       = require('passport');
import libdebug from 'debug';
const debug = libdebug('xeno:session:passport');

export default function(config) {
  passport.serializeUser((user, done) => {
    done(null, user);
  });

  passport.deserializeUser((obj, done) => {
    done(null, obj);
  });

  passport.use(new RedditStrategy({
    clientID:     config.REDDIT_CONSUMER_KEY,
    clientSecret: config.REDDIT_CONSUMER_SECRET,
    callbackURL:  config.HOST + '/callback',
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

  return passport;
};

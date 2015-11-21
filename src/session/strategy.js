import {Strategy as RedditStrategy} from 'passport-reddit';
import libdebug from 'debug';

const debug = libdebug('xeno:session:strategy');

export default (config) => {
  return new RedditStrategy({
    clientID:     config.REDDIT_CONSUMER_KEY,
    clientSecret: config.REDDIT_CONSUMER_SECRET,
    callbackURL:  config.HOST + '/callback',
    scope:        'identity,read,vote',
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
  });
};

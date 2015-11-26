import passport from 'passport';
import libdebug from 'debug';

const debug = libdebug('xeno:session:passport');

export default (strategy) => {
  passport.serializeUser((user, done) => {
    done(null, user);
  });

  passport.deserializeUser((obj, done) => {
    done(null, obj);
  });

  passport.use(strategy);

  return passport;
};

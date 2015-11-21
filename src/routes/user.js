import crypto from 'crypto';
import libdebug from 'debug';

const debug = libdebug('xeno:routes:user');

export default (passport) => (router) => {
  router.get('/login', (req, res, next) => {
    req.session.state = crypto.randomBytes(32).toString('hex');

    passport.authenticate('reddit', {
      state: req.session.state,
      duration: 'permanent',
      scope: 'identity,read,vote',
    })(req, res, next);
  });

  router.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/');
  });

  router.get('/callback', (req, res, next) => {
    if (req.query.state === req.session.state) {
      passport.authenticate('reddit', {
        successRedirect: '/',
        failureRedirect: '/401',
      })(req, res, next);
    } else {
      next(new Error(403));
    }
  });

  return router;
};

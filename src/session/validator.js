import libdebug from 'debug';

const debug = libdebug('xeno:session:validator');

const MAX_AGE = 60 * 60;
const PREEMPT_REFRESH = 10 * 60;

function doRefresh(refresh, req) {
  return new Promise((resolve, reject) => {
    const refreshToken = _.get(req, 'session.passport.user.refreshToken', null);

    if (!refreshToken) {
      return reject('fail.no_refresh_token');
    }

    debug('Refreshing access token');

    refresh.requestNewAccessToken('reddit', refreshToken, (err, accessToken, newRefreshToken) => {
      if (err) {
        return reject('fail.refresh: ' + err);
      }

      console.log('Got new access token', accessToken);
      debug('Got new access token', accessToken);

      // STORE TO USER

      return resolve();
    });
  });
}

function doValidate(refresh, authRequired, req) {
  return new Promise((resolve, reject) => {
    if (!req.isAuthenticated()) {
      return authRequired ? reject('fail.auth') : resolve();
    }

    const accessToken = _.get(req, 'session.passport.user.accessToken', null);
    const authenticated = _.get(req, 'session.passport.user.authenticated', null);
    const age = (Date.now() / 1000) - authenticated;

    if (!accessToken || age > (MAX_AGE - PREEMPT_REFRESH)) {
      return doRefresh(refresh, req);
    }

    if (age > MAX_AGE) {
      return reject('fail.session_age');
    }

    return resolve();
  });
}

function middleware(refresh, failureHandler, authRequired, req, res, next) {
  return doValidate(refresh, authRequired, req)
    .then(() => {
      next();
    })
    .catch(failureHandler);
}

export default (refresh) => {
  return {
    validate: doValidate.bind(undefined, refresh),
    api: middleware.bind(undefined, refresh, (err) => {
      res.sendStatus(401);
      res.end();

      return next(err);
    }),
    interactive: middleware.bind(undefined, refresh, (err) => {
      req.logout();
      res.redirect('/login');
      res.end();

      return next(err);
    }),
  };
};

import libdebug from 'debug';
import _ from 'lodash';
import Promise from 'bluebird';

const debug = libdebug('xeno:session:validator');

const MAX_AGE = 60 * 60;
const PREEMPT_REFRESH = 10 * 60;

function doRefresh(refresh, req) {
  return new Promise((resolve, reject) => {
    const refreshToken = _.get(req, 'session.passport.user.refreshToken', null);

    if (!refreshToken) {
      return reject(new Error('fail.no_refresh_token'));
    }

    debug('Refreshing access token');

    refresh.requestNewAccessToken('reddit', refreshToken, (err, accessToken) => {
      if (err) {
        debug('Failed to get new access token', err);
        return reject(err);
      }

      req.session.passport.user.accessToken = accessToken;
      req.session.passport.user.authenticated = Date.now() / 1000;

      return resolve();
    });
  });
}

function doValidate(refresh, authRequired, req) {
  if (!req.isAuthenticated()) {
    return authRequired ? Promise.reject(new Error('fail.auth')) : Promise.resolve();
  }

  const accessToken = _.get(req, 'session.passport.user.accessToken', null);
  const refreshToken = _.get(req, 'session.passport.user.refreshToken', null);
  const authenticated = _.get(req, 'session.passport.user.authenticated', null);
  const age = (Date.now() / 1000) - authenticated;

  if (refreshToken && (!accessToken || age > (MAX_AGE - PREEMPT_REFRESH))) {
    return doRefresh(refresh, req);
  }

  if (age > MAX_AGE) {
    return Promise.reject(new Error('fail.session_age'));
  }

  return Promise.resolve('pass');
}

function middleware(refresh, failureHandler, authRequired, req, res, next) {
  return doValidate(refresh, authRequired, req)
    .then(() => {
      next();
      return null;
    })
    .catch(failureHandler.bind(undefined, req, res, next));
}

export default (refresh) => {
  return {
    validate: doValidate.bind(undefined, refresh),

    api: middleware.bind(undefined, refresh, (req, res, next, err) => {
      res.sendStatus(401);
      res.end();

      return next(err);
    }),

    interactive: middleware.bind(undefined, refresh, (req, res, next, err) => {
      req.logout();
      res.redirect('/login');
      res.end();

      return next(err);
    }),
  };
};

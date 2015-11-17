import Joi from 'joi';

export const itemsForChannel = {
  params: {
    channel: Joi.string().required().min(3).max(128),
  },
};

export function session(req) {
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

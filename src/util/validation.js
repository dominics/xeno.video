import Joi from 'joi';
import _ from 'lodash';

const WRITABLE_SETTINGS = ['nsfw', 'autoplay'];

export const itemsForChannel = {
  params: {
    channel: Joi.string().required().alphanum().min(3).max(128),
  },
};

export const settingUpdate = {
  body: {
    type: Joi.string().required().valid('setting'),
    data: Joi.array().required().items(Joi.object().keys({
      id: Joi.string().required().valid(WRITABLE_SETTINGS),
      value: Joi.boolean().required(),
    })),
  },
};

export function session(req) {
  if (!req.isAuthenticated()) {
    return 'fail.auth';
  }

  const accessToken = _.get(req, 'session.passport.user.accessToken', null);
  const refreshToken = _.get(req, 'session.passport.user.refreshToken', null);
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

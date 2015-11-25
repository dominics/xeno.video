import Promise from 'bluebird';
import { Map } from 'immutable';
import _ from 'lodash';

export default class SettingStore {
  redis = null;

  static WRITABLE = {
    'nsfw': true,
    'autoplay': true,
  };

  constructor(redis) {
    this.redis = redis;
  }

  getAll(req) {
    return new Promise((resolve, _reject) => {
      const state = new Map({
        authenticated: req.isAuthenticated(),
        nsfw: _.get(req, 'session.setting.nsfw', false),
        autoplay: _.get(req, 'session.setting.autoplay', true),
        userId: _.get(req, 'session.passport.user.reddit.id', null),
        name: _.get(req, 'session.passport.user.reddit.name', null),
      });

      return resolve(state.map((v, k) => ({ 'id': k, 'value': v })).toArray());
    });
  }

  update(req) {
    return new Promise((resolve, reject) => {
      if (req.method !== 'PATCH') {
        return reject(new Error('Only PATCH requests are supported'));
      }

      return resolve('Updated?');
    });
  }
}

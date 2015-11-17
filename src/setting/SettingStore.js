import Promise from 'bluebird';
import { Map } from 'immutable';
import _ from 'lodash';

export default class SettingStore {
  redis = null;

  constructor(redis) {
    this.redis = redis;
  }

  getAll(req) {
    return new Promise((resolve, reject) => {
      const state = new Map({
        nsfw: true,
        ratio: 'free',
        authenticated: req.isAuthenticated(),
        userId: _.get(req, 'session.passport.user.reddit.id', null),
        name: _.get(req, 'session.passport.user.reddit.name', null),
      });

      return resolve(state.map((v, k) => ({ 'id': k, 'value': v })).toArray());
    });
  }
}

import libdebug from 'debug';

const debug = libdebug('xeno:store');

export default class Store {
  type = 'unknown';
  api = null;
  redis = null;
  validator = null;
  queues = {};
  log = null;

  /**
   * @param {Api} api
   * @param {RedisClient} redis
   * @param {session.validator} validator
   * @param {Object.<string,Queue>} queues
   */
  constructor(api, redis, validator, queues) {
    this.api = api;
    this.redis = redis;
    this.validator = validator;
    this.queues = queues;
    this.log = libdebug('xeno:store');
  }

  ensureAuthenticated(req) {
    return this.validator.validate(true, req);
  }

  _key(type, param = null) {
    return param
      ? `${this.type}-store/${type}:${param}`
      : `${this.type}-store/${type}`;
  }

  /**
   * @param key string
   * @returns Promise.<int>
   */
  prepareList(key) {
    return this.redis.llenAsync(key)
      .then(length => {
        return length;
      }).catch(err => {
        debug('Caught key error', key, err, 'deleting key');

        return this.redis.delAsync(key).then(() => {
          return 0;
        });
      });
  }
}

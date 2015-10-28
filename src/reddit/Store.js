import libdebug from 'debug';

const debug = libdebug('xeno:store');

export default class Store {
  name = 'unknown';
  api = null;
  redis = null;

  /**
   * @param api Api
   * @param redis RedisClient
   */
  constructor(api, redis) {
    this.api = api;
    this.redis = redis;
  }

  _key(type, param = null) {
    return param
      ? `${this.name}-store/${type}:${param}`
      : `${this.name}-store/${type}`;
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

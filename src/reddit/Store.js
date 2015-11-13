
export default class Store {
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
}

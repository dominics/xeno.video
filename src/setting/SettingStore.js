

export default class SettingStore {
  redis = null;

  constructor(redis) {
    this.redis = redis;
  }
}

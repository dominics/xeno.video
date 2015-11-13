import { MapStore } from 'flux/utils';
const Promise = require('bluebird');

export default class SettingStore extends MapStore {
  constructor() {
    super();

    this.name = 'setting';
  }

  getAll() {
    return Promise.resolve({
      nsfw: true,
    });
  }
}

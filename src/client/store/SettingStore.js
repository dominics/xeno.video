import Store from './Store';

export default class SettingStore extends Store {
  constructor() {
    super();

    this.name = 'setting';
  }

  getAll() {
    return {
      nsfw: true,
    };
  }
}

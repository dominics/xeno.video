import Store from './Store';

export default class ChannelStore extends Store {
  constructor() {
    super();

    this.name = 'channel';
  }

  getAll() {
    return this._multi('/channel/all');
  }
}

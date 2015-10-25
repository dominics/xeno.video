import Store from './../util/Store';

export default class ChannelStore extends Store {
  constructor(request) {
    super(request);

    this.name = 'channel';
  }

  getAll() {
  }
}

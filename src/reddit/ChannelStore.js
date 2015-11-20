import Store from './Store';

export default class ChannelStore extends Store {
  constructor(api, redis) {
    super(api, redis);

    this.type = 'channel';
  }
}

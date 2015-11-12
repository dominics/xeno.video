import Store from './Store';

export default class ItemStore extends Store {
  constructor() {
    super();

    this.name = 'item';
  }

  getAllForChannel(channel) {
    const url = `/item/channel/${channel.props.id}`;
    return this._multi(url);
  }
}

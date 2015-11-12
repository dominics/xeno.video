import Store from './../../util/Store';

export default class ItemStore extends Store {
  constructor(request) {
    super(request);

    this.name = 'item';
  }

  getAllForChannel(channel) {
    const url = `/item/channel/${channel.props.id}`;
    return this._multi(url);
  }
}

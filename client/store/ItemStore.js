const Store = require('./Store');

module.exports = class ItemStore extends Store {
  constructor() {
    super();

    this.name = 'item';
  }

  getAllForChannel(channel) {
    const url = `/item/channel/${channel.props.id}`;
    return this._multi(url);
  }
};

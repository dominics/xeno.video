const Store = require('./Store');

module.exports = class ChannelStore extends Store {
  constructor() {
    super();

    this.name = 'channel';
  }

  getAll() {
    return this._multi('/channel/all');
  }
};

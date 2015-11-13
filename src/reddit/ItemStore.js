import Store from './Store';
const debug = require('debug')('xeno:store:item');
const itemQueue = require('../queue')('item');

export default class ItemStore extends Store {
  constructor(api, redis) {
    super(api, redis);

    this.name = 'item';
  }

  getForChannel(channel, req, next) {
    debug('Getting items for channel', channel);

    itemQueue.send();

    this.api.listing(channel, 'hot', (err, items) => {
      next(err, items);
    });
  }
}

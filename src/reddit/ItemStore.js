import Store from './Store';
const debug = require('debug')('xeno:store:item');

export default class ItemStore extends Store {
  constructor(api, redis) {
    super(api, redis);

    this.name = 'item';
  }

  getForChannel(channel, next) {
    debug('Getting items for channel', channel);

    this.api.listing(channel, 'hot', (err, responseData) => {
      if (err) {
        return next(err);
      }

      const items = [];

      const info = JSON.parse(responseData.body);

      if (!info.kind || info.kind !== 'Listing') {
        return next(new Error('Invalid response kind'));
      }

      if (!info.data || !info.data.children) {
        return next(new Error('No data in response'));
      }

      for (let item of info.data.children) {
        items.push(item);
      }

      next(null, items);
    });
  }
}

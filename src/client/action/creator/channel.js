import types from './../types';
import libdebug from 'debug';

const debug = libdebug('xeno:actions:channel');

export default (registry, api, store) => {
  // On selecting a channel, refresh items in channel
  registry.wrap(types.channelSelect, (previous, err = null, channelId = null) => {
    if (err) {
      return previous(err);
    }

    debug('Beginning channel selection', channelId);
    api.item.getAllForChannel(channelId)
      .then((data) => {
        debug('Dispatching channelSelected with', channelId, data);
        return registry.getCreator(types.channelSelected)(null, {
          items:     data,
          channelId: channelId,
        });
      })
      .catch((e) => {
        debug('Error getting all items for channel', channelId, e);
        return registry.getCreator(types.channelSelected)(e);
      });

    debug('Dispatching channelSelect');

    return previous(err, channelId);
  });
};

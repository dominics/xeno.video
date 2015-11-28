import types from './../types';
import libdebug from 'debug';
import _ from 'lodash';

const debug = libdebug('xeno:actions:channel');

export default (registry, api, store) => {
  // On initialize action, receive channels and select the first one
  registry.wrap(types.initialize, (previous, err = null, originalData = null) => {
    if (err) {
      return previous(err);
    }

    debug('Beginning channel initialization');
    const channelReceiveToken = api.channel
      .refresh()
      .then((data) => {
        debug('Got channel data', data);

        debug('Dispatching to channelReceive');
        const token = registry.getCreator(types.channelReceive)(null, data);

        if (!store.currentChannel.hasChannel()) {
          debug('Dispatching to channelSelect because no current channel');
          registry.getCreator(types.channelSelect)(null, _.get(data, ['0', 'id'], null));
        }

        debug('Returning receive token');
        return token;
      })
      .catch((e) => {
        debug('Got error receiving channels', e);
        return registry.getCreator(types.channelReceive)(e);
      });

    return previous(err, [originalData, channelReceiveToken]);
  });

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

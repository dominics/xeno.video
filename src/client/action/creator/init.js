import types from './../types';
import _ from 'lodash';
import libdebug from 'debug';

const debug = libdebug('xeno:actions:init');

export default (registry, api, store) => {
  // On initialize action, start API requests
  registry.wrap(types.initialize, (previous, err = null, _ignored = null) => {
    if (err) {
      return previous(err);
    }

    debug('Beginning app initialization: complex action stacks coming up!');

    const channelReceiveToken = api.channel
      .refresh()
      .then((data) => {
        debug('Got channel data', data);

        debug('Dispatching to channelReceive');
        const _token = registry.getCreator(types.channelReceive)(null, data);

        if (!store.currentChannel.hasChannel()) {
          debug('Dispatching to channelSelect because no current channel');
          registry.getCreator(types.channelSelect)(null, _.get(data, ['0', 'id'], null));
        }

        debug('Returning receive token');
        return _token;
      })
      .catch((e) => {
        debug('Get error receiving channels', e);
        return registry.getCreator(types.channelReceive)(e);
      });

    const settingReceiveToken = api.setting
      .refresh()
      .then((data) => {
        debug('Get setting data', data);
        return registry.getCreator(types.settingReceive)(null, data);
      })
      .catch((e) => {
        debug('Get error receiving settings', e);
        return registry.getCreator(types.settingReceive)(e);
      });

    return previous(err, [
      channelReceiveToken,
      settingReceiveToken,
    ]);
  });
};

import libdebug from 'debug';
import activeDispatcher from './dispatcher';
import Registry from './action/Registry';
import api from './api';
import store from './store';
import _ from 'lodash'; //

const debug = libdebug('xeno:actions');

// Action symbols
export const initialize = 'initialize';
export const pending = 'pending';
export const channelSelect   = 'channelSelect';
export const channelSelected = 'channelSelected';
export const channelReceive  = 'channelReceive';
export const settingReceive = 'settingReceive';
export const settingUpdate = 'settingUpdate';
export const itemSelect = 'itemSelect';
export const viewStart = 'viewStart';
export const viewEnd = 'viewEnd';

export const registry = new Registry(activeDispatcher, [
  initialize,
  pending,

  channelSelect,
  channelSelected,
  channelReceive,

  settingReceive,
  settingUpdate,

  itemSelect,

  viewStart,
  viewEnd,
]);

// On initialize action, start API requests
registry.wrap(initialize, (previous, err = null, _data = null) => {
  if (err) {
    return previous(err);
  }

  debug('Beginning app initialization: complex action stacks coming up!');

  const channelReceiveToken = api.channel
    .refresh()
    .then((data) => {
      debug('Got channel data', data);

      debug('Dispatching to channelReceive');
      const _token = registry.getCreator(channelReceive)(null, data);

      if (!store.currentChannel.hasChannel()) {
        debug('Dispatching to channelSelect because no current channel');
        registry.getCreator(channelSelect)(null, _.get(data, ['0', 'id'], null));
      }

      debug('Returning receive token');
      return _token;
    })
    .catch((e) => {
      debug('Get error receiving channels', e);
      return registry.getCreator(channelReceive)(e);
    });

  const settingReceiveToken = api.setting
    .refresh()
    .then((data) => {
      debug('Get setting data', data);
      return registry.getCreator(settingReceive)(null, data);
    })
    .catch((e) => {
      debug('Get error receiving settings', e);
      return registry.getCreator(settingReceive)(e);
    });

  return previous(err, [
    channelReceiveToken,
    settingReceiveToken,
  ]);
});

// On selecting a channel, refresh items in channel
registry.wrap(channelSelect, (previous, err = null, channelId = null) => {
  if (err) {
    return previous(err);
  }

  debug('Beginning channel selection', channelId);
  api.item.getAllForChannel(channelId)
    .then((data) => {
      debug('Dispatching channelSelected with', channelId, data);
      return registry.getCreator(channelSelected)(null, {
        items:     data,
        channelId: channelId,
      });
    })
    .catch((e) => {
      debug('Error getting all items for channel', channelId, e);
      return registry.getCreator(channelSelected)(e);
    });

  debug('Dispatching channelSelect');

  return previous(err, channelId);
});

registry.wrap(itemSelect, (previous, err = null, itemId = null) => {
  if (err || !itemId) {
    return previous(err, itemId);
  }

  const item = $('#item-' + itemId);

  // @todo: iff bottom of item is below viewport, scroll until it's somewhere in the upper quarter (lax-follow)

  if (item.eq(0)) {
    window.scrollTo(item.offset().left, item.offset().top - 200);
  }

  return previous(err, itemId);
});

export default registry;

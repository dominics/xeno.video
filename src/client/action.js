import libdebug from 'debug';
import activeDispatcher from './dispatcher';
import Registry from './action/Registry';
import api from './api';

const debug = libdebug('xeno:actions');

// Action symbols
export const initialize             = 'initialize';
export const pending                = 'pending';
export const receiveItemsForChannel = 'receiveItemsForChannel';
export const receiveChannels        = 'receiveChannels';
export const receiveSettings        = 'receiveSettings';
export const selectItem             = 'selectItem';
export const selectChannel          = 'selectChannel';
export const updateSetting          = 'updateSetting';
export const viewStart              = 'viewStart';
export const viewEnd                = 'viewEnd';

export const registry = new Registry(activeDispatcher, [
  pending,
  initialize,
  receiveItemsForChannel,
  receiveChannels,
  receiveSettings,
  selectItem,
  selectChannel,
  updateSetting,
  viewStart,
  viewEnd,
]);

// On initialize action, start API requests
registry.wrap(initialize, (previous, err = null, data = null) => {
  if (err) {
    return previous(err);
  }

  api.channel.refresh();
  api.setting.refresh();

  return previous(err, data);
});

// On selecting a channel, refresh items in channel
registry.wrap(selectChannel, (previous, err = null, data = null) => {
  if (err) {
    return previous(err);
  }

  debug('Action creating for get all data for channel with', data);
  api.item.getAllForChannel(data);

  return previous(err, data);
});

export default registry;

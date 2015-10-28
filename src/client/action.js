import libdebug from 'debug';
import activeDispatcher from './dispatcher';
import Registry from './action/Registry';
import api from './api';

const debug = libdebug('xeno:actions');

// Action symbols
export const initialize             = Symbol('initialize');
export const pending                = Symbol('pending');
export const receiveItemsForChannel = Symbol('receiveItems');
export const receiveChannels        = Symbol('receiveChannels');
export const receiveSettings        = Symbol('receiveSettings');
export const selectItem             = Symbol('selectItem');
export const selectChannel          = Symbol('selectChannel');
export const updateSetting          = Symbol('updateSetting');
export const viewStart              = Symbol('viewStart');
export const viewEnd                = Symbol('viewEnd');

const registry = new Registry(activeDispatcher, [
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
registry.wrap(initialize, (previous, data) => {
  api.channel.refresh();
  api.setting.refresh();

  return previous(data);
});

// On selecting a channel, refresh items in channel
registry.wrap(selectChannel, (previous, data) => {
  api.item.getAllForChannel(data);

  return previous(data);
});

export {
  registry as default,
  registry,
};

import libdebug from 'debug';
import activeDispatcher from './dispatcher';
import Registry from './action/Registry';
import api from './api';

const debug = libdebug('xeno:actions');

// Action symbols
export const initialize      = Symbol('initialize');
export const pending         = Symbol('pending');
export const receiveItems    = Symbol('receiveItems');
export const receiveChannels = Symbol('receiveChannels');
export const selectItem      = Symbol('selectItem');
export const selectChannel   = Symbol('selectChannel');
export const updateSetting   = Symbol('updateSetting');
export const viewStart       = Symbol('viewStart');
export const viewEnd         = Symbol('viewEnd');

const registry = new Registry(activeDispatcher, [
  pending,
  initialize,
  receiveItems,
  receiveChannels,
  selectItem,
  selectChannel,
  updateSetting,
  viewStart,
  viewEnd,
]);

// On initialize action, start API requests
registry.wrap(initialize, (previous, data) => {
  api.channel.getAll();
  api.setting.getAll();

  return previous(data);
});

export {
  registry as default,
  registry,
};

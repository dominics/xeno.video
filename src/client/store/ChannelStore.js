import { MapStore } from 'flux/utils';
import libdebug from 'debug';
import { receiveChannels } from './../action';

const debug = libdebug('xeno:store:channel');

export default class ChannelStore extends MapStore {
  /**
   * @param {Immutable.Map} state
   * @param {string|Symbol} action
   * @returns {*}
   */
  reduce(state, action) {
    switch (action.type) {
      case receiveChannels:
        debug('Channel store received channel data!', action.data);
        debug('Reducing channel state', state);
        return state.set(action.data.id, action.data);
      default:
        return state;
    }
  }
}

import { MapStore } from 'flux/utils';
import libdebug from 'debug';
import types from '../action/types';

const debug = libdebug('xeno:store:itemByChannel');

export default class ItemByChannelStore extends MapStore {
  /**
   * @param {Map} state
   * @param {Action} action
   * @returns {*}
   */
  reduce(state, action) {
    switch (action.type) {
      case types.channelSelected:
        if (action.isError()) {
          debug('ItemByChannel store received error updating', action.err);
          return state;
        }

        debug('ItemByChannel store received data, mutating (requires channelId)', action.data);
        return state.set(
          action.data.channelId,
          action.data.items.map((item) => item.id)
        );
      default:
        return state;
    }
  }
}

import { MapStore } from 'flux/utils';
import types from '../action/types';
import libdebug from 'debug';

const debug = libdebug('xeno:store:channel');

export default class ChannelStore extends MapStore {
  /**
   * @param {Immutable.Map} state
   * @param {Action} action
   * @returns {*}
   */
  reduce(state, action) {
    switch (action.type) {
      case types.channelReceive:
        if (action.isError()) {
          debug('Channel store received error updating channels');
          return state;
        }

        debug('Channel store received channel data, mutating', action.data);
        return state.withMutations(map => {
          let mutated = map;

          for (const channel of action.data) {
            mutated = mutated.set(channel.id, channel);
          }
        });
      default:
        return state;
    }
  }
}

import { MapStore } from 'flux/utils';
import { receiveChannels } from './../action';
import libdebug from 'debug';

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
        debug('Channel store received channel data', action.data);

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

import { MapStore } from 'flux/utils';
import types from '../action/types';
import libdebug from 'debug';
import { Map } from 'immutable';

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
          let subscribed = new Map();
          let multis = new Map();

          for (const channel of action.data.subscribed) {
            subscribed = subscribed.set(channel.id, channel);
          }

          for (const channel of action.data.multis) {
            multis = multis.set(channel.id, channel);
          }

          map.set('subscribed', subscribed);
          map.set('multis', multis);
        });
      default:
        return state;
    }
  }
}

import { MapStore } from 'flux/utils';
import types from '../action/types';
import libdebug from 'debug';
import { Map } from 'immutable';

const debug = libdebug('xeno:store:favouriteChannel');

export default class FavouriteChannelStore extends MapStore {
  getInitialState() {
    return new Map({
      videos: { id: 'videos' },
      aww: { id: 'aww' },
      music: { id: 'music' },
      deepintoyoutube: { id: 'deepintoyoutube' },
    });
  }

  /**
   * @param {Immutable.Map} state
   * @param {Action} action
   * @returns {*}
   */
  reduce(state, action) {
    switch (action.type) {
      case types.initialize:
        debug('Initializing favourite channels');

        return state;
      case types.channelAdd:
        debug('Adding channel', action);

        return state;
      default:
        return state;
    }
  }
}

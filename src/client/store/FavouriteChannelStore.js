import { ReduceStore } from 'flux/utils';
import types from '../action/types';
import libdebug from 'debug';
import { List } from 'immutable';

const debug = libdebug('xeno:store:favouriteChannel');

export default class FavouriteChannelStore extends ReduceStore {
  static _key(id) {
    return 'channel-favourite:' + id;
  }

  static getStorage() {
    if (!window.localStorage) {
      throw new Error('No local storage available');
    }

    return window.localStorage;
  }

  static defaults() {
    return new List([
      'videos',
      'aww',
      'music',
      'deepintoyoutube',
    ]);
  }

  /**
   * @returns {List}
   */
  getInitialState() {
    let state = FavouriteChannelStore.defaults();

    const key = FavouriteChannelStore._key('all');
    const storage = FavouriteChannelStore.getStorage();

    const all = storage.getItem(key);
    debug('Got data from local storage', all);

    if (!all) {
      debug('No such storage key');
      return state;
    }

    try {
      const data = JSON.parse(all);

      if (!data || typeof data !== 'object') {
        debug('Bad JSON at storage key');
        storage.removeItem(key);
        return state;
      }

      return new List(data);
    } catch (e) {
      debug('Invalid map at storage key');
      storage.removeItem(key);
      return state;
    }
  }

  /**
   * @param {List} state
   * @param {Action} action
   * @returns {List}
   */
  reduce(state, action) {
    switch (action.type) {
      case types.channelAdd:
        debug('Adding channel to favourites', action.data);
        const newState = state.unshift(action.data);

        FavouriteChannelStore.getStorage().setItem(
          FavouriteChannelStore._key('all'),
          JSON.stringify(newState.toArray())
        );

        return newState;
      default:
        return state;
    }
  }
}

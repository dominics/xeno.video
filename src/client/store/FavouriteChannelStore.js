import { ReduceStore } from 'flux/utils';
import types from '../action/types';
import libdebug from 'debug';
import { List, OrderedSet } from 'immutable';

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

  static isDefault(state) {
    const defaults = FavouriteChannelStore.defaults();
    return state.isSubset(defaults) && defaults.isSubset(state);
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

      return (new List(data)).toOrderedSet().toList();
    } catch (e) {
      debug('Invalid map at storage key');
      storage.removeItem(key);
      return state;
    }
  }

  addAndSave(state, channel) {
    return this.save(state.unshift(channel).toOrderedSet().take(7).toList());
  }

  save(state) {
    FavouriteChannelStore.getStorage().setItem(
      FavouriteChannelStore._key('all'),
      JSON.stringify(state.toArray())
    );

    return state;
  }

  /**
   * @param {List} state
   * @param {Action} action
   * @returns {List}
   */
  reduce(state, action) {
    if (action.isError()) {
      return state;
    }

    switch (action.type) {
      case types.channelAdd:
        debug('Adding channel to favourites', action.data);
        return this.addAndSave(state, action.data);
      case types.channelSelected:
        debug('Adding selected channel to favourites', action.data.channelId);
        return this.addAndSave(state, action.data.channelId);
      case types.channelReset:
        debug('Resetting channels');
        return this.save(FavouriteChannelStore.defaults());
      default:
        return state;
    }
  }
}

import types from './../types';
import libdebug from 'debug';
import {fragment, currentRoute} from './../../fragment';

const debug = libdebug('xeno:actions:window');

const DEFERRED_SELECT_TIMEOUT = 10000;

export default (registry, api, store) => {
  /**
   * @return {Promise}
   * @param {int} timeout ms
   */
  function delay(timeout) {
    return new Promise((resolve, _) => {
      window.setTimeout(resolve, timeout);
    });
  }

  /**
   * @param {{string}} id
   * @param {{FluxStore}} mapStore
   */
  function deferredSelect(id, mapStore) {
    const timeout = delay(DEFERRED_SELECT_TIMEOUT).then(() => {
      return Promise.reject('Giving up on selecting item after timeout');
    });

    const select = new Promise((resolve) => {
      const subscription = mapStore.addListener(() => {
        debug('Got change event in deferred select');

        if (mapStore.has(id)) {
          resolve(subscription);
        } else {
          debug('Got change event in deferred select but store still does not have item');
        }
      });
    }).then((subscription) => {
      debug('Removed subscription correctly');
      subscription.remove();
    });

    return Promise.race([timeout, select]);
  }

  /**
   * @param {string?} channel
   * @param {string?} item
   * @return void
   */
  function handle(channel, item = null) {
    if (window.ignoreHashChange) {
      debug('Ignorning hashchange');
      return;
    }

    debug('Handling hashchange', channel, item);

    if (!channel) {
      debug('No channel given, nothing to do');
      return;
    }

    if (store.currentChannel.latest() === channel) {
      debug('Channel already selected or being selected, skipping selection');
    } else {
      debug('Selecting channel', channel);
      const token = registry.getCreator(types.channelSelect)(null, channel);
      debug('Dispatcher token for channel select:', token);
    }

    if (!item) {
      debug('No item given, nothing left to do');
      return;
    }

    if (store.currentItem.getState() === item) {
      debug('Item is already selected, skipping item selection');
      return;
    }

    if (!store.item.has(item)) {
      debug('Store does not have item, deferring select');
      deferredSelect(item, store.item)
        .then(() => {
          debug('Got deferred item from store, about to select', item);
          registry.getCreator(types.itemSelect)(null, item);
        })
        .catch((err) => {
          debug('Could not get item from store', err);
        });
      return;
    }

    debug('Selecting item', item);
    registry.getCreator(types.itemSelect)(null, item);
  }

  function initialize(previous, err = null, _data = null) {
    if (err) {
      return previous(err);
    }

    if (window.ignoreHashChange) {
      return null;
    }

    const current = fragment();

    if (current) {
      const {channel, item} = currentRoute();
      handle(channel, item);
    }

    return previous(err, _data);
  }

  function hashchange(previous, err = null, event = null) {
    if (err || !event) {
      return previous(err, event);
    }

    if (window.ignoreHashChange) {
      return null;
    }

    const {channel, item} = currentRoute();
    handle(channel, item);
  }

  registry.wrap(types.initialize, initialize);
  registry.wrap(types.hashchange, hashchange);
};

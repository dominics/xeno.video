import types from './../types';
import libdebug from 'debug';
import {fragment, currentRoute} from './../../fragment';

const debug = libdebug('xeno:actions:window');

export default (registry, api, store) => {
  function handle(channel = null, item = null) {
    debug('Handling hashchange', channel, item);

    if (channel && store.currentChannel.latest() !== channel) {
      registry.getCreator(types.channelSelect)(null, channel);
    }

    if (item && store.item.has(item) && store.currentItem.getState() !== item) {
      registry.getCreator(types.itemSelect)(null, item);
    }
  }

  function initialize(previous, err = null, _data = null) {
    if (err) {
      return previous(err);
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

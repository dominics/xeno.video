/**
 * globals: io
 */

import types from './../types';
import libdebug from 'debug';

const debug = libdebug('xeno:actions:socket');

export default (registry, api, store) => {
  let socket = null;

  function channelUpdated({ channel }) {
    if (store.currentChannel.latest() === channel) {
      debug('Got channel updated event for active channel', channel);
      registry.getCreator(types.channelSelect)(null, channel);
    }
  }

  /**
   * On initialize action, connect socket, and listen
   *
   * @param previous
   * @param err
   * @param _data
   * @returns {*}
   */
  function initialize(previous, err = null, _data = null) {
    if (err) {
      return previous(err);
    }

    debug('Beginning socket initialization');
    socket = window.io.connect(window.location.host);

    socket.on('channelUpdated', channelUpdated);

    return previous(err, _data);
  }

  registry.wrap(types.initialize, initialize);
};

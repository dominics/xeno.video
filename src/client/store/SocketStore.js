import { MapStore } from 'flux/utils';
import io from './../io';
import libdebug from 'debug';

const debug = libdebug('xeno:store:socket');

export default class SocketStore extends MapStore {
  constructor(dispatcher) {
    super(dispatcher);

    this.io = io();

    debug('Emitting HELO');
    this.io.emit('helo', navigator.userAgent);

    this.io.on('tv', (m) => {
      debug('Received message on TV channel', m);
    });
  }
}

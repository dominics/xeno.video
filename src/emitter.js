import libdebug from 'debug';

const debug = libdebug('xeno:emitter');

export default (config, io) => {
  io.emit('tv', 'Hello, world');

  io.on('connection', (_ws) => {
    debug('A client connected');
  });

  io.on('helo', (req) => {
    debug('Helo received', req);
  });
};

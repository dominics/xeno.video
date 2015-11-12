const debug = require('debug')('emitter');

export default (app) => {
  const io = app.locals.io;

  debug('Inside emitter', io);

  io.emit('tv', 'Hello, world');

  io.on('connection', (ws) => {
    debug('A client connected', ws);
  });

  io.on('helo', (req) => {
    debug('Helo received from', req);
  });
};

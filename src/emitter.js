import _ from 'lodash';
import libdebug from 'debug';

const debug = libdebug('xeno:emitter');

export default (config, socket, sessionInstance) => {
  socket.use((connection, next) => {
    sessionInstance(connection.request, connection.request.res, next);
  });

  socket.on('connection', (connection) => {
    if (!_.get(connection, 'request.session', false)) {
      debug('Sessionless Socket.io client has been disconnected');
      connection.disconnect();
      return;
    }

    debug('A client connected');
  });

  socket.on('helo', (req) => {
    debug('Helo received', req);
  });

  return socket;
};

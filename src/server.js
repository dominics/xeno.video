import http from 'http';
import libdebug from 'debug';

const debug = libdebug('xeno:server');

export default (config, app) => {
  /**
   * Create HTTP server.
   */
  const server = http.createServer(app); //

  server.on('error', (error) => {
    if (error.syscall !== 'listen') {
      throw error;
    }

    const port = config.port;
    const bind = typeof port === 'string'
      ? 'Pipe ' + port
      : 'Port ' + port;

    switch (error.code) {
      case 'EACCES':
        debug(bind + ' requires elevated privileges');
        process.exit(1);
        break;
      case 'EADDRINUSE':
        debug(bind + ' is already in use');
        process.exit(1);
        break;
      default:
        throw error;
    }
  });

  server.on('listening', () => {
    const addr = server.address();
    const bind = typeof addr === 'string'
      ? 'pipe ' + addr
      : 'port ' + addr.port;

    debug('Listening on ' + bind);
  });



  return server;
};

import http from 'http';

/**
 * The split between this and app.js is this contains
 * daemonization and connections, whereas the app is a
 * pure module that can be used without side-effects.
 */

function normalizePort(val) {
  const port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}

export default (app) => {
  /**
   * Create HTTP server.
   */
  const server = http.createServer(app);


  server.on('error', (error) => {
    if (error.syscall !== 'listen') {
      throw error;
    }

    const port = app.get('port');
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
};

import express from 'express';
import path from 'path';
import favicon from 'serve-favicon';
import logger from 'morgan';
import bodyParser from 'body-parser';
import compress from 'compression';
import libdebug from 'debug';
import Promise from 'bluebird';
import redis from 'redis';
import http from 'http';
import cookieParser from 'cookie-parser';
import { ValidationError } from 'express-validation';
import Api from './reddit/Api';
import ChannelStore from './reddit/ChannelStore';
import ItemStore from './reddit/ItemStore';

const debug = libdebug('xeno:app');

export default () => {
  const app = express();

  // view engine setup
  app.set('views', path.join(__dirname, '..', 'src', 'views'));
  app.set('view engine', 'jade');

  if (app.get('env') === 'development') {
    app.disable('etag');

    app.use((req, res, next) => {
      req.headers['if-none-match'] = 'no-match-for-this';
      next();
    });
  }

  app.use(favicon(path.join(__dirname, '..', 'public', 'favicon.png')));
  app.use(logger('dev'));
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({extended: false}));
  app.use(cookieParser());
  app.use(compress());
  app.use(express.static(path.join(__dirname, '..', 'public')));

  // error handlers

  // development error handler
  // will print stacktrace
  if (app.get('env') === 'development') {
    app.use((err, req, res, next) => {
      res.status(err.status || 500);
      res.render('error', {
        message: err.message,
        error:   err,
      });
      next();
    });
  }

  // production error handler
  // no stacktraces leaked to user
  app.use((err, req, res, next) => {
    if (err instanceof ValidationError) return res.status(err.status).json(err);

    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error:   {},
    });
    next();
  });

  /**
   * Get port from environment and store in Express.
   */

  const normalizedPort = ((val) => {
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
  })(process.env.PORT);

  app.set('port', normalizedPort);

  /**
   * Store other configuration
   */
  app.set('env', process.env.NODE_ENV);

  /**
   * Create HTTP server.
   */
  const server = http.createServer(app);

  Promise.promisifyAll(redis.RedisClient.prototype);
  Promise.promisifyAll(redis.Multi.prototype);

  const redisConnection = redis.createClient(
    process.env.REDIS_PORT,
    process.env.REDIS_HOST,
    {}
  );

  redisConnection.on('error', (err) => {
    console.error(err);
  });

  app.locals.redis = redisConnection;

  /**
   * Create socket.io server.
   */
  const io = require('socket.io')(server);
  app.locals.io = io;

  /**
   * Session
   */
  const passport = require('./../dist/session')(app, io, redisConnection);

   /**
   * API-based storages
   */
  const api = new Api();
  app.locals.redditApi = api;

  app.locals.stores = {
    channel: new ChannelStore(api, redisConnection),
    item:    new ItemStore(api, redisConnection),
  };

  app.use((req, res, next) => {
    if (
      !req.isAuthenticated()
      || !req.session.passport
      || !req.session.passport.user
      || !req.session.passport.user.accessToken
    ) {
      req.redditToken = null;
    } else {
      req.redditToken = req.session.passport.user.accessToken;
    }

    next();
  });

  /**
   * Common template vars
   */
  app.use((req, res, next) => {
    res.locals.session = req.session;
    res.locals.isAuthenticated = req.isAuthenticated();
    res.locals.env = app.get('env');
    res.locals.host = process.env.HOST;
    res.locals.port = process.env.PORT;
    res.locals.lr_host = process.env.LR_HOST;
    res.locals.lr_port = process.env.LR_PORT;
    next();
  });

  /**
   * Routes
   */
  const index = require('./../dist/routes/index')(app, passport);
  app.use('/', index);

  /**
   * Start emitter
   */
  require('./../dist/emitter')(app);

  /**
   * Listen on provided port, on all network interfaces.
   */
  server.listen(app.get('port'));

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
        console.error(bind + ' requires elevated privileges');
        process.exit(1);
        break;
      case 'EADDRINUSE':
        console.error(bind + ' is already in use');
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

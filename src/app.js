import express from 'express';
import path from 'path';
import favicon from 'serve-favicon';
import logger from 'morgan';
import bodyParser from 'body-parser';
import compress from 'compression';
import libdebug from 'debug';
import cookieParser from 'cookie-parser';
import { ValidationError } from 'express-validation';
import fs from 'fs';

const debug = libdebug('xeno:app');

export default (config) => {
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

  if (config.NODE_ENV === 'development' && (typeof global.describe !== 'function')) { // not in functional tests
    app.use(logger('dev'));
  } else if (config.LOG_FILE) {
    const log = fs.createWriteStream(config.LOG_FILE);
    app.use(logger('combined', {stream: log}));
  } else {
    console.error('Access logging disabled');
    // request logging disabled
  }

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
  app.set('port', config.PORT);
  app.set('env', config.NODE_ENV);

  return app;
};

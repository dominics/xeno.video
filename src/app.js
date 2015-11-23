import express from 'express';
import path from 'path';
import favicon from 'serve-favicon';
import logger from 'morgan';
import bodyParser from 'body-parser';
import compress from 'compression';
import libdebug from 'debug';

import http from 'http';
import cookieParser from 'cookie-parser';
import { ValidationError } from 'express-validation';
import { default as session, validate } from './passport';

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
  app.set('port', config.PORT);
  app.set('env', config.NODE_ENV);

  /**
   * Common template vars
   */
  app.use((req, res, next) => {
    res.locals.isAuthenticated = req.isAuthenticated();
    res.locals.env = app.get('env');
    res.locals.sessionValidation = validate(req);

    next();
  });

  return app;
};

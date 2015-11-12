const express      = require('express');
const path         = require('path');
const favicon      = require('serve-favicon');
const logger       = require('morgan');
import cookieParser from 'cookie-parser';
const bodyParser   = require('body-parser');
const compress     = require('compression');

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
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error:   {},
  });
  next();
});

export default app;

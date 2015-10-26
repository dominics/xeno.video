const express = require('express');
const validate = require('express-validation');
import * as validation from './validation';
const crypto = require('crypto');
const debug = require('debug')('xeno:router');
const redisCache = require('express-redis-cache');

const auth = (req, res, next) => {
  if (!req.isAuthenticated() || !req.redditToken) {
    return res.redirect('/login');
  }

  return next();
};

export default (app, passport) => {
  const router = express.Router();
  const cache = redisCache({
    client: app.locals.redis,
    expire: 30,
    prefix: 'index-controller/',
  });

  router.get('/login', (req, res, next) => {
    req.session.state = crypto.randomBytes(32).toString('hex');
    passport.authenticate('reddit', {
      state: req.session.state,
      duration: 'temporary',
      scope: 'identity,read,vote',
    })(req, res, next);
  });

  router.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/');
  });

  router.get('/callback', (req, res, next) => {
    if (req.query.state === req.session.state) {
      passport.authenticate('reddit', {
        successRedirect: '/',
        failureRedirect: '/401',
      })(req, res, next);
    } else {
      next(new Error(403));
    }
  });

  router.get('/', auth, (req, res) => {
    res.render('index', {
      title: 'xeno.video',
    });
  });

  router.get('/channel/all', auth, (req, res) => {
    res.json({
      channel: [
        {id: 'all', title: 'All'},
        {id: 'videos', title: 'Videos'},
      ],
    });
  });

  router.get('/item/channel/:channel', auth, validate(validation.itemsForChannel), cache.route({ cache: 5 }), (req, res, next) => {
    debug('Getting items for ' + req.params.channel);

    const channel = req.params.channel;

    if (!app.locals.stores || !app.locals.stores.item) {
      return next(new Error(400));
    }

    const itemStore = app.locals.stores.item;

    itemStore.getByChannel(channel, req)
      .then(items => {
        res.json({
          item: items,
        });

        res.end();
      })
      .catch(err => {
        return next(err);
      });
  });

  router.get('/401', (req, res) => {
    res.render('error', {
      message: 'You are not allowed to log in to this app.',
      error: {},
    });
  });

  // catch 404 and forward to error handler
  router.use((req, res, next) => {
    const err = new Error('Not Found');
    err.status = 404;
    next(err);
  });

  return router;
};

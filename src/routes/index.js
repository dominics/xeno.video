import express from 'express';
import validate from 'express-validation';
import * as validation from './validation';
import crypto from 'crypto';
import libdebug from 'debug';
import { authInteractive, authApi } from './../session';

const debug = libdebug('xeno:router');
import redisCache from 'express-redis-cache';

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

  router.get('/', authInteractive, (req, res) => {
    res.render('index', {
      title: 'xeno.video',
    });
  });

  router.get('/about', authInteractive, (req, res) => {
    res.render('about', {
      title: 'about xeno.video',
    });
  });

  router.get('/setting/all', authApi, (req, res, next) => {
    debug('Getting settings');

    if (!app.locals.stores || !app.locals.stores.setting) {
      return next(new Error('Could not find setting store'));
    }

    const settingStore = app.locals.stores.setting;

    settingStore.getAll(req, res)
      .then(settings => {
        res.json({
          type: 'setting',
          data: settings,
        });

        res.end();
      })
      .catch(err => next(err));
  });

  router.get('/channel/all', authApi, (req, res) => {
    res.json({
      type: 'channel',
      data: [
        {id: 'videos', title: 'Videos'},
        {id: 'all', title: 'All'},
      ],
    });
  });

  router.get('/item/channel/:channel', authApi, validate(validation.itemsForChannel), cache.route({ cache: 5 }), (req, res, next) => {
    debug('Getting items for ' + req.params.channel);

    const channel = req.params.channel;

    if (!app.locals.stores || !app.locals.stores.item) {
      return next(new Error('Could not find item store'));
    }

    const itemStore = app.locals.stores.item;

    itemStore.getByChannel(channel, req, res)
      .then(items => {
        res.json({
          type: 'item',
          data: items,
        });

        res.end();
      })
      .catch(err => next(err));
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

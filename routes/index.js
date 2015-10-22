const express = require('express');
const crypto = require('crypto');
const debug = require('debug')('router');

const auth = (req, res, next) => {
  if (!req.isAuthenticated()) {
    return res.redirect('/login');
  }

  return next();
};

module.exports = (passport) => {
  const router = express.Router();

  router.get('/login', (req, res, next) => {
    req.session.state = crypto.randomBytes(32).toString('hex');
    passport.authenticate('reddit', {
      state: req.session.state,
      duration: 'temporary',
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

  router.get('/item/channel/:channel', auth, (req, res) => {
    debug(req);
    debug(res);

    res.json({
      item: [
        {id: 'foo', url: 'https://www.youtube.com/watch?v=uPC9qMhAKjQ', title: 'Some Video'},
        {id: 'foo2', url: 'https://youtu.be/6UM28Ygkg1I', title: 'And another'},
      ],
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

"use strict";

var express = require('express');
var crypto = require('crypto');

module.exports = function(passport) {
    var router = express.Router();

    router.get('/login', (req, res, next) => {
        req.session.state = crypto.randomBytes(32).toString('hex');
        passport.authenticate('reddit', {
            state: req.session.state,
            duration: 'temporary'
        })(req, res, next);
    });

    router.get('/logout', (req, res, next) => {
        req.logout();
        res.redirect('/');
    });

    router.get('/callback', (req, res, next) => {
        if (req.query.state == req.session.state) {
            passport.authenticate('reddit', {
                successRedirect: '/',
                failureRedirect: '/401'
            })(req, res, next);
        } else {
            next(new Error(403));
        }
    });

    router.get('/', function(req, res, next) {
        if (!req.isAuthenticated()) {
            return res.redirect('/login');
        }

        res.render('index', {
            title: 'xeno.video'
        });
    });

    router.get('/401', function(req, res, next) {
        res.render('error', {
            message: 'You are not allowed to log in to this app.',
            error: {}
        });
    });

    // catch 404 and forward to error handler
    router.use(function(req, res, next) {
        var err = new Error('Not Found');
        err.status = 404;
        next(err);
    });

    return router;
};

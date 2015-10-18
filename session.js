var session  = require('express-session');
var RedisStore = require('connect-redis')(session);
var cookieParser = require('cookie-parser');
var RedditStrategy = require('passport-reddit').Strategy;
var passport = require('passport');
var _ = require('lodash');

module.exports = function(app, io) {
    passport.serializeUser(function(user, done) {
        done(null, user);
    });

    passport.deserializeUser(function(obj, done) {
        done(null, obj);
    });

    passport.use(new RedditStrategy({
        clientID:     process.env.REDDIT_CONSUMER_KEY,
        clientSecret: process.env.REDDIT_CONSUMER_SECRET,
        callbackURL:  process.env.HOST + "/callback"
    }, function(accessToken, refreshToken, profile, done) {
        console.log(profile);

        process.nextTick(function () {
            return done(null, profile);
        });
    }));

    var sessionInstance = session({
        name: 'xeno',
        secret: process.env.SESSION_SECRET,
        resave: false, // if true, saves unaltered sessions, possibly causing race conditions
        saveUninitialized: false,
        store: new RedisStore({
            host: process.env.REDIS_HOST,
            port: process.env.REDIS_PORT
        })
    });

    app.use(sessionInstance);
    app.use(passport.initialize());
    app.use(passport.session());

    io.use(function(socket, next) {
        sessionInstance(socket.request, socket.request.res, next);
    });

    io.on('connection', function(socket) {
        if (!_.get(socket, 'request.session.passport.user.id', false)) {
            console.log("Unauthenticated Socket.io client has been disconnected");
            socket.disconnect();
            return;
        }

        console.log("Authenticated Socket.io client connected");
    });

    return passport;
};

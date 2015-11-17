import libdebug from 'debug';
const debug = libdebug('xeno:stack');

export default (app, session, passport, router) => {
  app.use(session);
  app.use(passport.initialize());
  app.use(passport.session());
  app.use('/', router);

  return app;
};

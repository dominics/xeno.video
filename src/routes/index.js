import libdebug from 'debug';

const debug = libdebug('xeno:router');

function auth(req, res, next) {
  switch (res.locals.sessionValidation) {
    case 'refresh.first': // @todo Refresh tokens
    case 'refresh.proactive':
    case 'fail.access_token':
    case 'fail.session_age':
      req.logout();
      res.redirect('/login');
      res.end();
      return next('Failed session validation!, logging out');
    case 'fail.auth':
    case 'pass':
      return next();
    default:
      throw Error('Unexpected action from session strategy');
  }
}

export default (router) => {
  router.get('/', auth, (req, res) => {
    res.render('index', {
      title: 'xeno.video',
    });
  });

  router.get('/about', auth, (req, res) => {
    res.render('about', {
      title: 'about xeno.video',
    });
  });

  return router;
};

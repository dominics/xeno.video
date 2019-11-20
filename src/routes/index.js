import libdebug from 'debug';
const debug = libdebug('xeno:routes:index');

export default (sessionValidator, config) => (router) => {
  const auth = sessionValidator.interactive.bind(undefined, false); // auth not required

  const vars = (existing) => Object.assign({
    google_analytics_id: config.GOOGLE_ANALYTICS_ID
  }, existing);

  router.get('/', auth, (req, res) => {
    res.render('index', vars({
      title: 'xeno.video',
    }));
  });

  router.get('/about', (req, res) => {
    res.render('about', vars({
      title: 'about xeno.video',
    }));
  });

  return router;
};

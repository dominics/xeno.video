import libdebug from 'debug';
const debug = libdebug('xeno:routes:index');

export default (sessionValidator) => (router) => {
  const auth = sessionValidator.interactive.bind(undefined, false); // auth not required

  router.get('/', auth, (req, res) => {
    res.render('index', {
      title: 'xeno.video',
    });
  });

  router.get('/about', (req, res) => {
    res.render('about', {
      title: 'about xeno.video',
    });
  });

  return router;
};

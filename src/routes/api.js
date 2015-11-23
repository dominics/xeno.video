import validate from 'express-validation';
import * as validation from './../util/validation';
import libdebug from 'debug';

const debug = libdebug('xeno:routes:api');

function auth(req, res, next) {
  switch (res.locals.sessionValidation) {
    case 'refresh.first': // @todo Refresh tokens
    case 'refresh.proactive':
    case 'fail.access_token':
    case 'fail.session_age':
      res.sendStatus(401);
      res.end();
      return next('fail.session_age');
    case 'fail.auth':
    case 'pass':
      return next();
    default:
      throw Error('Unexpected action from session strategy');
  }
}

export default (router, settingStore, channelStore, itemStore) => {
  router.get('/setting/all', auth, (req, res, next) => {
    debug('Getting settings');

    if (!settingStore) {
      return next(new Error('Could not find setting store'));
    }

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

  router.get('/channel/all', auth, (req, res) => {
    // channelStore

    res.json({
      type: 'channel',
      data: [
        {id: 'videos', title: 'Videos'},
        {id: 'all', title: 'All'},
      ],
    });
  });
//
  router.get('/item/channel/:channel', auth, validate(validation.itemsForChannel), (req, res, next) => {
    debug('Getting items for ' + req.params.channel);

    const channel = req.params.channel;

    if (!itemStore) {
      return next(new Error('Could not find item store'));
    }

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

  return router;
};

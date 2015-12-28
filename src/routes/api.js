import validate from 'express-validation';
import * as validation from './../util/validation';
import libdebug from 'debug';

const debug = libdebug('xeno:routes:api');

export default (sessionValidator, store) => (router) => {
  const auth = sessionValidator.api.bind(undefined, false); // auth not required

  router.get('/api/setting/all', auth, (req, res, next) => {
    debug('Getting settings');

    if (!store.setting) {
      return next(new Error('Could not find setting store'));
    }

    const settings = store.setting.getAll(req);

    res.json({
      type: 'setting',
      data: settings,
    });

    res.end();
  });

  router.patch('/api/setting', auth, validate(validation.settingUpdate), (req, res, next) => {
    debug('Updating settings');

    if (!store.setting) {
      return next(new Error('Could not find setting store'));
    }

    const settings = store.setting.update(req);

    res.json({
      type: 'setting',
      updated: true,
      data: settings,
    });

    res.end();
  });

  router.get('/api/channel/all', auth, (req, res, next) => {
    if (!store.channel) {
      return next(new Error('Could not find channel store'));
    }

    store.channel.getAll(req, res)
      .then(channels => {
        debug('Got as channels', channels);

        res.json({
          type: 'channel',
          data: channels,
        });

        res.end();
      })
      .catch(err => next(err));
  });

  router.get('/api/item/channel/:channel', auth, validate(validation.itemsForChannel), (req, res, next) => {
    debug('Getting items for ' + req.params.channel);

    const channel = req.params.channel;

    if (!store.item) {
      return next(new Error('Could not find item store'));
    }

    store.item.getByChannel(channel, req, res)
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

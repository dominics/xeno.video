import validate from 'express-validation';
import * as validation from './../util/validation';
import libdebug from 'debug';

const debug = libdebug('xeno:routes:api');

export default (sessionValidator, settingStore, channelStore, itemStore) => (router) => {
  const auth = sessionValidator.api.bind(undefined, false); // auth not required

  router.get('/api/setting/all', auth, (req, res, next) => {
    debug('Getting settings');

    if (!settingStore) {
      return next(new Error('Could not find setting store'));
    }

    const settings = settingStore.getAll(req);

    res.json({
      type: 'setting',
      data: settings,
    });

    res.end();
  });

  router.patch('/api/setting', auth, validate(validation.settingUpdate), (req, res, next) => {
    debug('Updating settings');

    if (!settingStore) {
      return next(new Error('Could not find setting store'));
    }

    const settings = settingStore.update(req);

    res.json({
      type: 'setting',
      updated: true,
      data: settings,
    });

    res.end();
  });

  router.get('/api/channel/all', auth, (req, res) => {
    // channelStore

    res.json({
      type: 'channel',
      data: [
        {id: 'videos', title: 'Videos'},
        {id: 'aww', title: 'Aww'},
        {id: 'music', title: 'Music'},
        {id: 'deepintoyoutube', title: 'DeepIntoYouTube'},
        {id: 'all', title: 'All'},
      ],
    });
  });

  router.get('/api/item/channel/:channel', auth, validate(validation.itemsForChannel), (req, res, next) => {
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

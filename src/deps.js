import libdebug from 'debug';
import Bottle from 'bottlejs';
import socket from 'socket.io';
import express from 'express';
import redisCache from 'express-redis-cache';

import config from './config';
import app from './app';
import emitter from './emitter';
import server from './server';
import passport from './passport';
import redis from './redis';

import Api from './reddit/Api';

import storeChannel from './reddit/ChannelStore';
import storeItem from './reddit/ItemStore';
import storeSetting from './setting/SettingStore';

import routeIndex from './routes/index';
import routeUser from './routes/user';
import routeApi from './routes/api';
import routeError from './routes/error';

const debug = libdebug('xeno:deps');

const deps = Bottle.pop('main');

deps.service('config', config);

deps.service('api', Api, 'config');
deps.service('redis', redis, 'config');
deps.service('app', app, 'config');

deps.service('server', server, 'config', 'app');

deps.service('io', socket, 'server');

deps.service('passport', passport, 'config', 'app', 'io', 'redis');
deps.service('emitter', emitter, 'config', 'io');

deps.service('storeChannel', storeChannel, 'api', 'redis');
deps.service('storeItem', storeItem, 'api', 'redis');
deps.service('storeSetting', storeSetting, 'api', 'redis');

deps.service('router.root', (passport, settingStore, channelStore, itemStore) => {
  const router = express.Router();

  // Mount root routes
  routeIndex(router);
  routeUser(router, passport);
  routeApi(
    router,
    settingStore,
    channelStore,
    itemStore
  );
  routeError(router);

  return router;
}, 'passport', 'storeSetting', 'storeChannel', 'storeItem');

export default deps;

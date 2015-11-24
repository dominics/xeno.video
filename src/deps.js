import libdebug from 'debug';
import Bottle from 'bottlejs';
import socket from 'socket.io';
import express from 'express';

import config from './config';
import app from './app';
import emitter from './emitter';
import server from './server';
import redis from './redis';
import stack from './stack';
import queue from './queue';

import session from './session';
import passport from './passport';

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

deps.service('api', Api);
deps.service('redis', redis, 'config');
deps.service('app', app, 'config');

deps.service('session', session, 'config', 'redis');
deps.service('passport', passport, 'config');

deps.service('store.setting', storeSetting, 'api', 'redis');
deps.service('store.channel', storeChannel, 'api', 'redis');
deps.service('store.item', storeItem, 'api', 'redis', 'queue.itemByChannel');

deps.service('route.index', routeIndex);
deps.service('route.user', routeUser, 'passport');
deps.service('route.api', routeApi, 'store.setting', 'store.channel', 'store.item');
deps.service('route.error', routeError);

deps.service('queue.factory', queue, 'config');

deps.factory('queue.itemByChannel', (container) => {
  return container.factory('item:by-channel');
});

deps.service('router', () => {
  const router = express.Router();

  deps.digest([
    'route.index',
    'route.user',
    'route.api',
    'route.error',
  ]).forEach((route) => {
    route(router);
  });

  return router;
});

deps.service('stack', stack, 'app', 'session', 'passport', 'router');

deps.service('server', server, 'config', 'stack');
deps.service('socket', socket, 'server');
deps.service('emitter', emitter, 'config', 'socket', 'session');

deps.factory('shutdown', (container) => () => {
  container.redis.unref();
  container.queue.itemByChannel.close();
}, 'redis', 'queue');

export default deps;

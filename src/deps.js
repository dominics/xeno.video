import libdebug from 'debug';
import Bottle from 'bottlejs';
import socket from 'socket.io';
import express from 'express';

import yargs from './cli/yargs';
import prewarm from './cli/prewarm';
import {default as log, Log as LogSettings} from './util/log';

import config from './config';
import app from './app';
import emitter from './emitter';
import server from './server';
import redis from './redis';
import stack from './stack';
import queue from './queue';

import sessionStore from './session/store';
import session from './session/session';
import passport from './session/passport';
import refresh from './session/refresh';
import strategy from './session/strategy';
import validator from './session/validator';

import Api from './reddit/Api';

import storeChannel from './reddit/ChannelStore';
import storeItem from './reddit/ItemStore';
import storeSetting from './setting/SettingStore';

import routeIndex from './routes/index';
import routeUser from './routes/user';
import routeApi from './routes/api';
import routeError from './routes/error';

export default (configInstance = null) => {
  const deps = new Bottle();

  if (configInstance !== null) {
    deps.constant('config', configInstance); // A direct config instance was passed
  } else {
    deps.service('config', config); // Lazily discover the configuration when it's needed
  }

  deps.service('api', Api);
  deps.service('redis', redis, 'config');
  deps.service('app', app, 'config');

  deps.service('session.store', sessionStore, 'redis');
  deps.service('session.session', session, 'config', 'session.store');
  deps.service('session.passport', passport, 'session.strategy');
  deps.service('session.refresh', refresh, 'session.strategy');
  deps.service('session.strategy', strategy, 'config');
  deps.service('session.validator', validator, 'session.refresh');

  deps.service('store.setting', storeSetting, 'api', 'redis');
  deps.service('store.channel', storeChannel, 'api', 'redis', 'session.validator', 'session.store', 'queue.channelsForUser');
  deps.service('store.item', storeItem, 'api', 'redis', 'session.validator', 'queue.itemByChannel');

  deps.service('route.index', routeIndex, 'session.validator');
  deps.service('route.user', routeUser, 'config', 'session.passport');
  deps.service('route.api', routeApi, 'session.validator', 'store.setting', 'store.channel', 'store.item');
  deps.service('route.error', routeError);

  deps.service('queue.factory', queue, 'config');

  deps.factory('queue.itemByChannel', (container) => {
    return container.factory('item:by-channel');
  });

  deps.factory('queue.channelsForUser', (container) => {
    return container.factory('channel:for-user');
  });

  deps.service('cli.argv', yargs, 'config');

  deps.service('cli.log', (argv) => {
    log.debug('Received command line arguments', argv);
    return log;
  }, 'cli.argv');

  deps.service('cli.logSettings', (argv) => {
    LogSettings.setLevel(2 + argv.verbose - argv.quiet);
    return LogSettings;
  }, 'cli.argv');

  deps.service('command.prewarm', prewarm, 'config', 'cli.argv', 'cli.log', 'session.refresh', 'queue.itemByChannel');

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

  deps.service('stack', stack, 'app', 'session.session', 'session.passport', 'router');

  deps.service('server', server, 'config', 'stack');
  deps.service('socket', socket, 'server');
  deps.service('emitter', emitter, 'config', 'socket', 'session.session');

  deps.factory('shutdown', (container) => () => {
    container.redis.unref();
    container.queue.itemByChannel.close();
  }, 'redis', 'queue');

  return deps;
};

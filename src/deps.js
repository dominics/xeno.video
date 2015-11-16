import libdebug from 'debug';
import Bottle from 'bottlejs';
import redis from 'redis';
import Promise from 'bluebird';
import socket from 'socket.io';
import config from './config';
import Api from './reddit/Api';
import app from './app';
import ChannelStore from './reddit/ChannelStore';
import ItemStore from './reddit/ItemStore';
import SettingStore from './setting/SettingStore';
import indexRouter from './routes/index';
import emitter from './emitter';
import server from './server';
import session from './session';

Promise.promisifyAll(redis.RedisClient.prototype);
Promise.promisifyAll(redis.Multi.prototype);

const debug = libdebug('xeno:deps');
export let active = null;

export default () => {
  const deps = new Bottle();

  deps.service('redis', () => {
    const redisConnection = redis.createClient(
      parseInt(process.env.REDIS_PORT, 10),
      process.env.REDIS_HOST,
      {}
    );

    redisConnection.on('error', (err) => {
      debug(err);
    });

    return redisConnection;
  });

  deps.service('config', config);
  deps.service('app', app, 'config');
  deps.service('api', Api);
  deps.service('server', server, 'app', 'config');
  deps.service('io', socket, 'server');
  deps.service('passport', session, 'app', 'io', 'redis');

  deps.service('store.channel', ChannelStore, 'api', 'redis');
  deps.service('store.item', ItemStore, 'api', 'redis');
  deps.service('store.setting', SettingStore, 'api', 'redis');

  deps.service('router.index', indexRouter, 'app', 'passport');

  deps.service('emitter', emitter, 'app');

  active = deps;
  return deps;
};

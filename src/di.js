import libdebug from 'debug';
import Bottle from 'bottle';
import redis from 'redis';
import config from './config';
import Api from './reddit/Api';
import app from './app';
import ChannelStore from './reddit/ChannelStore';
import ItemStore from './reddit/ItemStore';
import SettingStore from './setting/SettingStore';
import server from './server';
import session from './session';
import emitter from './emitter';

Promise.promisifyAll(redis.RedisClient.prototype);
Promise.promisifyAll(redis.Multi.prototype);

const debug = libdebug('xeno:di');

const di = new Bottle();

di.service('redis', () => {
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

di.service('config', config);
di.service('app', app);
di.service('api', Api);
di.service('server', server, 'app');
di.service('io', socket, 'server');
di.service('passport', session, 'app', 'io', 'redis');

di.service('store.channel', ChannelStore, 'api', 'redis');
di.service('store.item', ItemStore, 'api', 'redis');
di.service('store.setting', SettingStore, 'api', 'redis');

di.service('router.index', indexRouter, 'app', 'passport');

di.service('emitter', emitter, 'app');

export default di;

import redis from 'redis';
import Promise from 'bluebird';
import libdebug from 'debug';

const debug = libdebug('xeno:redis');

Promise.promisifyAll(redis.RedisClient.prototype);
Promise.promisifyAll(redis.Multi.prototype);

export default (config) => {
  const client = redis.createClient(
    {
      host: config.REDIS_HOST,
      port: parseInt(config.REDIS_PORT, 10),
      return_buffers: true,
    }
  );

  client.on('error', (err) => {
    debug(err);
  });

  return client;
};

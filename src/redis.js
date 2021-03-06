import redis from 'redis';
import Promise from 'bluebird';
import libdebug from 'debug';

const debug = libdebug('xeno:redis');

Promise.promisifyAll(redis.RedisClient.prototype);
Promise.promisifyAll(redis.Multi.prototype);

export default (config) => {
  const client = redis.createClient(
    parseInt(config.REDIS_PORT, 10),
    config.REDIS_HOST,
    {}
  );

  client.on('error', (err) => {
    debug(err);
  });

  return client;
};

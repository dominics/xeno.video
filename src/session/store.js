import session from 'express-session';
import store from 'connect-redis';
import Promise from 'bluebird'; //

const RedisStore = store(session);
Promise.promisifyAll(RedisStore.prototype);

const SESSION_STORE_TTL = 7 * 24 * 60 * 60;

export default (redis) => {
  return new RedisStore({
    client: redis,
    prefix: 'xeno/session:',
    ttl: SESSION_STORE_TTL,
  });
};

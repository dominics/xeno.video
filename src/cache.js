import redisCache from 'express-redis-cache';

export default (key, expire, redis) => redisCache({
  client: redis,
  expire: expire,
  prefix: key,
});

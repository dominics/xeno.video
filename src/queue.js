const Queue = require('bull');

export default (name) => {
  return Queue(
    name,
    process.env.REDIS_PORT,
    process.env.REDIS_HOST
  );
};

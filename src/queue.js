import Queue from 'bull';

export default (config) => {
  return (name) => {
    return Queue(
      name,
      config.REDIS_PORT,
      config.REDIS_HOST
    );
  };
};

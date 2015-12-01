import Promise from 'bluebird';

const CLEAN_GRACE_PERIOD = 3600000; // ms

export default (config, argv, log, queues) => {
  /**
   * @param {Queue} queue
   * @param {string} name
   * @returns {Promise.<T>}
   */
  function cleanQueue(queue, name) {
    return Promise.all([
      queue.clean(CLEAN_GRACE_PERIOD, 'completed'),
      queue.clean(CLEAN_GRACE_PERIOD, 'waiting'),
      queue.clean(CLEAN_GRACE_PERIOD, 'active'),
      queue.clean(CLEAN_GRACE_PERIOD, 'delayed'),
      queue.clean(CLEAN_GRACE_PERIOD, 'failed'),
    ]).then(() => {
      log.info('Cleared queue: ' + name);
      return Promise.resolve();
    });
  }

  return () => {
    log.info('Starting clean');

    return Promise.all([
      cleanQueue(queues.itemByChannel, 'item-by-channel'),
      cleanQueue(queues.channelsForUser, 'channels-for-user'),
    ]).catch((err) => {
      log.error(err);
      return Promise.reject(err);
    });
  };
};

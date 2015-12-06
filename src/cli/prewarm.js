import Promise from 'bluebird';

export default (config, argv, log, itemByChannelQueue) => {
  function prewarmChannel(channel, accessToken) {
    if (!accessToken) {
      return Promise.reject('No access token given');
    }

    return itemByChannelQueue.add({
      channel: channel,
      token: accessToken,
    }, {
      delay: 100,
      attempts: 3,
      backoff: {
        type: 'exponential',
        delay: 10000,
      },
      timeout: 20000,
    }).then(() => {
      log.debug('Finished prewarming channel', channel);
    });
  }

  return () => {
    log.info('Starting prewarm process');

    let token = null;

    return Promise.all([
      prewarmChannel('videos', token),
    ]);
  };
};

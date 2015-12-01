import Promise from 'bluebird';

export default (config, argv, log, refresh, itemByChannelQueue) => {
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
      log.info('Enqueued prewarm of channel', channel);
    });
  }

  return () => {
    log.info('Starting prewarm');

    const refreshToken = config.REDDIT_DEFAULT_REFRESH_TOKEN;

    if (!refreshToken) {
      return Promise.reject(new Error('No refresh token found'));
    }

    return new Promise((resolve, reject) => {
      refresh.requestNewAccessToken('reddit', refreshToken, (err, accessToken) => {
        if (err) {
          log.error('Failed to get new access token', err);
          return reject(new Error(err));
        }

        return resolve(accessToken);
      });
    }).then((token) => {
      return Promise.all([
        prewarmChannel('videos', token),
        prewarmChannel('aww', token),
        prewarmChannel('music', token),
        prewarmChannel('deepintoyoutube', token),
        prewarmChannel('all', token),
      ]);
    });
  };
};

import Store from './../reddit/Store';
import Promise from 'bluebird';
import libdebug from 'debug';
const debug = libdebug('xeno:store:item');
const workerLog = libdebug('xeno:store:item:worker');

export default class ChannelStore extends Store {
  /**
   * @type {RedisStore}
   */
  sessionStore = null;

  /**
   * We can afford to be generous (low) here, because these
   * requests are only made by authenticated users
   *
   * @type {number} seconds
   */
  static CACHE_TTL_CHANNELS = 600;

  constructor(api, redis, validator, queues, sessionStore) {
    super(api, redis, validator, queues);

    this.type = 'channel';
    this.sessionStore = sessionStore;
    this.queues.channelsForUser.process(this.processChannelsForUser.bind(this));
  }

  getAll(req, res) {
    return this.ensureAuthenticated(req, ChannelStore.getDefaults())
      .then(() => {
        const now = Math.floor(Date.now() / 1000);
        const refreshed = req.session.channelsRefreshed;

        if (refreshed && refreshed > (now - ChannelStore.CACHE_TTL_CHANNELS)) {
          debug('Skipped API refresh because of cool-down: ', refreshed - (now - ChannelStore.CACHE_TTL_CHANNELS));
          return Promise.resolve();
        }

        return this.queues.channelsForUser.add({
          id: req.sessionID,
          token: req.session.passport.user.accessToken,
        }, {
          attempts: 3,
          backoff: {
            type: 'exponential',
            delay: 10000,
          },
          timeout: 30000,
        })
      })
      .then((queued) => {
        const channels = (typeof req.session.channels === 'object')
          ? req.session.channels
          : ChannelStore.getDefaults();

        return Promise.resolve(channels);
      })
      .catch(err => {
        debug('Got error, resolving to default', err);
        return Promise.resolve(ChannelStore.getDefaults());
      });
  }

  processChannelsForUser(job) {
    const {id, token} = job.data;

    if (!id || !token) {
      throw new Error('You must provide a session ID and token in job data');
    }

    return this.sessionStore.getAsync(id)
      .then((session) => {
        return Promise.join(
          this.api.subscribed(),
          this.api.meta(),
          (subscribed, meta) => {
            debug('Got subscribed', subscribed);
            debug('Got meta', meta);
            return Promise.resolve([{id:'music', title: 'Music'}]);
          }
        )
      })
      .then((channels) => {
        debug('Got merged channels, saving', channels);
        session.channels = channels;
        session.channelsRefreshed = Date.now() / 1000;

        return this.sessionStore.setAsync(id, session);
      });
  }

  /**
   * @returns {{id: string, title: string}[]}
   */
  static getDefaults() {
    return [
      { id: 'videos', title: 'Videos' },
      { id: 'aww', title: 'Aww' },
      { id: 'music', title: 'Music' },
      { id: 'deepintoyoutube', title: 'DeepIntoYouTube' },
      { id: 'all', title: 'All' },
    ];
  }
}

import Store from './Store';
import Promise from 'bluebird';
import libdebug from 'debug';
const debug = libdebug('xeno:store:item');
const workerLog = libdebug('xeno:store:item:worker');

export default class ChannelStore extends Store {
  /**
   * @type {{channelsForUser: Queue}}
   */
  queues = {};
  validator = null;
  sessionStore = null;

  /**
   * We can afford to be generous (low) here, because these
   * requests are only made by authenticated users
   *
   * @type {number} seconds
   */
  static CACHE_TTL_CHANNELS = 600;

  constructor(api, redis, validator, sessionStore, queueChannelsForUser) {
    super(api, redis);

    this.type = 'channel';
    this.validator = validator;
    this.sessionStore = sessionStore;
    this.queues.channelsForUser = queueChannelsForUser;
    this.queues.channelsForUser.process(this.processChannelsForUser.bind(this));
  }

  getAll(req, res) {
    return this.validator.validate(true, req)
      .then(() => {
        const now = Math.floor(Date.now() / 1000);
        const refreshed = req.session.channelsRefreshed;

        if (refreshed && refreshed > (now - ChannelStore.CACHE_TTL_CHANNELS)) {
          debug('Skipped API refresh because of cool-down: ', val - (now - ChannelStore.CACHE_TTL_CHANNELS));
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
          : this.getDefaults();

        return Promise.resolve(channels);
      })
      .catch(err => {
        debug('Got error, resolving to default', err);

        if (err) {
          console.error(err.stack);
        }

        return Promise.resolve(this.getDefaults());
      });
  }

  processChannelsForUser(job) {
    const {id, token} = job.data;

    if (!id || !token) {
      throw new Error('You must provide a session ID and token in job data');
    }

    const getSession = this.sessionStore.getAsync(id)
      .then(session => {
        workerLog('Got session', session);
      })
      .catch(err => {
        workerLog('Error getting session', err);
        console.err(err.trace);
      });

    return Promise.resolve();
  }

  getDefaults() {
    return [
      { id: 'videos', title: 'Videos' },
      { id: 'aww', title: 'Aww' },
      { id: 'music', title: 'Music' },
      { id: 'deepintoyoutube', title: 'DeepIntoYouTube' },
      { id: 'all', title: 'All' },
    ];
  }
}

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

  /**
   * We can afford to be generous (low) here, because these
   * requests are only made by authenticated users
   *
   * @type {number} seconds
   */
  static CACHE_TTL_CHANNELS = 600;

  constructor(api, redis, validator, session, queueChannelsForUser) {
    super(api, redis);

    this.type = 'channel';
    this.validator = validator;
    this.session = session;
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
    workerLog('Background worker, received processChannelsForUser', job.data);

    workerLog(this.session);


    return Promise.resolve([{ id: 'aww', title: 'Aww' }]);
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

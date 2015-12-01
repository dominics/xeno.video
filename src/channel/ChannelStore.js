import Store from './../reddit/Store';
import Promise from 'bluebird';
import libdebug from 'debug';

const debug = libdebug('xeno:store:channel');
const workerLog = libdebug('xeno:store:channel:worker');

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

  getFromSession(req) {
    if (!req.session || typeof req.session.channels !== 'object') {
      return Promise.reject('No channels found in session');
    }

    return Promise.resolve(req.session.channels);
  }

  getAll(req, res) {
    debug('Getting all channels for user');

    return this.ensureAuthenticated(req, ChannelStore.getDefaults())
      .then(() => this.enqueueChannelsForUser(req))
      .then(() => this.getFromSession(req))
      .catch(err => {
        debug('Got error, resolving to default', err);
        return Promise.resolve({
          subscribed: [],
          multis: [],
          defaults: ChannelStore.getDefaults(),
        });
      });
  }

  enqueueChannelsForUser(req) {
    debug('Enqueuing update of channels for user');
    const now = Math.floor(Date.now() / 1000);
    const refreshed = req.session.channelsRefreshed;

    if (false && refreshed && refreshed > (now - ChannelStore.CACHE_TTL_CHANNELS)) {
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
  }

  processChannelsForUser(job) {
    workerLog('Processing channels for user in background');

    const {id, token} = job.data;

    if (!id || !token) {
      throw new Error('You must provide a session ID and token in job data');
    }

    return this.sessionStore.getAsync(id)
      .then((session) => {
        workerLog('Got session for id', id);
        return this.getFromApi(session.passport.user.accessToken)
          .then((subscriptions) => {
            return this.saveToSession(id, session, subscriptions)
              .then(() => Promise.resolve(subscriptions))
          });
      })
      .catch((err) => {
        workerLog('Error processing channels for user', err);

        if (err instanceof Error) {
          console.error(err.stack);
        }

        return Promise.reject(err);
      });
  }

  saveToSession(id, session, subscriptions) {
    workerLog('Got subscribed channels, saving to session');

    session.channels = subscriptions;
    session.channelsRefreshed = Math.floor(Date.now() / 1000);

    return this.sessionStore.setAsync(id, session)
      .then(() => {
        debug('Saved to session');
      });
  }

  getFromApi(token) {
    workerLog('Getting subscription details from API');

    this.api.setToken(token);

    return Promise.join(
      this.api.subscribed(),
      this.api.multis(),
      (subscribed, multis) => {
        return Promise.resolve({
          subscribed,
          multis,
          defaults: ChannelStore.getDefaults(),
        });
      }
    );
  }

  /**
   * @returns {{id: string}[]}
   */
  static getDefaults() {
    return [
      { id: 'videos' },
      { id: 'aww' },
      { id: 'music' },
      { id: 'deepintoyoutube' },
      { id: 'all' },
    ];
  }
}

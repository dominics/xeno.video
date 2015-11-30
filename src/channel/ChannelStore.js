import Store from './../reddit/Store';
import Promise from 'bluebird';
import libdebug from 'debug';

const debug = libdebug('xeno:store:channel');

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
    this.log = libdebug('xeno:store:channel');
  }

  getFromSession(req) {
    this.log('Getting existing channels from session');

    return (typeof req.session.channels === 'object')
      ? Promise.resolve(req.session.channels)
      : Promise.resolve(ChannelStore.getDefaults());
  }

  getAll(req, res) {
    this.log('Getting all channels for user');

    return this.ensureAuthenticated(req, ChannelStore.getDefaults())
      .then(() => this.enqueueChannelsForUser(req))
      .then(() => this.getFromSession(req))
      .catch(err => {
        debug('Got error, resolving to default', err);

        if (err instanceof Error && err.message !== 'fail.auth') {
          console.error(err.trace);
        }

        return Promise.resolve(ChannelStore.getDefaults());
      });
  }

  enqueueChannelsForUser(req) {
    this.log('Enqueuing update of channels for user');

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
    this.log = libdebug('xeno:store:channel:worker');
    this.log('Processing channels for user in background');

    const {id, token} = job.data;

    if (!id || !token) {
      throw new Error('You must provide a session ID and token in job data');
    }

    return this.sessionStore.getAsync(id)
      .then((session) => {
        this.log('Got session for id', id);
        return this.getFromApi(session.passport.user.accessToken)
          .then((channels) => {
            this.log('Got channels from API', channels)
            return this.saveToSession(id, session, channels)
              .then(() => Promise.resolve(channels))
          })
      })
      .catch((err) => {
        this.log('Error processing channels for user', err);
        console.error(err);
        throw err;
      });
  }

  saveToSession(id, session, channels) {
    this.log('Got merged channels, saving', channels);

    session.channels = channels;
    session.channelsRefreshed = Date.now() / 1000;

    return this.sessionStore.setAsync(id, session);
  }

  getFromApi(token) {
    this.log('Getting subscription details from API');

    this.api.setToken(token);

    return Promise.join(
      this.api.subscribed(),
      this.api.meta(),
      (subscribed, meta) => {
        this.log('Got subscribed', subscribed);
        this.log('Got meta', meta);

        return Promise.resolve([{id:'music', title: 'Music'}]);
      }
    );
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

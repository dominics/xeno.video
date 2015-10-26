import Store from './Store';
const debug = require('debug');
const Queue = require('../queue');
const Promise = require('bluebird');

const log = debug('xeno:store:item');
const workerLog = debug('xeno:store:item:worker');

export default class ItemStore extends Store {
  name = 'item';

  queues = {};

  constructor(api, redis) {
    super(api, redis);

    this.queues.byChannel = Queue('item:by-channel');
    this.queues.byChannel.process(this.processGetByChannel.bind(this));
  }

  getByChannel(channel, req, next) {
    log('Getting items by channel', channel);

    const promiseQueue = this.queues.byChannel.add({
      channel: channel,
      token: req.redditToken,
    });

    const promiseCache = this.redis.zrangeAsync(
      this._key('by-channel', channel), 0, 100
    );

    Promise.all([promiseQueue, promiseCache])
      .then((results) => {
        const keys = results[1].map((v) => {
          return this._key('item', v);
        });

        this.redis.mgetAsync(keys).then((items) => {
          const objects = items.map((json) => {
            return JSON.parse(json);
          });

          next(null, objects);
        }).catch((err) => {
          debug('mget err', err);
          return next(err, []);
        });
      })
      .catch((err) => {
        debug(err);
        return next(err, []);
      });
  }

  processGetByChannel(job, done) {
    const channel = job.data.channel;
    const token = job.data.token;

    if (!channel || !token) {
      return done(new Error('You must provide a channel and token in job data'));
    }

    const keyLock = this._key('channel-lock', channel);

    this.redis.getAsync(keyLock).then(
      (val) => {
        if (val) {
          return done(null, 'Rejected because of cool-down lock: ', val);
        }

        this._processGetByChannel(channel, token, done);
        this.redis.set(keyLock, 'yup', 'EX', 60);
      }
    );
  }

  _processGetByChannel(channel, token, done) {
    const keySet = this._key('by-channel', channel);

    workerLog(`Getting items for ${channel} using ${token}`);

    this.api.setToken(token);
    this.api.listing(channel, 'hot', (err, items) => {
      if (err) {
        workerLog(err);
        return done(err);
      }

      let i = 0;

      items.forEach((rawItem) => {
        const item = this.transform(rawItem);
        const keyItem = this._key('item', item.id);

        workerLog('Storing item', item, keyItem, keySet);

        this.redis.set(keyItem, JSON.stringify(item));
        this.redis.zadd(keySet, i++, item.id);
      });

      // @todo clear to end of list

      done();
    });
  }

  _key(type, param = null) {
    if (param) {
      return `item-store/${type}:${param}`;
    }

    return `item-store/${type}`;
  }

  transform(item) {
    return item.data;
  }
}

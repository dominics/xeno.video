import libdebug from 'debug';

import Store from './Store';
import { mapSchema } from './../util';

const Queue = require('../queue');
import Promise from 'bluebird';
const debug = libdebug('xeno:store:item');
const workerLog = libdebug('xeno:store:item:worker');

export default class ItemStore extends Store {
  queues = {};

  static CACHE_TTL_ITEMS = 60 * 60 * 24;
  static CACHE_TTL_CHANNEL_ITEMS = 300;

  constructor(api, redis) {
    super(api, redis);

    this.name = 'item';

    this.queues.byChannel = Queue('item:by-channel');
    this.queues.byChannel.process(this.processGetByChannel.bind(this));
  }

  /**
   *
   * @param channel
   * @param req
   * @param next
   * @return Promise.<Array.<Object>>
   */
  getByChannel(channel, req, next) {
    debug('Getting items by channel', channel);

    const addToQueue = this.queues.byChannel.add({
      channel: channel,
      token: req.redditToken,
    }, {
      delay: 100,
      attempts: 3,
      backoff: {
        type: 'exponential',
        delay: 10000,
      },
      timeout: 20000,
    });

    const getFromDb = this.redis.lrangeAsync(
      this._key('by-channel', channel), 0, 100
    );

    return Promise.join(addToQueue, getFromDb, (queue, ids) => {
      if (!ids || !ids.length) {
        return next(null, []);
      }

      const keys = ids.map((v) => {
        return this._key('item', v);
      });

      return this.redis.mgetAsync(keys).then((items) => {
        return Promise.resolve(items.map((json) => {
          return JSON.parse(json);
        }));
      });
    });
  }

  /**
   * @param job
   * @returns Promise.<Array>
   */
  processGetByChannel(job) {
    const channel = job.data.channel;
    const token = job.data.token;

    if (!channel || !token) {
      throw new Error('You must provide a channel and token in job data');
    }

    const keyRefreshed = this._key('channel-refreshed', channel);

    return this.redis.getAsync(keyRefreshed).then(
      (val) => {
        const now = Math.floor(Date.now() / 1000);

        if (val && val > (now - ItemStore.CACHE_TTL_CHANNEL_ITEMS) && false) {
          debug('Skipped API refresh because of cool-down: ', val - (now - ItemStore.CACHE_TTL_CHANNEL_ITEMS));
          return Promise.resolve();
        }

        return this._processGetByChannel(channel, token)
          .then((results) => {
            debug(`Stored ${results.length} items, setting refresh key to ${now}`);
            return this.redis.setAsync(keyRefreshed, now, 'EX', 3 * ItemStore.CACHE_TTL_CHANNEL_ITEMS);
          });
      }
    ).catch((err) => {
        debug(err);
        return Promise.reject(err);
      });
  }

  _processGetByChannel(channel, token) {
    const keyList = this._key('by-channel', channel);
    workerLog(`Getting items for ${channel} using ${token}`);

    this.api.setToken(token);

    return this.api.listing(channel, 'hot').then((items) => {
      return this.prepareList(keyList).then((listLength) => {
        const mapped = items
          .filter((item) => {
            return (
              typeof item.data.media_embed === 'object'
              && typeof item.data.media_embed.content === 'string'
            );
          })
          .map(item => item.data)
          .map(item => {
            const view = mapSchema(item, {
              id: true,
              title: true,
              url: true,
              num_comments: true,
              score: true,
              author: true,
              created_utc: true,
              over_18: true,
              embed: 'media_embed',
            });

            view.thumbnail = this._thumbnail(item);
            view.embed = this._embed(item);

            return view;
          });

        return Promise.each(mapped, (item, index) => {
          return this.redis.setAsync(this._key('item', item.id), JSON.stringify(item), 'EX', ItemStore.CACHE_TTL_ITEMS)
            .then(() => (
              index >= listLength
                ? this.redis.rpushAsync(keyList, item.id)
                : this.redis.lsetAsync(keyList, index, item.id)
            ));
        });
      });
    });
  }

  _embed(item) {
    return item.media_embed;
  }

  _thumbnail(item) {
    const details = {};

    if (typeof item.thumbnail === 'string' && item.thumbnail !== 'nsfw') {
      details.url = item.thumbnail;
    }

    if (typeof item.media.oembed === 'object') {
      for (let prop of Object.keys(item.media.oembed)) {  // eslint-disable-line prefer-const
        const matches = prop.match(/^thumbnail_(.*)/);

        if (matches) {
          details[matches[1]] = item.media.oembed[prop];
        }
      }
    }

    return details;
  }
}

import libdebug from "debug";

import Promise from "bluebird";
import Store from "../reddit/Store";

const debug = libdebug("xeno:store:item");
const workerLog = libdebug("xeno:store:item:worker");

function mapSchema(obj, schema) {
  const mapped = {};

  for (const name of Object.keys(schema)) {
    const key = schema[name] === true ? name : schema[name];
    mapped[name] = typeof obj[key] !== "undefined" ? obj[key] : null;
  }

  return mapped;
}

export default class ItemStore extends Store {
  static CACHE_TTL_ITEMS = 60 * 60 * 24;

  static CACHE_TTL_CHANNEL_ITEMS = 300;

  constructor(api, redis, validator, queues) {
    super(api, redis, validator, queues);

    this.type = "item";
    this.queues.itemByChannel.process(this.processGetByChannel.bind(this));
  }

  /**
   * @param channel
   * @param req
   * @param res
   * @return Promise.<Array.<Object>>
   */
  getByChannel(channel, req, res) {
    debug("Getting items by channel", channel);

    const addToQueue = this.validator
      .validate(true, req)
      .then(() => this.queues.itemByChannel.add(
          {
            channel,
            token: req.session.passport.user.accessToken,
          },
          {
            attempts: 3,
            backoff: {
              type: "exponential",
              delay: 10000,
            },
            timeout: 30000,
          }
        ))
      .catch((err) => Promise.resolve(
          `Skipping enqueue because not fully authenticated: ${  err}`
        ));

    const getFromDb = this.redis.lrangeAsync(
      this._key("by-channel", channel),
      0,
      60 // todo slicing
    );

    return Promise.join(addToQueue, getFromDb, (queue, ids) => {
      if (!ids || !ids.length) {
        return Promise.resolve([]);
      }

      const keys = ids.map((v) => this._key("item", v));

      return this.redis.mgetAsync(keys).then((items) => Promise.resolve(
          items.map((json) => JSON.parse(json))
        ));
    });
  }

  /**
   * @param job
   * @returns Promise.<Array>
   */
  processGetByChannel(job) {
    const {channel} = job.data;
    const {token} = job.data;

    if (!channel || !token) {
      throw new Error("You must provide a channel and token in job data");
    }

    const keyRefreshed = this._key("channel-refreshed", channel);

    return this.redis
      .getAsync(keyRefreshed)
      .then((val) => {
        const now = Math.floor(Date.now() / 1000);

        if (val && val > now - ItemStore.CACHE_TTL_CHANNEL_ITEMS) {
          debug(
            "Skipped API refresh because of cool-down: ",
            val - (now - ItemStore.CACHE_TTL_CHANNEL_ITEMS)
          );
          return Promise.resolve();
        }

        debug(`Getting items for ${channel} in background...`);
        return this._processGetByChannel(channel, token).then((results) => {
          debug(
            `Stored ${results.length} items, setting refresh key to ${now}`
          );
          return this.redis.setAsync(
            keyRefreshed,
            now,
            "EX",
            3 * ItemStore.CACHE_TTL_CHANNEL_ITEMS
          );
        });
      })
      .catch((err) => {
        debug(err);
        return Promise.reject(err);
      });
  }

  _processGetByChannel(channel, token) {
    const keyList = this._key("by-channel", channel);
    workerLog(`Getting items for ${channel} using ${token}`);

    this.api.setToken(token);

    return this.api.subreddit(channel, "hot").then((items) => this.prepareList(keyList).then((listLength) => {
        const mapped = items
          .filter((item) => (
              typeof item.data.media_embed === "object" &&
              typeof item.data.media_embed.content === "string"
            ))
          .map((item) => item.data)
          .map((item) => {
            const view = mapSchema(item, {
              id: true,
              title: true,
              url: true,
              num_comments: true,
              score: true,
              author: true,
              created_utc: true,
              over_18: true,
              permalink: true,
              embed: "media_embed",
            });

            view.thumbnail = ItemStore.thumbnail(item);
            view.embed = ItemStore.embed(item);

            return view;
          });

        return Promise.each(mapped, (item, index) => this.redis
            .setAsync(
              this._key("item", item.id),
              JSON.stringify(item),
              "EX",
              ItemStore.CACHE_TTL_ITEMS
            )
            .then(() =>
              index >= listLength
                ? this.redis.rpushAsync(keyList, item.id)
                : this.redis.lsetAsync(keyList, index, item.id)
            ));
      }));
  }

  static embed(item) {
    return item.media_embed;
  }

  static thumbnail(item) {
    const details = {};

    if (typeof item.thumbnail === "string" && item.thumbnail !== "nsfw") {
      details.url = item.thumbnail;
    }

    if (typeof item.media.oembed === "object") {
      for (const prop of Object.keys(item.media.oembed)) {
        // eslint-disable-line prefer-const
        const matches = prop.match(/^thumbnail_(.*)/);

        if (matches) {
          details[matches[1]] = item.media.oembed[prop];
        }
      }
    }

    return details;
  }
}

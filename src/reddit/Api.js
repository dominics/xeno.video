import rq from 'request';
import urllib from 'url';

import libdebug from 'debug';
import Promise from 'bluebird';

const pkg = require('./../../package.json');
const debug = libdebug('xeno:reddit:api');

export default class Api {
  static URL = {
    protocol: 'https',
    host: 'oauth.reddit.com',
  };

  constructor(token = null) {
    this.setToken(token);
  }

  setToken(token) {
    if (token) {
      debug('Using token', token);
    }
    this.token = token;
  }

  /**
   * @param {{json: object, response: object}} data
   * @returns Promise.<Array>
   */
  _itemListing(data) {
    if (!data.json) {
      return Promise.reject(new Error('You must pass a response to _itemListing'));
    }

    const items = [];

    if (!data.json.kind || data.json.kind !== 'Listing') {
      return Promise.reject(new Error('Invalid response kind: ' + data.json.kind));
    }

    if (!data.json.data || !data.json.data.children) {
      return Promise.reject(new Error('No data in response: ' + data.json.data));
    }

    for (let item of data.json.data.children) { // eslint-disable-line prefer-const
      items.push(item);
    }

    return Promise.resolve(items);
  }

  _multiListing(data) {
    if (!data.json) {
      return Promise.reject(new Error('You must pass a response to _multiListing'));
    }

    if (!data.json instanceof Array) {
      return Promise.reject('data.json should be an array for a multi listing');
    }

    const multis = [];

    for (const item of data.json) {
      if (item.kind !== 'LabeledMulti') {
        return Promise.reject(new Error('Unknown kind for multi listing:' + multi.kind()));
      }

      const multi = item.data;

      if (!multi.subreddits) {
        debug('No subreddits', multi);
        continue;
      }

      multis.push({
        id: multi.name,
        kind: 'multi',
        subreddits: multi.subreddits,
      });
    }

    return Promise.resolve(multis);
  }

  _subredditListing(data) {
    if (!data.json) {
      return Promise.reject(new Error('You must pass a response to _subredditListing'));
    }

    if (!data.json.kind || data.json.kind !== 'Listing') {
      return Promise.reject(new Error('Invalid response kind: ' + data.json.kind));
    }

    if (!data.json.data || !data.json.data.children) {
      return Promise.reject(new Error('No data in response: ' + data.json.data));
    }

    const subreddits = [];

    for (const subreddit of data.json.data.children) { // eslint-disable-line prefer-const
      if (subreddit.kind !== 't5') {
        debug('Invalid kind encountered in _toSubreddits: ', subreddit.kind);
        continue;
      }

      subreddits.push({
        id: subreddit.data.display_name,
        kind: 'subreddit',
      });
    }

    return Promise.resolve(subreddits);
  }

  subreddit(sub, sort) {
    debug('getting listing for', sub);

    const listingParams = {
      raw_json: 1,
      limit: 100, // max
      // after
      // before
      // count
      // show
      // sr_detail
    };

    return this._get(`/r/${sub}/${sort}.json`, listingParams)
      .then((data) => this._itemListing(data));
  }

  multis() {
    return this._get(`/api/multi/mine.json`)
      .then((data) => this._multiListing(data)); //
  }

  subscribed() {
    return this._get(`/subreddits/mine/subscriber.json`)
      .then((data) => this._subredditListing(data));
  }

  /**
   * @param pathname
   * @param params
   * @returns Promise.<Object>
   * @private
   */
  _get(pathname, params) {
    let options = {
      pathname: pathname,
      query: params,
    };

    options = Object.assign(options, Api.URL);
    const url = urllib.format(options);

    debug('Making reddit API request to ' + url);
    debug('Using token', this.token);

    return this._getJSON(url);
  }

  /**
   * @param url
   * @returns Promise.<Object>
   * @private
   */
  _getJSON(url) {
    if (!this.token) {
      return Promise.reject(new Error('Cannot make unauthenticated Reddit request'));
    }

    const options = {
      url: url,
      method: 'GET',
      headers: {
        'Authorization': 'bearer ' + this.token,
        'User-Agent': `linux-server-side:${pkg.name}:${pkg.version} (by ${pkg.author}})`,
      },
    };

    return new Promise((resolve, reject) => {
      rq(options, (err, response, body) => {
        if (err) {
          reject(err);
          return;
        }

        if (response.statusCode !== 200) {
          reject(new Error(response.statusCode));
          return;
        }

        debug('Has response type ' + response.headers['content-type']);

        const data = {
          response: response,
          json: JSON.parse(body),
        };

        resolve(data);
      });
    });
  }
}

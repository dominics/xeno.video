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

    return this._get(`/r/${subreddit}/${sort}.json`, listingParams)
      .then(this._listing);
  }

  /**
   * @param {Promise.<IncomingMessage>} response
   * @returns Promise.<Array>
   */
  _listing(response) {
    debug('Calling _listing on response', typeof response, response.name); //

    if (!response) {
      throw new Error('You must pass a response to _listing');
    }

    return response.then((responseData) => {
      const items = [];

      debug(Object.keys(responseData));

      const info = JSON.parse(responseData.body);

      if (!info.kind || info.kind !== 'Listing') {
        throw new Error('Invalid response kind');
      }

      if (!info.data || !info.data.children) {
        throw new Error('No data in response');
      }

      for (let item of info.data.children) { // eslint-disable-line prefer-const
        items.push(item);
      }

      return Promise.resolve(items);
    });
  }

  subscribed() {
    const a = this._get(`/subreddits/mine/subscriber`);
    console.log(a);

    return a
      .then((response) => this._listing(response));
  }

  meta() {
    return this._get(`/api/multi/mine`)
      .then((response) => this._listing(response)); //
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

        const data = {
          response: response,
          body:     body,
        };

        resolve(data);
      });
    });
  }
}

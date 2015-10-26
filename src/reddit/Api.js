const rq = require('request');
const urllib = require('url');
const debug = require('debug')('xeno:reddit:api');
const pkg = require('./../../package.json');

export default class Api {
  static URL = {
    protocol: 'https',
    host: 'oauth.reddit.com',
  };

  constructor(token = null) {
    this.setToken(token);
  }

  setToken(token) {
    debug('Using token', token);
    this.token = token;
  }

  listing(subreddit, sort, next) {
    debug('getting listing for', subreddit);
    const listingParams = {
      raw_json: 1,
      // after
      // before
      // count
      // limit
      // show
      // sr_detail
    };

    this._get(`/r/${subreddit}/${sort}.json`, listingParams, (err, responseData) => {
      if (err) {
        return next(err);
      }

      const items = [];

      const info = JSON.parse(responseData.body);

      if (!info.kind || info.kind !== 'Listing') {
        return next(new Error('Invalid response kind'));
      }

      if (!info.data || !info.data.children) {
        return next(new Error('No data in response'));
      }

      for (let item of info.data.children) { // eslint-disable-line prefer-const
        items.push(item);
      }

      next(null, items);
    });
  }

  _get(pathname, params, next) {
    let options = {
      pathname: pathname,
      query: params,
    };

    options = Object.assign(options, Api.URL);
    const url = urllib.format(options);

    debug('Making reddit API request to ' + url);

    this._getJSON(url, next);
  }

  _getJSON(url, next) {
    if (!this.token) {
      throw new Error('Cannot make unauthenticated Reddit request');
    }

    const options = {
      url: url,
      method: 'GET',
      headers: {
        'Authorization': 'bearer ' + this.token,
        'User-Agent': `linux-server-side:${pkg.name}:${pkg.version} (by ${pkg.author}})`,
      },
    };

    return rq(options, (err, response, body) => {
      if (err) {
        return next(err);
      }

      if (response.statusCode !== 200) {
        return next(new Error(response.statusCode));
      }

      const data = {
        response: response,
        body:     body,
      };

      next(null, data);
    });
  }
}

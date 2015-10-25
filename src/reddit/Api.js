const rq = require('request');
const urllib = require('url');
const debug = require('debug')('xeno:reddit:api');
const pkg = require('./../../package.json');

export default class Api {
  static URL = {
    protocol: 'https',
    host: 'oauth.reddit.com',
  };

  constructor(token) {
    this.token = token;

    debug('Using token', token);
  }

  listing(subreddit, sort, next) {
    const listingParams = {
      raw_json: 1,
      // after
      // before
      // count
      // limit
      // show
      // sr_detail
    };

    this._get(`/r/${subreddit}/${sort}.json`, listingParams, next);
  }

  _get(pathname, params, next) {
    let options = {
      pathname: pathname,
      query: params,
    };

    options = Object.assign(options, Api.URL);

    debug('Using URL options', options, urllib.format(options));

    this._getJSON(urllib.format(options), next);
  }

  _getJSON(url, next) {
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

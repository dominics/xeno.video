const React = require('react/addons');
import Strategy from './Strategy.jsx';
const liburl = require('url');
const debug = require('debug')('render');
const Immutable = require('immutable');
const querystring = require('querystring');

export default class GeneralStategy extends Strategy {
  /**
   * @param initialUrl Immutable.Map of parsed url details, from url.parse
   * @returns Immutable.Map of parsed url details, for url.format
   */
  transformUrlParts(initialUrl) {
    debug('Initial URL', initialUrl.toJS());

    let url = this.sanitizeUrl(initialUrl);
    debug('After sanitization', url.toJS());

    url = this.mapId(url);
    debug('After ID mapping', url.toJS());

    url = this.mapHost(url);
    debug('After host mapping', url.toJS());

    return url;
  }

  /**
   * @param initialUrl Immutable.Map
   * @returns Immutable.Map
   */
  sanitizeUrl(initialUrl) {
    return initialUrl.withMutations(url => {
      return url
        .delete('href')
        .delete('path')
        .delete('hostname')
        .delete('search')
        .delete('auth')
        .update('query', q => Immutable.OrderedMap(querystring.parse(q)));
    });
  }

  mapHost(initialUrl) {
    if (initialUrl.get('host') === 'youtu.be') {
      return initialUrl.set('host', 'www.youtube.com');
    }

    return initialUrl;
  }

  mapId(initialUrl) {
    if (initialUrl.hasIn(['query', 'v'])) {
      debug('Mapping via query.v');

      const id = initialUrl.getIn(['query', 'v']);

      return initialUrl.withMutations((p) => {
        return p.deleteIn(['query']).set('pathname', this.embedPath(id));
      });
    }

    const matches = initialUrl.get('pathname').match(/^\/([^\/]{6,})$/);

    if (matches !== null) {
      debug('Mapping by single path name component');
      return initialUrl.set('pathname', this.embedPath(matches[1]));
    }

    debug('No ID mapping found');
    return initialUrl;
  }

  embedPath(id) {
    return '/embed/' + id;
  }

  render(viewer, url) {
    const parsed = Immutable.OrderedMap(liburl.parse(url));

    const embedUrl = liburl.format(
      this.transformUrlParts(
        parsed
      ).toJS()
    );

    debug('Final URL', embedUrl);

    return (
      <iframe src={embedUrl} allowFullScreen></iframe>
    );
  }
}

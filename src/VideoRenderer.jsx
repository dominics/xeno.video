import * as domains from './../data/domains.dat.js';

const parseUrl = require('url').parse;
const debug = require('debug')('render');

import UnsupportedStrategy from './strategy/UnsupportedStrategy.jsx';
import GeneralStrategy from './strategy/GeneralStrategy.jsx';
import YoutubeStrategy from './strategy/YoutubeStrategy.jsx';

export default class VideoRenderer {
  constructor(viewer) {
    this.viewer = viewer;
  }

  render(url) {
    const strategy = VideoRenderer.decideStrategy(url);

    debug('Using strategy', strategy);

    return strategy.render(this.viewer, url);
  }

  static decideStrategy(url) {
    const parts = parseUrl(url);

    if (!parts.hostname) {
      throw new Error('Invalid URL: no hostname');
    }

    if (domains.match(parts.hostname, domains.general)) {
      return new GeneralStrategy();
    }

    if (domains.match(parts.hostname, domains.youtube)) {
      return new YoutubeStrategy();
    }

    return new UnsupportedStrategy();
  }
}

import GeneralStrategy from './GeneralStrategy.jsx';
const debug = require('debug')('xeno:render');

export default class UnsupportedStrategy extends GeneralStrategy {
  render(viewer, url) {
    debug('Unsupported URL', url);

    return super.render(viewer, url);
  }
}

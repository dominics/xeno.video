const GeneralStrategy = require('./GeneralStrategy.jsx');
const debug = require('debug')('render');

module.exports = class UnsupportedStrategy extends GeneralStrategy {
  render(viewer, url) {
    debug('Unsupported URL', url);

    return super.render(viewer, url);
  }
};

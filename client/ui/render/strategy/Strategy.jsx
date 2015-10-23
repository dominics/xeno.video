const debug = require('debug')('render');

module.exports = class Strategy {
  render(viewer, url) {
    debug('Unimplemented renderer', url, viewer);
    return null;
  }
};

const debug = require('debug')('render');

export default class Strategy {
  render(viewer, url) {
    debug('Unimplemented renderer', url, viewer);
    return null;
  }
}

const debug = require('debug')('render');

export default class Strategy {
  render(url) {
    debug('Unimplemented renderer', url);
    return null;
  }
}

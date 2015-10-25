const debug = require('debug')('xeno:render');

export default class Strategy {
  render(url) {
    debug('Unimplemented renderer', url);
    return null;
  }
}

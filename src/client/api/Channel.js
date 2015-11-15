import Api from './Api';
import libdebug from 'debug';

const debug = libdebug('xeno:api:channel');

export default class Channel extends Api
{
  refresh() {
    debug('Refreshing Channel via API');
    return this.getJSON(
      '/channel/all'
    );
  }
}

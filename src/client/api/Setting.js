import Api from './Api';
import libdebug from 'debug';

const debug = libdebug('xeno:api:setting');

export default class Setting extends Api
{
  refresh() {
    debug('Refreshing Setting via API');
    return this.getJSON(
      '/setting/all'
    );
  }
}

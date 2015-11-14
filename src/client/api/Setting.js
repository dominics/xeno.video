import Api from './Api';
import libdebug from 'debug';

const debug = libdebug('xeno:api:setting');

export default class Setting extends Api
{
  getAll() {
    debug('Getting all settings from API');
  }
}

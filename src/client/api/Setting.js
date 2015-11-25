import Api from './Api';
import libdebug from 'debug';
import SettingValue from './../setting/Setting';

const debug = libdebug('xeno:api:setting');

export default class Setting extends Api
{
  refresh() {
    debug('Refreshing Setting via API');
    return this.getJSON(
      '/api/setting/all'
    ).then((data) => {
      return Promise.resolve(data.map(setting => new SettingValue(setting.id, setting.value)));
    });
  }
}

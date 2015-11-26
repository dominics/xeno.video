import Api from './Api';
import libdebug from 'debug';
import SettingValue from './../setting/Setting';

const debug = libdebug('xeno:api:setting');

export default class Setting extends Api
{
  refresh() {
    debug('Refreshing Setting via API');
    return this.get(
      '/api/setting/all'
    ).then(this._toValueObjects);
  }

  update(data) {
    return this.patch(
      '/api/setting',
      {
        type: 'setting',
        data: [], // TODO merge data
      }
    ).then(this._toValueObjects);
  }

  _toValueObjects(data) {
    return Promise.resolve(data.map(setting => new SettingValue(setting.id, setting.value)));
  }
}

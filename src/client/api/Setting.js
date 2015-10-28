import Api from './Api';
import libdebug from 'debug';
import { default as registry, pending, receiveSettings } from '../action';

const debug = libdebug('xeno:api:setting');

export default class Setting extends Api
{
  refresh() {
    return this.get(
      '/setting/all',
      registry.get(pending),
      registry.get(receiveSettings)
    );
  }
}
